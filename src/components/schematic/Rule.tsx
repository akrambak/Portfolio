"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT, dur, ease } from "@/lib/motion";
import { useNeedsMotionFallback } from "@/lib/useScrollTimelines";

/**
 * A drafted divider: hairline with tick-marked ends, drawing itself as it is
 * scrolled into view.
 *
 * Where CSS scroll timelines exist the line is scrubbed by scroll position, so
 * it draws under your finger and retracts on the way back. Where they do not,
 * Framer plays it once on entry.
 *
 * Either way it is scaleX on a flex-centred child — never SVG pathLength, which
 * animates stroke-dasharray and leaves a visibly half-drawn line if it is ever
 * interrupted, and never combined with a translate utility, which would fight
 * the same transform.
 */
export function Rule({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const fallback = useNeedsMotionFallback();
  const animateWithJs = fallback && !reduced;

  return (
    <span
      aria-hidden="true"
      className={"relative flex h-2 w-full items-center " + className}
    >
      {animateWithJs ? (
        <motion.span
          className="h-px w-full origin-left bg-hairline-strong"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: dur.hero, ease: ease.out }}
        />
      ) : (
        <span className="rule-line h-px w-full bg-hairline-strong" />
      )}

      <span className="absolute left-0 top-0 h-2 w-px bg-hairline-strong" />
      <span className="absolute right-0 top-0 h-2 w-px bg-hairline-strong" />
    </span>
  );
}
