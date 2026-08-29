import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Tone = "paper" | "invert" | "sunken";

const toneClass: Record<Tone, string> = {
  paper: "",
  invert: "band-invert",
  sunken: "band-sunken",
};

/* A full-bleed band. `tone` re-points the palette tokens, so everything
   inside inverts without a single component knowing about it. */
export function Band({
  children,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <section className={`${toneClass[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/* The headline, plotted line by line. Splitting on "|" keeps the line breaks
   in the message files, where the translator can control them. */
export function Display({
  text,
  delay = 0,
  className = "",
  size = "display",
  as: Tag = "h1",
}: {
  text: string;
  delay?: number;
  className?: string;
  size?: "display" | "mega";
  as?: "h1" | "h2";
}) {
  const lines = text.split("|");

  return (
    <Tag
      className={`font-semibold ${size === "mega" ? "text-mega" : "text-display"} ${className}`}
    >
      {lines.map((line, i) => (
        <span key={line} className="block">
          <span
            className="plot-line block"
            style={{ animationDelay: `${delay + i * 130}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* Integer that counts up in CSS. The visible glyphs live in a pseudo-element,
   so the real value is carried alongside for assistive tech. */
export function Ticker({
  to,
  prefix = "",
  suffix = "",
  delay = 0,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}
      <span
        aria-hidden
        className="ticker"
        style={{ "--to": to, animationDelay: `${delay}ms` } as CSSProperties}
      />
      <span className="sr-only">{to}</span>
      {suffix}
    </span>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[70rem] px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-eyebrow font-medium uppercase text-faint ${className}`}
    >
      {children}
    </span>
  );
}

/* The section label sits inside the rule, the way a callout sits inside a
   measurement line on a technical drawing. */
export function SectionHeader({
  label,
  action,
}: {
  label: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <Eyebrow>{label}</Eyebrow>
      <span aria-hidden className="h-px flex-1 bg-rule" />
      {action}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] bg-signal px-5 font-mono text-eyebrow font-medium uppercase text-on-signal transition-colors duration-200 hover:bg-signal-hover";

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function QuietLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "group inline-flex min-h-11 items-center gap-2 font-mono text-eyebrow font-medium uppercase text-ink transition-colors duration-200 hover:text-signal";
  const inner = (
    <>
      {children}
      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export type SheetRow = { label: string; value: ReactNode };

/* The datasheet: every fact a reader needs, tabulated, above the fold. */
export function DataSheet({
  rows,
  delay = 0,
}: {
  rows: SheetRow[];
  delay?: number;
}) {
  return (
    <dl className="border-t border-rule">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="animate-rise grid grid-cols-1 gap-1 border-b border-rule py-3 md:grid-cols-[9.5rem_1fr] md:gap-6"
          style={{ animationDelay: `${delay + i * 70}ms` }}
        >
          <dt className="font-mono text-eyebrow font-medium uppercase text-faint md:pt-0.5">
            {row.label}
          </dt>
          <dd className="font-mono text-[0.8125rem] leading-relaxed text-graphite">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="pb-12 pt-14 sm:pb-16 sm:pt-20">
      <p className="animate-rise mb-6">
        <Eyebrow>{eyebrow}</Eyebrow>
      </p>
      <Display text={title} size="mega" delay={60} className="max-w-4xl" />
      {lead && (
        <p
          className="animate-rise mt-7 max-w-2xl text-lg leading-relaxed text-graphite"
          style={{ animationDelay: "320ms" }}
        >
          {lead}
        </p>
      )}
    </header>
  );
}
