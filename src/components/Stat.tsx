"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DimensionLine } from "@/components/schematic/DimensionLine";
import { dur, ease } from "@/lib/motion";

interface StatProps {
  value: string;
  suffix?: string;
  label: string;
  /** Short mono caption on the dimension line, e.g. "measured". */
  measure?: string;
}

/**
 * A figure counted up the first time it is seen, dimensioned like a drawing.
 *
 * The final value renders immediately for reduced motion and for anything
 * non-numeric, so the text is never wrong or missing.
 */
export function Stat({ value, suffix = "", label, measure }: StatProps) {
  const target = Number.parseFloat(value);
  const numeric = Number.isFinite(target);

  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => (numeric && !reduced ? "0" : value));

  useEffect(() => {
    if (!numeric || reduced || !inView) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, target, {
      duration: dur.hero * 1.6,
      ease: ease.out,
      onUpdate: (latest) => setDisplay(String(Math.round(latest))),
    });

    return () => controls.stop();
  }, [inView, numeric, reduced, target, value]);

  return (
    <div>
      <p
        ref={ref}
        className="font-display text-[3.25rem] font-medium leading-none tracking-[-0.045em] text-ink sm:text-6xl"
      >
        {display}
        <span className="text-accent-2">{suffix}</span>
      </p>
      {measure && <DimensionLine label={measure} className="mt-4 max-w-[12rem]" />}
      <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-ink-muted">{label}</p>
    </div>
  );
}
