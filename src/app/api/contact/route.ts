import { NextResponse } from "next/server";

import { MailNotConfiguredError, sendContactMail } from "@/lib/mail";

/**
 * POST /api/contact — delivers a contact-form submission to the inbox.
 *
 * This route used to log the submission and return 200, so the form reported
 * "Message sent" for enquiries that were never sent anywhere. A 200 here now
 * means the MTA accepted the message; every other outcome is an explicit error
 * the client renders.
 *
 * Failures answer with a stable `code` rather than a message: the client owns the
 * wording (it is translated), and an SMTP error string has no business reaching a
 * visitor. The real cause goes to the pm2 log — `npm run pm2:logs`.
 */

// Nodemailer opens a TCP socket, which the edge runtime cannot do. Next already
// defaults to node for route handlers; stating it means a future default change
// cannot silently break delivery.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode = "invalid" | "rate_limited" | "unavailable" | "send_failed";

/** Generous enough for a real enquiry, small enough to bound what we hand the MTA. */
const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 } as const;

/** Anything past this is not a contact form submission. Checked before parsing. */
const MAX_BODY_BYTES = 20_000;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;

/**
 * Sliding-window counters, per IP, in process memory.
 *
 * PM2 runs this app as a single fork — `exec_mode: "fork"`, `instances: 1` in
 * ecosystem.config.js — so one in-process map really is authoritative. Move this
 * to a shared store the day the app is clustered, or the limit becomes per worker.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT.windowMs;

  // Opportunistic prune: without it, every IP that ever posted stays resident.
  for (const [key, times] of hits) {
    const live = times.filter((time) => time > cutoff);
    if (live.length === 0) hits.delete(key);
    else hits.set(key, live);
  }

  const recent = hits.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT.max) return true;

  hits.set(ip, [...recent, now]);
  return false;
}

/**
 * Apache is the only thing that can reach 127.0.0.1:3100 (the standalone server
 * binds loopback), and mod_proxy *appends* the peer it saw to X-Forwarded-For.
 * So the LAST entry is the address Apache observed; the earlier ones are whatever
 * the client chose to claim. Taking the first would let anyone rotate a header
 * value and walk straight through the rate limit.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

// Control characters, minus the ones a message body may legitimately contain.
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
const CONTROL_CHARS_KEEP_BREAKS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

/**
 * Coerce one field, or return null if it is unusable.
 *
 * `singleLine` fields end up in mail headers, so their line breaks and control
 * characters are removed rather than trimmed — a bare CR/LF there is a header
 * injection. Nodemailer encodes headers too; this is the belt to that's braces.
 */
function field(value: unknown, max: number, singleLine: boolean): string | null {
  if (typeof value !== "string") return null;

  const cleaned = singleLine
    ? value.replace(/[\r\n]+/g, " ").replace(CONTROL_CHARS, "")
    : value.replace(/\r\n/g, "\n").replace(CONTROL_CHARS_KEEP_BREAKS, "");

  const trimmed = cleaned.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

// Deliberately loose. Address syntax is not worth policing beyond "could plausibly
// be delivered" — the real check is whether the reply bounces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fail(code: ErrorCode, status: number, headers?: HeadersInit) {
  return NextResponse.json({ code }, { status, headers });
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("invalid", 400);
  }

  if (raw.length > MAX_BODY_BYTES) return fail("invalid", 400);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("invalid", 400);
  }

  if (typeof body !== "object" || body === null) return fail("invalid", 400);
  const payload = body as Record<string, unknown>;

  // Honeypot: a field hidden from people and irresistible to form-filling bots.
  // Answer 200 so the bot books it as a success and moves on, and never mail it.
  if (typeof payload.company === "string" && payload.company.trim().length > 0) {
    console.warn(`[contact] honeypot tripped from ${ip} — discarded`);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = field(payload.name, LIMITS.name, true);
  const email = field(payload.email, LIMITS.email, true);
  const subject = field(payload.subject, LIMITS.subject, true);
  const message = field(payload.message, LIMITS.message, false);

  if (!name || !email || !subject || !message || !EMAIL.test(email)) {
    return fail("invalid", 400);
  }

  // Rate limit only after the payload proves well-formed, so a visitor who fumbles
  // the form a few times does not burn their allowance.
  if (rateLimited(ip)) {
    console.warn(`[contact] rate limited ${ip}`);
    return fail("rate_limited", 429, {
      "Retry-After": String(Math.ceil(RATE_LIMIT.windowMs / 1000)),
    });
  }

  try {
    await sendContactMail({ name, email, subject, message, ip });
  } catch (error) {
    if (error instanceof MailNotConfiguredError) {
      // Misconfiguration, not a transient fault — say so loudly in the log.
      console.error(`[contact] mail is not configured: ${error.message}`);
      return fail("unavailable", 503);
    }
    console.error("[contact] send failed:", error);
    return fail("send_failed", 502);
  }

  console.log(`[contact] delivered enquiry from ${email} (${ip})`);
  return NextResponse.json({ ok: true }, { status: 200 });
}
