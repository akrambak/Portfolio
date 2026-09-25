"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants } from "@/lib/motion";

/**
 * Route transition.
 *
 * template.tsx (not layout.tsx) is the App Router primitive that re-mounts on
 * every navigation, which is what makes an entrance animation actually fire.
 * The previous AnimatePresence-keyed-on-pathname approach could never play its
 * exit, because the outgoing tree is replaced before AnimatePresence sees it.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants(reduced)}>
      {children}
    </motion.div>
  );
}
