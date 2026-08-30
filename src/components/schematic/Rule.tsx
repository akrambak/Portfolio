"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT, dur, ease } from "@/lib/motion";

/**
 * A drafted divider: hairline with tick-marked ends, extending as it enters
 * the viewport.
 *
 * Driven by scaleX rather than SVG pathLength. pathLength animates
 * stroke-dasharray, which leaves a visibly half-drawn line if the animation
 * is ever interrupted or throttled — on a decorative element that reads as
 * broken. A transform cannot fail that way, and costs three DOM nodes
 * instead of an SVG.
 */
export function Rule({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={"relative block h-2 w-full " + className}
    >
      <motion.span
        className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-hairline-strong"
        initial={{ scaleX: reduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: reduced ? 0 : dur.hero, ease: ease.out }}
      />
      {["left-0", "right-0"].map((side, index) => (
        <motion.span
          key={side}
          className={"absolute top-0 h-2 w-px bg-hairline-strong " + side}
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{
            duration: reduced ? 0 : 0.2,
            delay: reduced ? 0 : index === 0 ? 0 : dur.hero * 0.85,
          }}
        />
      ))}
    </span>
  );
}
