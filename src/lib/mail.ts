import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import { configured, site } from "@/config/site";

/**
 * Mail transport for the contact form.
 *
 * Defaults to the MTA on the VPS itself — 127.0.0.1:25, the Postfix that
 * Virtualmin installs. bak-dev.com's MX *is* that same machine, so a submission
 * is one loopback hop followed by local delivery: it never crosses the internet,
 * needs no credentials, and is never graded by someone else's spam filter.
 *
 * Every setting is env-driven, so moving to authenticated submission
 * (mail.bak-dev.com:587) or an external relay is an edit to
 * shared/.env.production on the VPS rather than a code change. The variables and
 * their defaults are documented in .env.production.example — keep the two in step.
 */

/** Required configuration is absent. The route answers 503, never a fake success. */
export class MailNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailNotConfiguredError";
  }
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Recorded in the body for abuse triage. Never interpolated into a header. */
  ip?: string;
}

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  rejectUnauthorized: boolean;
  to: string;
  from: string;
}

const LOOPBACK = new Set(["127.0.0.1", "::1", "localhost"]);

/** "0" / "false" / "no" -> false, "1" / "true" / "yes" -> true, anything else -> undefined. */
function envFlag(raw: string | undefined): boolean | undefined {
  if (raw === undefined) return undefined;
  const value = raw.trim().toLowerCase();
  if (["0", "false", "no", "off"].includes(value)) return false;
  if (["1", "true", "yes", "on"].includes(value)) return true;
  return undefined;
}

/** The site's own domain — the only one we may legitimately send *as*. */
function siteDomain(): string {
  try {
    return new URL(site.url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function readConfig(): MailConfig {
  const host = process.env.SMTP_HOST?.trim() || "127.0.0.1";

  const port = Number(process.env.SMTP_PORT?.trim() || 25);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new MailNotConfiguredError(
      `SMTP_PORT is not a valid port number: ${process.env.SMTP_PORT}`,
    );
  }

  const to = process.env.CONTACT_TO?.trim() || (configured(site.email) ? site.email : "");
  if (!to) {
    throw new MailNotConfiguredError(
      "No recipient. Set CONTACT_TO, or fill in site.email in src/config/site.ts.",
    );
  }

  // The From address must belong to the SITE's domain, never the visitor's. An
  // envelope sender the domain does not own fails SPF/DMARC at the receiving end
  // and Postfix may refuse to relay it at all. The visitor goes in Reply-To, which
  // is what "reply to this enquiry" actually needs.
  const domain = siteDomain();
  const from =
    process.env.CONTACT_FROM?.trim() || (domain ? `Portfolio <noreply@${domain}>` : "");
  if (!from) {
    throw new MailNotConfiguredError(
      `No sender. Set CONTACT_FROM, or a parseable site.url (got "${site.url}").`,
    );
  }

  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  // Certificate verification is worth nothing on a hop that never leaves the
  // machine, and Virtualmin's Postfix routinely presents a self-signed or
  // name-mismatched cert on loopback — which would otherwise fail every send with
  // a bewildering "self-signed certificate" error. Only relaxed for loopback, and
  // only until SMTP_TLS_REJECT_UNAUTHORIZED says otherwise.
  const rejectUnauthorized =
    envFlag(process.env.SMTP_TLS_REJECT_UNAUTHORIZED) ?? !LOOPBACK.has(host);

  return {
    host,
    port,
    // Implicit TLS is port 465. Everything else negotiates STARTTLS opportunistically.
    secure: envFlag(process.env.SMTP_SECURE) ?? port === 465,
    auth: user && pass ? { user, pass } : undefined,
    rejectUnauthorized,
    to,
    from,
  };
}

let cached: { transporter: Transporter; config: MailConfig } | null = null;

function mailer(): { transporter: Transporter; config: MailConfig } {
  if (cached) return cached;

  const config = readConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: { rejectUnauthorized: config.rejectUnauthorized },
    // A wedged MTA must not pin the request. Next has no timeout of its own here,
    // so without these a stuck socket would hold the connection open indefinitely.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  cached = { transporter, config };
  return cached;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function textBody({ name, email, subject, message, ip }: ContactSubmission): string {
  return [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    "",
    message,
    "",
    "--",
    `Sent from the ${siteDomain() || site.name} contact form`,
    `${new Date().toISOString()}${ip ? `  ·  ${ip}` : ""}`,
  ].join("\n");
}

function htmlBody({ name, email, subject, message, ip }: ContactSubmission): string {
  const rows = [
    ["Name", escapeHtml(name)],
    ["Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`],
    ["Subject", escapeHtml(subject)],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:2px 12px 2px 0;color:#666;">${label}</td><td>${value}</td></tr>`,
    )
    .join("");

  return [
    '<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;">',
    `<table style="border-collapse:collapse;margin-bottom:16px;">${rows}</table>`,
    `<div style="white-space:pre-wrap;">${escapeHtml(message)}</div>`,
    '<hr style="border:none;border-top:1px solid #ddd;margin:20px 0 8px;">',
    `<p style="color:#888;font-size:12px;">Sent from the ${escapeHtml(
      siteDomain() || site.name,
    )} contact form · ${new Date().toISOString()}${ip ? ` · ${escapeHtml(ip)}` : ""}</p>`,
    "</div>",
  ].join("");
}

/**
 * Hand the submission to the MTA. Resolves only once the server has accepted it;
 * throws otherwise, so the caller can never report a success that did not happen.
 *
 * Fields are expected to be validated and header-safe already — see the route.
 */
export async function sendContactMail(submission: ContactSubmission): Promise<void> {
  const { transporter, config } = mailer();

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    // Replying in the mail client answers the visitor, not noreply@.
    replyTo: { name: submission.name, address: submission.email },
    subject: `[Portfolio] ${submission.subject}`,
    text: textBody(submission),
    html: htmlBody(submission),
    // Gives the inbox something stable to filter on.
    headers: { "X-Portfolio-Contact": "1" },
  });
}

/** Connect and run the SMTP handshake without sending. Used by scripts/check-mail.mjs. */
export async function verifyMailConnection(): Promise<MailConfig> {
  const { transporter, config } = mailer();
  await transporter.verify();
  return config;
}
