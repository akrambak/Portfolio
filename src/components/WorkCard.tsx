import Link from "next/link";
import type { WorkItem } from "@/content/work";
import { PlateHover } from "@/components/PlateHover";
import { SchematicPlate } from "@/components/schematic/SchematicPlate";
import { ArrowRight } from "@/components/ui/CTALink";

interface WorkCardProps {
  item: WorkItem;
  kindLabel: string;
  caseStudyLabel: string;
}

export function WorkCard({ item, kindLabel, caseStudyLabel }: WorkCardProps) {
  const linked = Boolean(item.href);

  return (
    <PlateHover className="h-full border border-hairline bg-surface transition-colors duration-300 hover:border-accent">
      <div className="flex h-full flex-col">
        {/* Generated cover: a plan view derived from the slug and stack. */}
        <div className="border-b border-hairline bg-raised/60 px-5 pt-5">
          <SchematicPlate slug={item.slug} moduleCount={item.stack.length} className="h-28" />
        </div>

        <div className="flex flex-grow flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="border border-hairline px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-faint">
              {kindLabel}
            </span>
            {linked && (
              <ArrowRight className="text-ink-faint transition-colors duration-200 group-hover:text-accent-2" />
            )}
          </div>

          <h3 className="font-display text-lg font-medium tracking-tight text-ink">
            {linked ? (
              // Stretched link: the whole card is the target, but only one
              // focusable element ends up in the tab order.
              <Link
                href={item.href as string}
                className="after:absolute after:inset-0 after:content-['']"
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </h3>

          <p className="mt-2.5 flex-grow text-sm leading-relaxed text-ink-muted">
            {item.tagline}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {item.stack.map((tech) => (
              <li
                key={tech}
                className="border border-hairline bg-raised px-2 py-1 font-mono text-[0.66rem] text-ink-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          {linked && !item.external && (
            <p className="mt-4 font-mono text-xs text-accent">{caseStudyLabel}</p>
          )}
        </div>
      </div>
    </PlateHover>
  );
}
