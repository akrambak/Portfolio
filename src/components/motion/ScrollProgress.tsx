"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Reading-progress redline pinned to the top of the viewport. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : smoothed }}
      className="fixed inset-x-0 top-0 z-60 h-[2px] origin-left bg-accent-2"
    />
  );
}
