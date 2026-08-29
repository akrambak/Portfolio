import type { ReactNode } from "react";

interface FigureLabelProps {
  /** Figure number, zero-padded by the caller or here. */
  n: number | string;
  children?: ReactNode;
  className?: string;
}

/** `FIG. 03 —` caption, the recurring annotation mark of the drawing. */
export function FigureLabel({ n, children, className = "" }: FigureLabelProps) {
  const num = typeof n === "number" ? String(n).padStart(2, "0") : n;

  return (
    <p
      className={
        "flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint " +
        className
      }
    >
      <span className="text-accent-2">FIG. {num}</span>
      {children && (
        <>
          <span aria-hidden="true" className="h-px w-4 bg-hairline-strong" />
          <span>{children}</span>
        </>
      )}
    </p>
  );
}
