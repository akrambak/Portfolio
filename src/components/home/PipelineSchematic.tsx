"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ease } from "@/lib/motion";
import { useNeedsMotionFallback } from "@/lib/useScrollTimelines";

/**
 * Annotated plan of a real agent pipeline: scrape -> score (cached) -> eval
 * -> draft. Drawn from the architecture in the Career-OS and prompt-caching
 * posts, so it is a description of actual work rather than decoration.
 *
 * Accessibility: the SVG is role="img" with a summary label, which means its
 * inner <text> is not exposed to assistive tech — so the same content is also
 * rendered as a visually-hidden ordered list. Annotations are permanent
 * rather than hover-only, so nothing is gated behind a pointer.
 */

const NODES = [
  { key: "scrape", x: 10, y: 24, w: 150, h: 46, noteX: 172, noteY: 51, anchor: "start" },
  { key: "score", x: 180, y: 118, w: 160, h: 46, noteX: 168, noteY: 145, anchor: "end" },
  { key: "evaluate", x: 10, y: 212, w: 160, h: 46, noteX: 182, noteY: 239, anchor: "start" },
  { key: "draft", x: 180, y: 306, w: 150, h: 46, noteX: 168, noteY: 333, anchor: "end" },
] as const;

const LEADERS = [
  "M160 47 H172",
  "M180 141 H168",
  "M170 235 H182",
  "M180 329 H168",
] as const;

const EDGES = [
  "M85 70 V94 H260 V118",
  "M260 164 V188 H90 V212",
  "M90 258 V282 H255 V306",
] as const;

/*
 * Overlapping slices of the diagram's own view timeline, so scrolling the hero
 * hands the token from one edge to the next. Scroll position becomes the thing
 * pushing data through the pipeline, which is the point: the motion describes
 * the work rather than decorating it.
 */
const TOKEN_RANGES = [
  "cover 0% cover 40%",
  "cover 25% cover 65%",
  "cover 50% cover 92%",
] as const;

export function PipelineSchematic({ className = "" }: { className?: string }) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const fallback = useNeedsMotionFallback();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={"relative " + className}>
      <svg
        viewBox="0 0 400 380"
        role="img"
        aria-label={t("schematic.aria")}
        className="h-auto w-full"
        fill="none"
      >
        {/* edges */}
        {EDGES.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--hairline-strong)"
            strokeWidth="1"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: reduced ? 0 : 0.6,
              ease: ease.out,
              delay: reduced ? 0 : 0.5 + index * 0.35,
            }}
          />
        ))}

        {/* One token travelling the whole route, edge by edge. Scroll-driven
            where CSS timelines exist; a slow loop where they do not. */}
        {!reduced &&
          EDGES.map((d, index) =>
            fallback ? (
              <motion.path
                key={`pulse-${d}`}
                d={d}
                stroke="var(--accent-2)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.07 1"
                initial={{ strokeDashoffset: 0.07 }}
                animate={{ strokeDashoffset: -1 }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: 4.5,
                  delay: 2 + index * 1.5,
                }}
              />
            ) : (
              <path
                key={`pulse-${d}`}
                className="pipe-token"
                style={{ animationRange: TOKEN_RANGES[index] } as React.CSSProperties}
                d={d}
                stroke="var(--accent-2)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.07 1"
              />
            ),
          )}

        {/* leader lines to the annotations */}
        {LEADERS.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--hairline-strong)"
            strokeWidth="1"
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.2 + index * 0.12 }}
          />
        ))}

        {/* nodes */}
        {NODES.map((node, index) => {
          const isActive = active === node.key;
          return (
            <motion.g
              key={node.key}
              onMouseEnter={() => setActive(node.key)}
              onMouseLeave={() => setActive(null)}
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 0.35,
                ease: ease.out,
                delay: reduced ? 0 : 0.3 + index * 0.35,
              }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                fill="var(--surface)"
                stroke={isActive ? "var(--accent-2)" : "var(--accent)"}
                strokeWidth={isActive ? 1.75 : 1}
                className="transition-[stroke,stroke-width] duration-200"
              />
              {/* title bar of the module */}
              <line
                x1={node.x}
                y1={node.y + 14}
                x2={node.x + node.w}
                y2={node.y + 14}
                stroke={isActive ? "var(--accent-2)" : "var(--accent)"}
                strokeWidth="0.75"
                opacity="0.45"
                className="transition-[stroke] duration-200"
              />
              <text
                x={node.x + 8}
                y={node.y + 10}
                className="font-mono text-[7px] uppercase tracking-[0.18em]"
                fill="var(--ink-faint)"
              >
                {String(index + 1).padStart(2, "0")}
              </text>
              <text
                x={node.x + 8}
                y={node.y + 34}
                className="font-mono text-[13px] tracking-tight"
                fill="var(--ink)"
              >
                {t(`schematic.${node.key}.label`)}
              </text>
            </motion.g>
          );
        })}

        {/* permanent annotations */}
        {NODES.map((node, index) => (
          <motion.text
            key={`note-${node.key}`}
            x={node.noteX}
            y={node.noteY}
            textAnchor={node.anchor}
            className="font-mono text-[8.5px] tracking-tight"
            fill={active === node.key ? "var(--accent-2)" : "var(--ink-faint)"}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.3 + index * 0.12 }}
          >
            {t(`schematic.${node.key}.note`)}
          </motion.text>
        ))}
      </svg>

      <ol className="sr-only">
        {NODES.map((node) => (
          <li key={node.key}>
            {t(`schematic.${node.key}.label`)} — {t(`schematic.${node.key}.note`)}
          </li>
        ))}
      </ol>
    </div>
  );
}
