import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";
import { dirname, join } from "node:path";

/**
 * Email-open tracking store.
 *
 * The separate Career-OS tool embeds a 1×1 pixel at `/px/o/<token>.gif` in each
 * upgrade proposal. When a lead opens the mail, their client loads the pixel,
 * `recordOpen` appends a line here, and Career-OS later pulls the first open per
 * token back over `/px/opens.json` (`readOpens`) to stamp its own records. The
 * two route handlers under `src/app/px/**` are thin wrappers over this module.
 *
 * Opens are a *soft* signal. Apple Mail Privacy Protection pre-fetches images,
 * so some recorded opens are the proxy and not the human, and Gmail serves the
 * pixel through its own cache. Read a recorded open as "the pixel loaded",
 * nothing stronger — which is why Career-OS does not gate its follow-up on it.
 */

// A 1×1 transparent GIF, 42 bytes (this canonical base64 decodes to 42, not the
// oft-quoted 43). The smallest payload every mail client reads as an image, so
// none of them draw a broken-image placeholder in its place.
export const TRACKING_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

/**
 * Where opens are logged, one JSON object per line.
 *
 * In production this MUST be an absolute path OUTSIDE the release tree. The
 * default lands under process.cwd(), which on the VPS is the `current` release
 * symlink (see ecosystem.config.js) — a tree scripts/remote-activate.sh prunes a
 * few deploys later, taking the opens with it. Point TRACKING_STORE at a path
 * under `shared/`, which survives deploys and rollbacks:
 *
 *   TRACKING_STORE=/home/bak-dev/apps/portfolio/shared/data/opens.jsonl
 *
 * In development the default is fine; `.data/` is git-ignored.
 */
export const STORE =
  process.env.TRACKING_STORE?.trim() || join(process.cwd(), ".data", "opens.jsonl");

/** A file or directory next to the opens store, so every tracking artefact shares
 *  one `shared/`-backed location in production (see src/lib/leads.ts). */
export function storeSibling(name: string): string {
  return join(dirname(STORE), name);
}

if (process.env.NODE_ENV === "production" && !process.env.TRACKING_STORE?.trim()) {
  // Misconfiguration, not a transient fault — say so loudly, the way the contact
  // route does. Left unset, every open is written into a release tree that the
  // next few deploys will prune, so they are silently lost.
  console.warn(
    "[tracking] TRACKING_STORE is unset: opens are being written inside the release tree " +
      "and will be lost on a later deploy. Set it to a path under shared/ (see .env.production.example).",
  );
}

// A token we mint is an opaque URL-safe string; anything else cannot be one of
// ours. Rejecting the rest keeps a passer-by who hits the public pixel URL from
// writing arbitrary keys into the log, and bounds the line length.
export const TOKEN_RE = /^[A-Za-z0-9._-]{1,128}$/;

// The user-agent and forwarded-for are attacker-controlled and only ever
// diagnostic (the readback returns neither). Bound them so a client cannot bloat
// the file with a megabyte header on every hit.
export const MAX_UA = 512;
export const MAX_IP = 128;

export type Open = { token: string; opened_at: string };
export type OpenRecord = { token: string; opened_at: string; ua: string; ip: string };

// mkdir is idempotent with { recursive: true }, but memoising it keeps the store
// directory off the hot path after the first write. Reset on failure so a
// transient error (a full disk that is later cleared) can be retried.
let dirReady: Promise<void> | null = null;
function ensureDir(): Promise<void> {
  if (!dirReady) {
    dirReady = mkdir(dirname(STORE), { recursive: true }).then(() => {});
  }
  return dirReady;
}

/**
 * Append one open to the store. Never throws: a logging failure must not fail
 * the pixel, because a broken image in the lead's inbox is worse than a missed
 * open. An unrecognised token is dropped silently for the same reason.
 */
export async function recordOpen(
  token: string,
  meta: { ua?: string | null; ip?: string | null },
): Promise<void> {
  if (!TOKEN_RE.test(token)) return;

  const line =
    JSON.stringify({
      token,
      // toISOString() is fixed-width UTC ("…Z"), which readOpens relies on to
      // pick the earliest open by a plain string compare.
      opened_at: new Date().toISOString(),
      ua: (meta.ua ?? "").slice(0, MAX_UA),
      ip: (meta.ip ?? "").slice(0, MAX_IP),
    }) + "\n";

  try {
    await ensureDir();
    await appendFile(STORE, line);
  } catch (error) {
    dirReady = null;
    console.warn(
      "[tracking] could not record open:",
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * The first (earliest) open per token, as `[{ token, opened_at }]`.
 *
 * opened_at is always `new Date().toISOString()` — fixed-width UTC — so the
 * lexicographic minimum is the chronological minimum and no Date parsing is
 * needed. A torn final line (a half-written append) is skipped rather than
 * failing the whole readback.
 */
export async function readOpens(): Promise<Open[]> {
  let raw: string;
  try {
    raw = await readFile(STORE, "utf8");
  } catch {
    // No file yet (ENOENT before the first pixel loads) → no opens.
    return [];
  }

  const first = new Map<string, string>();
  for (const line of raw.split("\n")) {
    if (!line) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") continue;
    const { token, opened_at } = parsed as Record<string, unknown>;
    if (typeof token !== "string" || typeof opened_at !== "string") continue;

    const prev = first.get(token);
    if (prev === undefined || opened_at < prev) first.set(token, opened_at);
  }

  return [...first].map(([token, opened_at]) => ({ token, opened_at }));
}

/**
 * Every open line with its user-agent and address, at `opened_at >= since`.
 *
 * `readOpens` collapses to one open per token and drops the UA, which is enough
 * for the legacy `/px/opens.json`. The engagement readback instead needs each
 * individual open — its timing and UA are what let Career-OS tell a mail
 * scanner's instant pre-fetch from a human open. A torn final line is skipped.
 */
export async function readAllOpens(since?: string): Promise<OpenRecord[]> {
  let raw: string;
  try {
    raw = await readFile(STORE, "utf8");
  } catch {
    return [];
  }

  const out: OpenRecord[] = [];
  for (const line of raw.split("\n")) {
    if (!line) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") continue;
    const { token, opened_at, ua, ip } = parsed as Record<string, unknown>;
    if (typeof token !== "string" || typeof opened_at !== "string") continue;
    if (since && opened_at < since) continue;
    out.push({
      token,
      opened_at,
      ua: typeof ua === "string" ? ua : "",
      ip: typeof ip === "string" ? ip : "",
    });
  }
  return out;
}

/**
 * Constant-time check of the readback's `Authorization: Bearer <key>` header.
 *
 * Returns false when TRACKING_API_KEY is unset, so an unconfigured deploy never
 * hands the opens to anyone — a naive `header === \`Bearer ${process.env.KEY}\``
 * would match a request that literally sends "Bearer undefined". timingSafeEqual
 * requires equal-length buffers and throws otherwise, so the length is gated
 * first; that leaks the key's length but never its bytes.
 */
export function verifyReadbackAuth(header: string | null): boolean {
  const key = process.env.TRACKING_API_KEY?.trim();
  if (!key) return false;

  const prefix = "Bearer ";
  if (!header || !header.startsWith(prefix)) return false;

  const presented = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(key);
  return presented.length === expected.length && timingSafeEqual(presented, expected);
}
