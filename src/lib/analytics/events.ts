/**
 * The one door into the dataLayer.
 *
 * Every event the site emits is declared here with its parameters, so GTM's triggers
 * and variables have a single contract to match and a typo is a compile error rather
 * than a silently empty GA4 report. Tags themselves live in GTM, not in this repo:
 * GA4, Google Ads, Meta Pixel and Clarity all subscribe to these events.
 *
 * Parameter names follow GA4's recommended-event vocabulary where one exists
 * (`generate_lead`, `value`, `currency`, `page_location`), so GA4 reports them without
 * custom-dimension setup.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type LeadRoute = "project" | "question" | "hiring" | "hello";

interface EventMap {
  page_view: {
    page_location: string;
    page_path: string;
    page_title: string;
    page_locale: string;
  };
  cta_click: {
    cta_id: string;
    cta_location: string;
    link_url: string;
  };
  email_click: { cta_location: string };
  book_call_click: { cta_location: string; link_url: string };
  form_start: { lead_route: LeadRoute };
  form_route_select: { lead_route: LeadRoute };
  form_error: { lead_route: LeadRoute; error_code: string };
  generate_lead: {
    lead_route: LeadRoute;
    value: number;
    currency: "EUR";
    /** Shared with the server-side Meta Conversions API call, which dedupes on it. */
    event_id: string;
    project_type?: string;
    budget?: string;
    timeline?: string;
    engagement?: string;
    heard_via?: string;
    /** Google Ads Enhanced Conversions. Only ever the SHA-256, never the address. */
    user_data?: { sha256_email_address: string };
  };
  /** A visitor who arrived from a tracked email link, keyed by their pseudonymous
   *  lead id. Pushed once per page load so GTM can set it as the GA4 User-ID. */
  lead_identified: { user_id: string };
  quote_request: { user_id: string };
}

export type EventName = keyof EventMap;

export function track<E extends EventName>(event: E, params: EventMap[E]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/**
 * The lead id the email link planted, read from the first-party `lid` cookie that
 * /px/e sets. Present only for a visitor who followed a tracked proposal link; for
 * everyone else this is null and no lead-scoped tracking happens.
 */
export function readLid(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split("; ").find((part) => part.startsWith("lid="));
  const value = entry?.slice("lid=".length);
  return value && /^[A-Za-z0-9_-]{16,64}$/.test(value) ? value : null;
}

/**
 * Mirror a first-party event to /px/e so Career-OS can stitch the on-site journey to
 * the lead and forward it to GA4 server-side (the browser GA4 tag is gated on consent;
 * this first-party path is not). No-op without a lead cookie. Fire-and-forget.
 */
export function beaconLead(type: string, meta?: Record<string, unknown>): void {
  const lead = readLid();
  if (!lead) return;
  try {
    fetch("/px/e", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, lead, path: window.location.pathname, meta }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {});
  } catch {
    // No fetch keepalive — the mirror is simply skipped.
  }
}

/** Normalised as Google and Meta both require (trimmed, lower-cased), then hex SHA-256. */
export async function sha256Email(email: string): Promise<string | null> {
  if (typeof crypto === "undefined" || !crypto.subtle) return null;
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Browser and server report the same lead under this id, so Meta counts it once. */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
