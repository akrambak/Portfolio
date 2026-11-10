"use client";

import { useEffect, useRef } from "react";

/**
 * Client half of a lead report. Beacons the engagement the server render cannot see:
 * `report_view` once the page is actually in a browser (a mail scanner that fetched the
 * link runs no JS and never fires this — which is exactly what makes a view a stronger
 * signal than the raw click), then `report_engaged` once the reader has spent real time
 * on it. The quote button beacons `quote_request` before handing off to the mail client.
 *
 * Every beacon posts to /px/e, which reads the lead from the `lid` cookie or, on this
 * first hit before the cookie exists, from the body. Fire-and-forget: a failed beacon
 * must never get in the reader's way.
 */
function beacon(type: string, lead: string, meta?: Record<string, unknown>) {
  try {
    fetch("/px/e", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, lead, path: "/r/report", meta }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {});
  } catch {
    // Older browsers without fetch keepalive — the view is simply not recorded.
  }
}

export function ReportBeacon({ lead, token }: { lead: string; token?: string }) {
  const engaged = useRef(false);

  useEffect(() => {
    beacon("report_view", lead, token ? { e: token } : undefined);

    const markEngaged = () => {
      if (engaged.current) return;
      engaged.current = true;
      beacon("report_engaged", lead);
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      if (scrolled > document.body.scrollHeight * 0.5) markEngaged();
    };
    const timer = window.setTimeout(markEngaged, 20_000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lead, token]);

  return null;
}

export function QuoteButton({
  lead,
  mailto,
  label,
  className,
}: {
  lead: string;
  mailto: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      data-track="request_quote"
      onClick={() => {
        beacon("quote_request", lead);
        window.location.href = mailto;
      }}
    >
      {label}
    </button>
  );
}
