"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { track, beaconLead, readLid } from "@/lib/analytics/events";

/**
 * A visitor who arrived from a tracked email link carries a `lid` cookie. Publish it
 * to the dataLayer as `user_id` so GTM's GA4 config tag stamps every event with the
 * same User-ID, and emit `lead_identified` once. No cookie → nothing happens.
 */
function useLeadIdentity() {
  useEffect(() => {
    const lead = readLid();
    if (!lead) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ user_id: lead });
    track("lead_identified", { user_id: lead });
  }, []);
}

/**
 * page_view on every route change.
 *
 * The App Router navigates with pushState, which GTM only sees through a History
 * Change trigger — and each tag would then need its own. One explicit event gives
 * GA4, Meta and Ads the same page views, with the locale attached. GA4's
 * enhanced-measurement "page changes based on browser history" must be OFF in the
 * GA4 data stream, or client-side navigations count twice.
 */
function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const last = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const key = query ? `${pathname}?${query}` : pathname;
    // Strict Mode runs effects twice in development; one page is one view.
    if (last.current === key) return;
    last.current = key;

    track("page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
      page_locale: locale,
    });
    // Mirror to the first-party log for an identified lead, so the on-site journey
    // reaches Career-OS and GA4 even when the GA4 tag is consent-gated off.
    beaconLead("page_view", { page_path: pathname });
  }, [pathname, searchParams, locale]);

  return null;
}

/** Nearest declared location, else the landmark the link sits in. */
function locationOf(element: Element): string {
  const declared = element.closest<HTMLElement>("[data-track-location]");
  if (declared?.dataset.trackLocation) return declared.dataset.trackLocation;
  if (element.closest("header, nav")) return "navbar";
  if (element.closest("footer")) return "footer";
  return window.location.pathname;
}

/**
 * One delegated listener instead of an onClick per button, so CTALink and the plain
 * links stay server components: a link opts in with `data-track="<id>"`, and mailto /
 * booking links are recognised on their own wherever they appear.
 */
function useClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") ?? "";
      const cta_location = locationOf(link);

      if (href.startsWith("mailto:")) {
        track("email_click", { cta_location });
        beaconLead("email_click", { cta_location });
      } else if (/(^|\.)(calendly|cal)\.com$/.test(link.hostname)) {
        track("book_call_click", { cta_location, link_url: link.href });
        beaconLead("book_call_click", { cta_location });
      }

      const id = link.dataset.track;
      if (id) {
        track("cta_click", { cta_id: id, cta_location, link_url: link.href });
        beaconLead("cta_click", { cta_id: id, cta_location });
      }
    };

    // Capture phase: a link that navigates away still reports before the unload.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

export function AnalyticsProvider() {
  useLeadIdentity();
  useClickTracking();

  // useSearchParams opts the nearest Suspense boundary into client rendering; this
  // one keeps that boundary around a component that renders nothing, not the page.
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
