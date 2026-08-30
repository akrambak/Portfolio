import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Rule } from "@/components/schematic/Rule";
import { FigureLabel } from "@/components/schematic/FigureLabel";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  /** Renders a FIG. mark instead of a plain eyebrow. */
  figure?: number;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  action,
  figure,
  className = "",
}: SectionHeaderProps) {
  return (
    <Reveal className={"mb-12 " + className}>
      <Rule className="mb-6" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {figure !== undefined ? (
            <FigureLabel n={figure} className="mb-4">
              {eyebrow}
            </FigureLabel>
          ) : (
            eyebrow && (
              <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
                {eyebrow}
              </p>
            )
          )}
          <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            {title}
          </h2>
          {lede && (
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-muted">
              {lede}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}
