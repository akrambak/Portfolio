/**
 * Cookie consent, wired to Google Consent Mode v2.
 *
 * Two optional categories on top of the strictly necessary ones:
 *
 *   analytics  → GA4, Microsoft Clarity         (analytics_storage)
 *   marketing  → Meta Pixel, Google Ads          (ad_storage, ad_user_data, ad_personalization)
 *
 * Everything starts denied. Google tags still load and send cookieless pings (which
 * is what lets GA4 model the traffic it cannot see); every other tag is gated in GTM
 * on the matching consent type and never fires until the visitor says yes.
 *
 * The choice lives in a first-party `consent` cookie rather than localStorage so the
 * inline bootstrap in the layout can read it before GTM starts — no flash of denied
 * state for a returning visitor — and so /api/contact can see it on the request.
 */

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_COOKIE = "consent";

/**
 * Bump when a category is added or its meaning changes: an older cookie then reads as
 * "never asked", and the banner comes back instead of applying a stale answer.
 */
const VERSION = "v1";

/** Six months — the CNIL's recommended ceiling before asking again. */
const MAX_AGE = 60 * 60 * 24 * 182;

/** Dispatched on window to reopen the banner, e.g. from the footer's "Cookie settings". */
export const OPEN_CONSENT_EVENT = "consent:open";

/** `v1.1.0` → { analytics: true, marketing: false }. Anything else is "not asked yet". */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  const [version, analytics, marketing] = raw.split(".");
  if (version !== VERSION) return null;
  if (!["0", "1"].includes(analytics) || !["0", "1"].includes(marketing)) return null;
  return { analytics: analytics === "1", marketing: marketing === "1" };
}

function serialize({ analytics, marketing }: ConsentState): string {
  return `${VERSION}.${analytics ? 1 : 0}.${marketing ? 1 : 0}`;
}

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(entry?.slice(CONSENT_COOKIE.length + 1));
}

/** Consent Mode signals for a choice. */
function signals({ analytics, marketing }: ConsentState) {
  const ad = marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ad,
    ad_user_data: ad,
    ad_personalization: ad,
  } as const;
}

/**
 * Persist a choice and tell GTM. The `consent_update` event is what GTM triggers
 * hang off, so a tag waiting on consent fires on this page view instead of the next.
 */
export function saveConsent(state: ConsentState): void {
  const secure = location.protocol === "https:" ? ";secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serialize(state)};path=/;max-age=${MAX_AGE};samesite=lax${secure}`;

  window.dataLayer = window.dataLayer || [];
  window.gtag?.("consent", "update", signals(state));
  window.dataLayer.push({
    event: "consent_update",
    consent_analytics: state.analytics,
    consent_marketing: state.marketing,
  });
}

/**
 * Runs inline in <head>, before GTM loads — Consent Mode requires the default to be
 * set before any Google tag reads it. Kept free of regex and template interpolation so
 * it reads the same in this file as in the page source.
 */
export const CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
(function(){
  var raw = ('; ' + document.cookie).split('; ${CONSENT_COOKIE}=')[1];
  if (!raw) return;
  var parts = raw.split(';')[0].split('.');
  if (parts[0] !== '${VERSION}') return;
  var analytics = parts[1] === '1', marketing = parts[2] === '1';
  var ad = marketing ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: ad, ad_user_data: ad, ad_personalization: ad
  });
  window.dataLayer.push({ event: 'consent_restored', consent_analytics: analytics, consent_marketing: marketing });
})();
`;
