import { useTranslations } from "next-intl";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PlateHover } from "@/components/PlateHover";
import { SectionHeader } from "@/components/ui/SectionHeader";

type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function AgentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <path d="M12 8V4M8.5 14h.01M15.5 14h.01M9 20v1.5M15 20v1.5" />
    </svg>
  );
}

function EvalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M4 5h11M4 12h11M4 19h7" />
      <path d="M17.5 17.5l2 2 3.5-4" />
    </svg>
  );
}

function CostIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15l4-5 3 3 5-7" />
    </svg>
  );
}

function LegacyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="8" height="16" rx="2" />
      <path d="M14 8h7M14 12h7M14 16h4" />
    </svg>
  );
}

function StackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3z" />
      <path d="M3.5 12L12 16.5 20.5 12M3.5 16.5L12 21l8.5-4.5" />
    </svg>
  );
}

/** Asymmetric bento. Spans deliberately uneven so the eye moves. */
const CARDS = [
  { key: "agents", Icon: AgentIcon, span: "lg:col-span-2" },
  { key: "evals", Icon: EvalIcon, span: "lg:col-span-1" },
  { key: "cost", Icon: CostIcon, span: "lg:col-span-1" },
  { key: "legacy", Icon: LegacyIcon, span: "lg:col-span-2" },
  { key: "fullstack", Icon: StackIcon, span: "lg:col-span-3" },
] as const;

export function Capabilities() {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <SectionHeader
        figure={4}
        eyebrow={t("figure.capabilities")}
        title={t("capabilities.title")}
        lede={t("capabilities.lede")}
      />

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ key, Icon, span }) => (
          <RevealItem key={key} className={span}>
            <PlateHover className="h-full border border-hairline bg-surface transition-colors duration-300 hover:border-accent">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <Icon className="mb-5 h-6 w-6 text-accent" />
                <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                  {t(`capabilities.${key}.title`)}
                </h3>
                <p className="mt-2.5 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
                  {t(`capabilities.${key}.body`)}
                </p>
              </div>
            </PlateHover>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
