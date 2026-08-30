"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CornerBrackets } from "@/components/schematic/CornerBrackets";

interface PlateHoverProps {
  children: ReactNode;
  className?: string;
  /** Set false for panels that should not gain corner chrome. */
  brackets?: boolean;
}

/**
 * A drafted plate that reveals its grid under the cursor.
 *
 * Writes --mx / --my straight onto the node inside a rAF, so nothing
 * re-renders on mousemove — only the mask position of one layer changes.
 * Hover state itself is React state, but it flips twice per hover, not per
 * frame.
 */
export function PlateHover({ children, className = "", brackets = true }: PlateHoverProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || frame.current) return;

    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mx", clientX - rect.left + "px");
      element.style.setProperty("--my", clientY - rect.top + "px");
    });
  }, []);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={"plate group relative " + className}
    >
      <span
        aria-hidden="true"
        className="plate-grid pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      />
      {brackets && <CornerBrackets active={hovered} />}
      {children}
    </div>
  );
}
