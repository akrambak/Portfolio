import { Reveal } from "@/components/motion/Reveal";
import { Rule } from "@/components/schematic/Rule";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
}

/** Title block of the drawing: sheet label, title, and a ruled lede. */
export function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <Reveal as="header" className="mb-14" distance={8}>
      {eyebrow && (
        <p className="mb-5 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
          <span aria-hidden="true" className="h-2 w-2 bg-accent-2" />
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
        {title}
      </h1>
      <Rule className="mt-7 max-w-3xl" />
      {lede && (
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-muted">{lede}</p>
      )}
    </Reveal>
  );
}
