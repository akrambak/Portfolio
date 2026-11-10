import { NextResponse } from "next/server";

import {
  EVENT_TYPES,
  getLead,
  isLeadKey,
  parseGaClientId,
  recordEvent,
} from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The identity cookie: the lead_key, so the browser tags the rest of the visit with
// the same lead the email link carried. Pseudonymous (it maps to a shop only inside
// Career-OS), readable by the page script on purpose, Lax so it survives the click-in.
const LID_COOKIE = "lid";
const LID_MAX_AGE = 60 * 60 * 24 * 180;

const MAX_BODY_BYTES = 8_000;

// A crude per-IP sliding window, in process memory, mirroring the contact route. It
// bounds how fast one source can append to the event log; it is not a security
// control and resets on redeploy.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // bound the map itself
  return recent.length > MAX_PER_WINDOW;
}

/**
 * POST /px/e — the public engagement beacon.
 *
 * The report page and the site's analytics layer post `{ type, path, meta, lead? }`
 * here as the visitor acts. The lead comes from the `lid` cookie or, on the very first
 * report view, the body; it must name a report that exists, so a stranger cannot write
 * events for arbitrary keys. Always answers 204 — the caller is a fire-and-forget
 * beacon and the response carries nothing but the identity cookie.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (ip && rateLimited(ip)) return noContent();

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return noContent();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return noContent();
  }

  const type = typeof body.type === "string" ? body.type : "";
  if (!EVENT_TYPES.has(type)) return noContent();

  const cookieHeader = request.headers.get("cookie");
  const fromCookie = readCookie(cookieHeader, LID_COOKIE);
  const fromBody = typeof body.lead === "string" ? body.lead : "";
  const lead = isLeadKey(fromCookie) ? fromCookie : isLeadKey(fromBody) ? fromBody : "";
  if (!lead) return noContent();

  // The lead must have a live report. This both drops forged keys and stops recording
  // against a lead that has unsubscribed (its report is deleted).
  if (!(await getLead(lead))) return noContent();

  await recordEvent({
    type,
    lead,
    at: new Date().toISOString(),
    path: typeof body.path === "string" ? body.path : undefined,
    ua: request.headers.get("user-agent") ?? undefined,
    ip,
    ga_cid: parseGaClientId(cookieHeader),
    meta: body.meta && typeof body.meta === "object" ? (body.meta as Record<string, unknown>) : undefined,
  });

  return noContent(lead);
}

function noContent(setLead?: string) {
  const res = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (setLead) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.headers.set(
      "Set-Cookie",
      `${LID_COOKIE}=${setLead}; Path=/; Max-Age=${LID_MAX_AGE}; SameSite=Lax${secure}`,
    );
  }
  return res;
}

function readCookie(header: string | null, name: string): string {
  if (!header) return "";
  const entry = header.split("; ").find((part) => part.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : "";
}
