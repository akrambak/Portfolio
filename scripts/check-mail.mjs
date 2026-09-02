#!/usr/bin/env node
//
// Contact-form mail diagnostics. Runs ON THE VPS, from the live release:
//
//   cd /home/bak-dev/apps/portfolio/current
//   node scripts/check-mail.mjs           # resolve config, connect, SMTP handshake
//   node scripts/check-mail.mjs --send    # ...and actually send a test message
//
// It ships inside the release (scripts/package-release.sh copies it) so it uses
// the same bundled nodemailer the app does, and reads the same .env.production
// the app reads. When the form misbehaves in production this separates "the MTA
// is unreachable" from "the app is broken" in one command, without waiting for a
// visitor to trip over it.
//
// The defaults below mirror src/lib/mail.ts. They are duplicated because this
// script cannot import the compiled bundle — keep the two in step, and prefer
// setting values explicitly in .env.production over relying on either copy.

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch {
  fail(
    "nodemailer is not in this release's node_modules.",
    "Run this from the release root (the directory holding server.js), not from scripts/.",
  );
}

const send = process.argv.includes("--send");

function fail(...lines) {
  for (const line of lines) console.error(line);
  process.exit(1);
}

// --- .env.production ---------------------------------------------------------
// Same precedence Next uses: a variable already in the environment wins, the
// file fills in the rest.
function parseEnvFile(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return null;
  }

  const values = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim().replace(/^export\s+/, "");
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const fileEnv = parseEnvFile(".env.production");
if (fileEnv === null) {
  console.warn("!  No .env.production in the current directory — using defaults only.");
}

const env = (key) => process.env[key] ?? fileEnv?.[key] ?? undefined;

// --- Resolve ------------------------------------------------------------------
const LOOPBACK = new Set(["127.0.0.1", "::1", "localhost"]);

function flag(raw) {
  if (raw === undefined) return undefined;
  const value = raw.trim().toLowerCase();
  if (["0", "false", "no", "off"].includes(value)) return false;
  if (["1", "true", "yes", "on"].includes(value)) return true;
  return undefined;
}

const host = env("SMTP_HOST")?.trim() || "127.0.0.1";
const port = Number(env("SMTP_PORT")?.trim() || 25);
const user = env("SMTP_USER")?.trim();
const pass = env("SMTP_PASS");

const to = env("CONTACT_TO")?.trim();
if (!to) {
  fail(
    "No recipient: CONTACT_TO is not set in .env.production.",
    "The app falls back to site.email from src/config/site.ts, which this script cannot read.",
    "Set CONTACT_TO explicitly to test delivery.",
  );
}

// The app derives this from site.url. Falling back to the recipient's domain
// gives the same answer whenever the inbox is on the site's own domain.
const from = env("CONTACT_FROM")?.trim() || `Portfolio <noreply@${to.split("@")[1]}>`;

const rejectUnauthorized = flag(env("SMTP_TLS_REJECT_UNAUTHORIZED")) ?? !LOOPBACK.has(host);
const secure = flag(env("SMTP_SECURE")) ?? port === 465;

console.log("Resolved contact mail config");
console.log(`  host                 ${host}:${port}`);
console.log(`  implicit TLS         ${secure}`);
console.log(`  verify certificate   ${rejectUnauthorized}`);
console.log(`  auth                 ${user ? `${user} / ${pass ? "(password set)" : "(NO PASSWORD)"}` : "none"}`);
console.log(`  from                 ${from}`);
console.log(`  to                   ${to}`);
console.log("");

// --- Connect ------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: user && pass ? { user, pass } : undefined,
  tls: { rejectUnauthorized },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

function explain(error) {
  const code = error?.code;
  const text = String(error?.message ?? "");

  // Nodemailer reports a refused connection as ESOCKET and keeps the underlying
  // errno only in the message, so match on the text rather than on `code`.
  if (text.includes("ECONNREFUSED") || code === "ECONNREFUSED") {
    return [
      `Nothing is listening on ${host}:${port}.`,
      "  systemctl status postfix",
      "  ss -lntp | grep ':25'",
      "If Postfix is running but bound elsewhere, check inet_interfaces in /etc/postfix/main.cf.",
    ];
  }
  if (code === "ETIMEDOUT" || code === "ESOCKET") {
    return [
      `Could not complete a connection to ${host}:${port} (${code}).`,
      "A firewall between here and the MTA, or the wrong port, is the usual cause.",
    ];
  }
  if (code === "EAUTH") {
    return ["The MTA rejected the credentials. Check SMTP_USER / SMTP_PASS."];
  }
  if (String(error?.message ?? "").includes("self-signed")) {
    return [
      "The MTA presented a certificate that does not validate.",
      "For a loopback host this is expected and harmless — set SMTP_TLS_REJECT_UNAUTHORIZED=false.",
      "For a remote relay, fix the certificate rather than disabling the check.",
    ];
  }
  return [];
}

try {
  await transporter.verify();
  console.log(`OK  connected to ${host}:${port} and completed the SMTP handshake.`);
} catch (error) {
  console.error(`FAIL  could not reach the MTA: ${error?.message ?? error}`);
  for (const line of explain(error)) console.error(`      ${line}`);
  process.exit(1);
}

if (!send) {
  console.log("");
  console.log("Re-run with --send to deliver a test message to " + to + ".");
  process.exit(0);
}

// --- Send ---------------------------------------------------------------------
const stamp = new Date().toISOString();
try {
  const info = await transporter.sendMail({
    from,
    to,
    replyTo: { name: "Contact form check", address: to },
    subject: `[Portfolio] check-mail.mjs ${stamp}`,
    text: [
      "This is a test message from scripts/check-mail.mjs.",
      "",
      `Sent ${stamp} from ${host}:${port}.`,
      "If you are reading it in the inbox, the contact form's delivery path works.",
    ].join("\n"),
    headers: { "X-Portfolio-Contact": "1" },
  });

  console.log(`OK  the MTA accepted the message (id ${info.messageId}).`);
  if (info.rejected?.length) {
    console.warn(`!   rejected recipients: ${info.rejected.join(", ")}`);
  }
  console.log("");
  console.log(`Now check the ${to} inbox. Accepted != delivered — if it does not`);
  console.log("arrive, the message was queued or bounced after this point:");
  console.log("  mailq                      # anything stuck in the queue");
  console.log("  tail -n 50 /var/log/mail.log");
} catch (error) {
  console.error(`FAIL  the MTA refused the message: ${error?.message ?? error}`);
  for (const line of explain(error)) console.error(`      ${line}`);
  process.exit(1);
}
