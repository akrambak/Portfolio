"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { dist, dur, ease } from "@/lib/motion";
import { CornerBrackets } from "@/components/schematic/CornerBrackets";
import { Rule } from "@/components/schematic/Rule";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";

/**
 * A drawing's title block, filled in by the person requesting the work.
 *
 * The rail this replaces held a mailto and the words "Remote · EU" in a column sized for far
 * more — configured, but unearned. Feeding it from the visitor's own answers is what makes the
 * two-column layout worth having, and the site's own devices do all the work: mono dt/dd cells,
 * a hairline grid, corner brackets, a Rule.
 *
 * Deliberately NOT a live region. Every row restates a choice the visitor just made and whose
 * control already announced itself; a polite region here would talk over that on every tap.
 */

const ICONS = { github: FaGithub, linkedin: FaLinkedin } as const;

export interface TitleBlockSocial {
  key: string;
  href: string;
  label: string;
}

export interface LiveRow {
  key: string;
  label: string;
  value: string;
}

interface TitleBlockProps {
  heading: string;
  /** Static cells. A null value is dropped, so an unconfigured site.* never renders a blank. */
  facts: Array<{ key: string; label: string; value: string | null }>;
  email: string | null;
  directLabel: string;
  /** Live cells, printed in as they are answered. Empty on the `static` variant. */
  live?: LiveRow[];
  socials?: TitleBlockSocial[];
  calendly?: string | null;
  bookTitle?: string;
  bookBody?: string;
  bookCta?: string;
  /**
   * "full" is the sticky desktop plate with the live rows. "static" is the mobile tail —
   * facts only, because a phone does not need a panel restating answers three inches up
   * the screen.
   */
  variant?: "full" | "static";
}

const DT = "font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint";
const DD = "mt-1 font-mono text-xs leading-relaxed tracking-tight text-ink";

export function TitleBlock({
  heading,
  facts,
  email,
  directLabel,
  live = [],
  socials = [],
  calendly = null,
  bookTitle,
  bookBody,
  bookCta,
  variant = "full",
}: TitleBlockProps) {
  const reduced = useReducedMotion();
  const rows = facts.filter((fact) => fact.value !== null);

  return (
    <div className={variant === "full" ? "lg:sticky lg:top-20 lg:self-start" : ""}>
      <div className="relative border border-hairline bg-surface p-6 sm:p-7">
        <CornerBrackets size={10} />

        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
          {heading}
        </p>
        <Rule className="mb-5 mt-3" />

        <dl className="space-y-4">
          {rows.map((fact) => (
            <div key={fact.key}>
              <dt className={DT}>{fact.label}</dt>
              <dd className={DD}>{fact.value}</dd>
            </div>
          ))}

          {email && (
            <div>
              <dt className={DT}>{directLabel}</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-xs tracking-tight text-accent transition-colors duration-200 hover:text-ink"
                >
                  {email}
                </a>
              </dd>
            </div>
          )}

          {variant === "full" && live.length > 0 && (
            <AnimatePresence initial={false}>
              {live.map((row) => (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0, y: reduced ? 0 : dist.micro }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
                >
                  <dt className={DT}>{row.label}</dt>
                  <dd className={DD + " text-accent"}>{row.value}</dd>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </dl>

        {socials.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map(({ key, href, label }) => {
              const Icon = ICONS[key as keyof typeof ICONS];
              if (!Icon) return null;
              return (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2.5 rounded-[2px] border border-hairline px-4 font-mono text-xs text-ink-muted transition-colors duration-200 hover:border-hairline-strong hover:text-ink"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {calendly && bookTitle && (
        <div className="mt-8">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
            {bookTitle}
          </h2>
          {bookBody && (
            <p className="mb-5 max-w-[46ch] text-sm leading-relaxed text-ink-muted">{bookBody}</p>
          )}
          <CTALink href={calendly} external>
            {bookCta}
            <ArrowRight />
          </CTALink>
        </div>
      )}
    </div>
  );
}
