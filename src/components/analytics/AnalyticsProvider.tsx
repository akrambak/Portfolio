"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { track } from "@/lib/analytics/events";

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
      } else if (/(^|\.)(calendly|cal)\.com$/.test(link.hostname)) {
        track("book_call_click", { cta_location, link_url: link.href });
      }

      const id = link.dataset.track;
      if (id) track("cta_click", { cta_id: id, cta_location, link_url: link.href });
    };

    // Capture phase: a link that navigates away still reports before the unload.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

export function AnalyticsProvider() {
  useClickTracking();

  // useSearchParams opts the nearest Suspense boundary into client rendering; this
  // one keeps that boundary around a component that renders nothing, not the page.
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
