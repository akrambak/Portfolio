import { plateGeometry } from "@/lib/plate";

interface SchematicPlateProps {
  /** Seeds the geometry — the same slug always draws the same plate. */
  slug: string;
  /** Usually the length of the item's stack. */
  moduleCount: number;
  className?: string;
}

/**
 * Generated cover art: a drafted plan view derived from the item's slug and
 * stack size. Replaces photography and screenshots entirely, and gives the
 * work grid visual rhythm with zero assets.
 *
 * Renders on the server — the geometry is deterministic, so there is nothing
 * for the client to disagree with.
 */
export function SchematicPlate({ slug, moduleCount, className = "" }: SchematicPlateProps) {
  const geometry = plateGeometry(slug, moduleCount);

  return (
    <svg
      aria-hidden="true"
      viewBox={geometry.viewBox}
      className={"h-full w-full " + className}
      fill="none"
    >
      {/* registration marks */}
      {[
        [4, 4],
        [156, 4],
        [4, 96],
        [156, 96],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} stroke="var(--hairline-strong)" strokeWidth="0.5">
          <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} />
          <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} />
        </g>
      ))}

      {geometry.links.map((link, index) => (
        <path
          key={index}
          d={link.d}
          stroke="var(--hairline-strong)"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
      ))}

      {geometry.modules.map((module, index) => (
        <g key={index}>
          <rect
            x={module.x}
            y={module.y}
            width={module.w}
            height={module.h}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth="0.75"
          />
          <line
            x1={module.x}
            y1={module.y + 4}
            x2={module.x + module.w}
            y2={module.y + 4}
            stroke="var(--accent)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </g>
      ))}

      <text
        x="156"
        y="92"
        textAnchor="end"
        fill="var(--ink-faint)"
        fontSize="5"
        fontFamily="var(--font-plex-mono), monospace"
        letterSpacing="0.5"
      >
        PL-{geometry.plateNo}
      </text>
    </svg>
  );
}
