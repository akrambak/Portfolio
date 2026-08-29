"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { magneticSpring } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Maximum travel in px. Small on purpose - this should be felt, not seen. */
  strength?: number;
}

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

/**
 * Leans a control a few pixels toward the cursor.
 *
 * Off entirely for coarse pointers (touch has no hover) and for reduced
 * motion. Translates a wrapper instead of scaling the control, so nothing
 * around it shifts.
 */
export function Magnetic({ children, className, strength = 4 }: MagneticProps) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);

  const active = finePointer && !reduced;

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (!active) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      x.set(clamp((dx / rect.width) * strength * 2, strength));
      y.set(clamp((dy / rect.height) * strength * 2, strength));
    },
    [active, strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.span
      className={"inline-block " + (className ?? "")}
      style={active ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.span>
  );
}
