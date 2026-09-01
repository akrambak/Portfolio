"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useNeedsMotionFallback } from "@/lib/useScrollTimelines";

/**
 * Reading progress drawn as a dimension line: tick ends, a hairline track, and
 * a measure that extends across it with a live percentage.
 *
 * Sits on the header's bottom edge rather than the top of the viewport, so it
 * reads as a measure of the bar rather than a loading strip.
 *
 * The bar is CSS-scrubbed where scroll timelines exist and Framer-driven where
 * they do not. The readout needs JS either way — CSS cannot write text — so it
 * updates through a motion-value subscription straight to the DOM node, with no
 * React render per frame.
 *
 * Deliberately still runs under reduced motion: progress is information, and a
 * frozen progress bar would be a regression, not a kindness.
 */
export function ScrollProgress() {
  const fallback = useNeedsMotionFallback();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const readout = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const node = readout.current;
    if (node) node.textContent = `${Math.round(value * 100)}%`;
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-12 z-[60]"
    >
      <div className="relative h-[2px] bg-hairline">
        {fallback ? (
          <motion.span
            className="absolute inset-0 origin-left bg-accent-2"
            style={{ scaleX: smoothed }}
          />
        ) : (
          <span className="progress-bar absolute inset-0 bg-accent-2" />
        )}
      </div>

      {/* dimension ticks */}
      <span className="absolute left-0 top-0 h-1.5 w-px bg-hairline-strong" />
      <span className="absolute right-0 top-0 h-1.5 w-px bg-hairline-strong" />

      <span
        ref={readout}
        className="absolute right-3 top-2 font-mono text-[0.6rem] tabular-nums tracking-[0.1em] text-ink-faint sm:right-5"
      />
    </div>
  );
}
