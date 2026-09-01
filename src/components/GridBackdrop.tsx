"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useNeedsMotionFallback } from "@/lib/useScrollTimelines";

/**
 * The drafting grid, on its own fixed layer so it can drift.
 *
 * It used to live on the <html> background, which meant it scrolled locked to
 * the content. Detaching it lets the paper move slower than what sits on it —
 * a small parallax that reads as depth rather than as an effect.
 *
 * CSS scroll timelines drive it where available (compositor, no main thread).
 * Otherwise a single Framer motion value does, which still avoids a React
 * render per frame.
 */
export function GridBackdrop() {
  const reduced = useReducedMotion();
  const fallback = useNeedsMotionFallback();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-9vh"]);

  if (fallback && !reduced) {
    return <motion.div aria-hidden="true" className="grid-backdrop" style={{ y }} />;
  }

  return <div aria-hidden="true" className="grid-backdrop" />;
}
