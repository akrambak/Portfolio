"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

interface TextRevealProps {
  /** One entry per visual line. Each is masked in separately. */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

/**
 * Line-by-line mask reveal.
 *
 * Deliberately per line rather than per character: splitting a heading into
 * one span per letter wrecks how a screen reader announces it, and reads as a
 * gimmick at this scale.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: TextRevealProps) {
  const reduced = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={"block " + (lineClassName ?? "")}
            initial={{ opacity: 0, y: reduced ? 0 : "0.7em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : dur.hero,
              ease: ease.out,
              delay: reduced ? 0 : delay + index * 0.08,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

interface UnderlineProps {
  className?: string;
  delay?: number;
}

/**
 * A ruled measure under a key phrase: straight line, tick ends, redline —
 * drafted rather than hand-drawn.
 */
export function AccentUnderline({ className, delay = 0.55 }: UnderlineProps) {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      className={"overflow-visible " + (className ?? "")}
    >
      <motion.line
        x1="0"
        y1="5"
        x2="200"
        y2="5"
        stroke="var(--accent-2)"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: reduced ? 0 : 0.7,
          ease: ease.out,
          delay: reduced ? 0 : delay,
        }}
      />
      {[0, 200].map((x) => (
        <motion.line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2="10"
          stroke="var(--accent-2)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : delay + 0.55 }}
        />
      ))}
    </svg>
  );
}
