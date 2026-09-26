import "server-only";
import { createHash } from "node:crypto";
import { site } from "@/config/site";

/**
 * Meta Conversions API — the server-side copy of the Pixel's `Lead`.
 *
 * Ad blockers and Safari's tracking protection drop a sizeable share of browser-side
 * Pixel events; this one is sent from the server after the enquiry is delivered, so
 * the lead still counts. The browser Pixel reports the same lead with the same
 * `event_id`, and Meta keeps whichever arrives first — one lead, never two.
 *
 * Only called when the visitor granted marketing consent. With META_PIXEL_ID or
 * META_CAPI_TOKEN unset it does nothing, so the feature ships dark and is switched on
 * from the VPS env file.
 */

const GRAPH = "https://graph.facebook.com/v21.0";
const TIMEOUT_MS = 3000;

/** The same shape newEventId() produces client-side. Anything else is replaced. */
const EVENT_ID = /^[A-Za-z0-9-]{8,64}$/;

export interface MetaLeadInput {
  eventId: unknown;
  email: string;
  ip: string;
  userAgent: string | null;
  /** The raw Cookie header; `_fbp` / `_fbc` are read out of it. */
  cookies: string | null;
  /** The page the form was on, from the Referer. Kept only if it is this site. */
  referer: string | null;
  value: number;
  route: string;
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function cookie(header: string | null, name: string): string | undefined {
  return header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function sameSiteUrl(referer: string | null): string {
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.origin === new URL(site.url).origin) return `${url.origin}${url.pathname}`;
    } catch {
      // fall through
    }
  }
  return `${site.url}/contact`;
}

export async function sendMetaLead(input: MetaLeadInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return;

  const eventId =
    typeof input.eventId === "string" && EVENT_ID.test(input.eventId)
      ? input.eventId
      : crypto.randomUUID();

  const fbp = cookie(input.cookies, "_fbp");
  const fbc = cookie(input.cookies, "_fbc");

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sameSiteUrl(input.referer),
        user_data: {
          em: [sha256(input.email.trim().toLowerCase())],
          ...(input.ip !== "unknown" ? { client_ip_address: input.ip } : {}),
          ...(input.userAgent ? { client_user_agent: input.userAgent } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
        custom_data: { currency: "EUR", value: input.value, lead_route: input.route },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
    // In the body, not the query string, so it never lands in a proxy's access log.
    access_token: token,
  };

  const response = await fetch(`${GRAPH}/${encodeURIComponent(pixelId)}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(`Meta CAPI ${response.status}: ${detail}`);
  }
}
