"use client";

import { motion, useReducedMotion } from "framer-motion";
import { dur, ease } from "@/lib/motion";

interface CornerBracketsProps {
  /** Leg length in px. */
  size?: number;
  className?: string;
  /** When true the legs extend — drive this from a parent hover state. */
  active?: boolean;
}

const CORNERS = [
  { key: "tl", style: { top: -1, left: -1 }, rotate: 0 },
  { key: "tr", style: { top: -1, right: -1 }, rotate: 90 },
  { key: "br", style: { bottom: -1, right: -1 }, rotate: 180 },
  { key: "bl", style: { bottom: -1, left: -1 }, rotate: 270 },
] as const;

/**
 * L-brackets at a panel's four corners. Purely decorative chrome that makes a
 * card read as a drawn plate rather than a rounded box.
 */
export function CornerBrackets({
  size = 10,
  className = "",
  active = false,
}: CornerBracketsProps) {
  const reduced = useReducedMotion();
  const length = active && !reduced ? size + 5 : size;

  return (
    <span aria-hidden="true" className={"pointer-events-none absolute inset-0 " + className}>
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.key}
          className="absolute"
          style={{ ...corner.style, transform: `rotate(${corner.rotate}deg)` }}
          animate={{ width: length, height: length }}
          transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
        >
          <svg
            viewBox="0 0 12 12"
            className="h-full w-full overflow-visible"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          >
            <path d="M0 6 V0 H6" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.span>
      ))}
    </span>
  );
}
