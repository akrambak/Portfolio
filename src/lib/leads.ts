import "server-only";

import { appendFile, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

import { MAX_IP, MAX_UA, readAllOpens, storeSibling, type OpenRecord } from "./tracking";

/**
 * Lead engagement store — the layer above the email-open pixel (src/lib/tracking.ts).
 *
 * Career-OS mints one opaque `lead_key` per shop it emails and POSTs that lead's
 * security report here (`upsertLead`). The proposal links to `/r/<lead_key>`, which
 * renders the report and beacons what the visitor does back to `/px/e` (`recordEvent`).
 * Career-OS pulls the stream from `/px/events.json` (`readEvents`) — together with the
 * raw opens — to stitch the whole journey (open → click → report view → site visit →
 * reply) to one lead and forward it to GA4.
 *
 * Everything is file-backed next to the opens log, so one `TRACKING_STORE`-derived
 * path under `shared/` holds every tracking artefact and survives deploys.
 */

const EVENTS = storeSibling("events.jsonl");
const LEADS_DIR = storeSibling("leads");

/** A lead_key is Career-OS's `secrets.token_urlsafe(16)` → 22 URL-safe chars; allow a
 *  range so the key length can change without a site deploy. Also the report slug, so
 *  it must never contain a path separator. */
const LEAD_KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;

/** The only event types a public beacon may record. Anything else is dropped, so a
 *  passer-by who finds `/px/e` cannot invent event names that pollute GA4. */
export const EVENT_TYPES = new Set([
  "report_view",
  "report_engaged",
  "page_view",
  "cta_click",
  "book_call_click",
  "email_click",
  "quote_request",
  "generate_lead",
  "unsubscribe",
]);

const MAX_PATH = 512;
const MAX_META = 2048; // serialized meta object
const MAX_TYPE = 64;

export type LeadEvent = {
  type: string;
  lead: string;
  at: string;
  path?: string;
  ua?: string;
  ip?: string;
  ga_cid?: string;
  meta?: Record<string, unknown>;
};

export type ReportCve = {
  cve: string;
  severity?: string;
  cvss?: number;
  title?: string;
  kev: boolean;
  match: string;
};

export type LeadReport = {
  lead: string;
  domain: string;
  url?: string;
  platform: "prestashop" | "magento";
  running: string;
  eol: boolean;
  eol_note?: string;
  php?: string;
  cves: ReportCve[];
  cve_count: number;
  price: number;
  language: "en" | "fr";
  contact_url?: string;
  campaign?: { platform?: string; touch?: string; variant?: string };
  created_at: string;
  expires_at: string;
};

export function isLeadKey(value: string): boolean {
  return LEAD_KEY_RE.test(value);
}

/** Parse GA4's `_ga` cookie into the client_id GA expects (`1234567890.1234567890`).
 *  The cookie is `GA1.1.<cid1>.<cid2>`; the client_id is the last two dot-parts. */
export function parseGaClientId(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const entry = cookieHeader
    .split("; ")
    .find((part) => part.startsWith("_ga="));
  if (!entry) return undefined;
  const value = entry.slice("_ga=".length);
  const m = /^GA\d\.\d\.(\d+\.\d+)$/.exec(value);
  return m ? m[1] : undefined;
}

let eventsDirReady: Promise<void> | null = null;
function ensureEventsDir(): Promise<void> {
  if (!eventsDirReady) {
    eventsDirReady = mkdir(dirname(EVENTS), { recursive: true }).then(() => {});
  }
  return eventsDirReady;
}

/**
 * Append one engagement event. Never throws — a logging failure must not fail the
 * beacon or the report render. Caller validates the type against EVENT_TYPES; here we
 * only bound the attacker-controlled fields so a single hit cannot bloat the file.
 */
export async function recordEvent(e: LeadEvent): Promise<void> {
  if (!isLeadKey(e.lead) || typeof e.type !== "string" || e.type.length > MAX_TYPE) return;

  let meta: Record<string, unknown> | undefined;
  if (e.meta && typeof e.meta === "object") {
    const serialized = JSON.stringify(e.meta);
    if (serialized.length <= MAX_META) meta = e.meta;
  }

  const line =
    JSON.stringify({
      v: 1,
      type: e.type,
      lead: e.lead,
      at: e.at || new Date().toISOString(),
      path: typeof e.path === "string" ? e.path.slice(0, MAX_PATH) : undefined,
      ua: (e.ua ?? "").slice(0, MAX_UA) || undefined,
      ip: (e.ip ?? "").slice(0, MAX_IP) || undefined,
      ga_cid: typeof e.ga_cid === "string" ? e.ga_cid.slice(0, 64) : undefined,
      meta,
    }) + "\n";

  try {
    await ensureEventsDir();
    await appendFile(EVENTS, line);
  } catch (error) {
    eventsDirReady = null;
    console.warn(
      "[leads] could not record event:",
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * The engagement stream Career-OS pulls: beacon events at `at >= since`, plus every
 * raw open as `{ type:"open", token, at, ua, ip }`. Opens carry no lead_key — they are
 * keyed by the per-send pixel token — so Career-OS resolves them to a lead on its side.
 * A torn final line is skipped rather than failing the whole readback.
 */
export async function readEvents(since?: string): Promise<LeadEvent[]> {
  const opens = (await readAllOpens(since)).map(openToEvent);

  let raw: string;
  try {
    raw = await readFile(EVENTS, "utf8");
  } catch {
    return opens;
  }

  const events: LeadEvent[] = [];
  for (const line of raw.split("\n")) {
    if (!line) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") continue;
    const row = parsed as Record<string, unknown>;
    if (typeof row.type !== "string" || typeof row.at !== "string") continue;
    if (since && row.at < since) continue;
    events.push(row as unknown as LeadEvent);
  }

  return [...opens, ...events];
}

function openToEvent(o: OpenRecord): LeadEvent {
  return { type: "open", lead: "", at: o.opened_at, meta: { token: o.token }, ua: o.ua, ip: o.ip };
}

function leadPath(key: string): string {
  return join(LEADS_DIR, `${key}.json`);
}

/** Store (or replace) a lead's report. Career-OS is the only caller, behind the Bearer
 *  readback auth, so the record is trusted; the key is still checked to keep it inside
 *  LEADS_DIR. */
export async function upsertLead(report: LeadReport): Promise<void> {
  if (!isLeadKey(report.lead)) throw new Error("invalid lead key");
  await mkdir(LEADS_DIR, { recursive: true });
  await writeFile(leadPath(report.lead), JSON.stringify(report), "utf8");
}

/** A lead's report, or null if unknown or past `expires_at`. */
export async function getLead(key: string): Promise<LeadReport | null> {
  if (!isLeadKey(key)) return null;
  let raw: string;
  try {
    raw = await readFile(leadPath(key), "utf8");
  } catch {
    return null;
  }
  let report: LeadReport;
  try {
    report = JSON.parse(raw) as LeadReport;
  } catch {
    return null;
  }
  if (report.expires_at && report.expires_at < new Date().toISOString()) return null;
  return report;
}

/** Remove a lead's report (unsubscribe, or Career-OS retiring a stale lead). Idempotent. */
export async function deleteLead(key: string): Promise<void> {
  if (!isLeadKey(key)) return;
  await rm(leadPath(key), { force: true });
}
