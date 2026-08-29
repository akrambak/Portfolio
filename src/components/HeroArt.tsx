/* Ambient instrument geometry. Unlabelled on purpose: it is the shape of a
   measurement, not a claim about one. */

export function DialArcs({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={i}
          cx="1010"
          cy="120"
          r={150 + i * 128}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const angle = (Math.PI / 180) * (108 + i * 13);
        return (
          <line
            key={i}
            x1={1010 + Math.cos(angle) * 170}
            y1={120 + Math.sin(angle) * 170}
            x2={1010 + Math.cos(angle) * 1180}
            y2={120 + Math.sin(angle) * 1180}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}
    </svg>
  );
}

/* Plateau, cliff, plateau: the shape of a bill before and after caching. */
const TRACE =
  "M-40 214 L118 210 L196 222 L272 206 L338 216 L392 208 L430 212 L452 214 " +
  "L470 528 L502 566 L556 556 L628 566 L706 558 L788 568 L872 558 L962 566 " +
  "L1046 558 L1240 564";

const TRACE_DIM =
  "M-40 352 L96 344 L172 366 L248 340 L330 358 L404 336 L486 360 L562 338 " +
  "L644 362 L724 342 L806 364 L892 344 L978 360 L1068 342 L1240 356";

export function SignalTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <path
        d={TRACE}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DimTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <path
        d={TRACE_DIM}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="7 9"
        strokeLinecap="round"
      />
    </svg>
  );
}
