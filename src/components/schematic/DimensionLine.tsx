"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT, measureVariants } from "@/lib/motion";

interface DimensionLineProps {
  label: string;
  className?: string;
}

/**
 * An arrow-terminated measure with a mono label, extending from its centre.
 * Used to annotate a number or span a region of a diagram.
 */
export function DimensionLine({ label, className = "" }: DimensionLineProps) {
  const reduced = useReducedMotion();

  return (
    <span className={"flex items-center gap-2 " + className}>
      <motion.span
        aria-hidden="true"
        className="relative h-2 flex-grow origin-center"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={measureVariants(reduced)}
      >
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline-strong" />
        <span className="absolute left-0 top-0 h-2 w-px bg-hairline-strong" />
        <span className="absolute right-0 top-0 h-2 w-px bg-hairline-strong" />
      </motion.span>
      <span className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
    </span>
  );
}
