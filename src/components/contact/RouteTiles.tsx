"use client";

import { motion, useReducedMotion } from "framer-motion";
import { drawVariants } from "@/lib/motion";
import { CornerBrackets } from "@/components/schematic/CornerBrackets";
import { ROUTES, type EnquiryRoute } from "@/lib/enquiry";

/**
 * The routing band: pick the intent, and the sheet below asks only what that intent needs.
 *
 * A drawing sheet routes before it details, so choosing first is native here rather than
 * imported from SaaS onboarding. The selection is a fill that TRAVELS (WorkGrid's `layoutId`
 * pill) rather than a card that expands — framer's layout projection scale-distorts hairlines
 * and mono tracking mid-transition, and a system built entirely out of 1px rules cannot
 * survive a smeared hairline.
 *
 * Spans are deliberately uneven, the same reasoning as the Capabilities bento: 2+1 / 1+2 on
 * lg, full / half+half / full on mobile. One rhythm, no separate mobile layout.
 */

/** Plan-view marks. Abstract schematics, not pictograms — two or three strokes each. */
const GLYPHS: Record<EnquiryRoute, string[]> = {
  // A pipeline: three nodes wired left to right.
  project: ["M3 12h4M11 12h4M19 12h2", "M9 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M17 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"],
  // A query: one stroke branching to a terminal mark.
  question: ["M4 6h8a4 4 0 0 1 0 8h-2", "M10 14v3", "M10 20v1"],
  // A frame with a seat: an org boundary and a position inside it.
  hiring: ["M3 5h18v14H3z", "M8 15v-2a4 4 0 0 1 8 0v2"],
  // A signal: three rising strokes, the smallest possible mark.
  hello: ["M4 15v-3", "M10 18V9", "M16 15v-3", "M21 12h-1"],
};

interface RouteTilesProps {
  value: EnquiryRoute;
  onChange: (route: EnquiryRoute) => void;
  legend: string;
  labels: Record<EnquiryRoute, { label: string; body: string }>;
  disabled?: boolean;
}

/**
 * Uneven on purpose so the eye moves, and so the two high-intent routes read as the
 * wider targets they should be.
 */
const SPANS: Record<EnquiryRoute, string> = {
  project: "col-span-2",
  question: "col-span-1",
  hiring: "col-span-1",
  hello: "col-span-2",
};

const TILE =
  "group relative flex h-full min-h-[5.5rem] cursor-pointer flex-col justify-between " +
  "rounded-[2px] border bg-surface p-4 transition-colors duration-200 sm:min-h-[7rem] sm:p-5 " +
  "has-[:focus-visible]:rounded-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 " +
  "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-2";

export function RouteTiles({
  value,
  onChange,
  legend,
  labels,
  disabled = false,
}: RouteTilesProps) {
  const reduced = useReducedMotion();

  return (
    <fieldset className="m-0 border-0 p-0" disabled={disabled}>
      <legend className="sr-only">{legend}</legend>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {ROUTES.map((route, index) => {
          const selected = value === route;
          const bodyId = `route-${route}-body`;
          const labelId = `route-${route}-label`;

          return (
            <label
              key={route}
              className={
                TILE +
                " " +
                SPANS[route] +
                " " +
                (selected ? "border-accent" : "border-hairline hover:border-hairline-strong")
              }
            >
              {/*
                Named and described explicitly. Left to the implicit wrapping label the
                computed name comes out as "01New projectScope, budget and timeline. The
                full brief." — the decorative node number swallowed into it, and the body
                copy announced twice, once as the name and again as the description.
              */}
              <input
                type="radio"
                name="route"
                value={route}
                checked={selected}
                onChange={() => onChange(route)}
                aria-labelledby={labelId}
                aria-describedby={bodyId}
                className="peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-[2px] border-0 bg-transparent"
              />

              {selected && (
                <motion.span
                  layoutId="route-fill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}

              <CornerBrackets active={selected} />

              <span
                aria-hidden="true"
                className={
                  "font-mono text-[0.68rem] tracking-[0.18em] " +
                  (selected ? "text-accent-on/70" : "text-ink-faint")
                }
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/*
                Re-mounted on selection so the stroke redraws itself. `initial={false}` on the
                idle branch renders the mark already finished — an unselected tile is a drawn
                glyph, not a blank box waiting for a frame loop.
              */}
              <RouteGlyph
                key={selected ? "drawn" : "static"}
                paths={GLYPHS[route]}
                draw={selected}
                reduced={reduced}
                className={
                  "absolute right-4 top-4 h-5 w-5 sm:right-5 sm:top-5 " +
                  (selected ? "text-accent-on/80" : "text-ink-faint")
                }
              />

              <span className="mt-3">
                <span
                  id={labelId}
                  className={
                    "block font-display text-sm font-semibold tracking-[-0.02em] sm:text-base " +
                    (selected ? "text-accent-on" : "text-ink")
                  }
                >
                  {labels[route].label}
                </span>
                <span
                  id={bodyId}
                  className={
                    "mt-1.5 hidden max-w-[38ch] text-xs leading-relaxed lg:block " +
                    (selected ? "text-accent-on/75" : "text-ink-muted")
                  }
                >
                  {labels[route].body}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RouteGlyph({
  paths,
  draw,
  reduced,
  className,
}: {
  paths: string[];
  draw: boolean;
  reduced: boolean | null;
  className: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className={className}
    >
      {paths.map((d, index) => (
        <motion.path
          key={d}
          d={d}
          vectorEffect="non-scaling-stroke"
          variants={drawVariants(reduced, index * 0.08)}
          initial={draw && !reduced ? "hidden" : false}
          animate="visible"
        />
      ))}
    </svg>
  );
}
