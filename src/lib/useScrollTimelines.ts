"use client";

import { useEffect, useState } from "react";

/**
 * Whether the browser can run CSS scroll-driven animations.
 *
 * Returns `null` until mounted, which is deliberate: the server and the first
 * client render must agree, so components render their finished, static state
 * and only opt into the JS fallback once we know CSS cannot do the work.
 *
 * The CSS side gates itself with `@supports (animation-timeline: ...)`, so the
 * two paths test the same condition and can never both run.
 */
export function useScrollTimelines(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(
      typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("animation-timeline", "view()"),
    );
  }, []);

  return supported;
}

/** True only once we know CSS scroll timelines are unavailable. */
export function useNeedsMotionFallback(): boolean {
  return useScrollTimelines() === false;
}
