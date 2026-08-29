import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";

const TIMELINE = ["one", "two", "three"] as const;
const SKILLS = [
  "ai",
  "fullstack",
  "backend",
  "frontend",
  "ecommerce",
  "mobile",
] as const;
const HIGHLIGHTS = ["bilingual", "projectManagement"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("aboutPage.title"),
    description: t("aboutPage.lede"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("aboutPage.eyebrow")}
        title={t("aboutPage.title")}
        lede={t("aboutPage.lede")}
      />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-20">
        <div className="space-y-16">
          {/* Story */}
          <Reveal as="section">
            <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
              {t("aboutPage.storyTitle")}
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              <p>{t("aboutPage.story1")}</p>
              <p>{t("aboutPage.story2")}</p>
              <p>{t("aboutPage.story3")}</p>
            </div>
          </Reveal>

          {/* Timeline */}
          <section>
            <Reveal>
              <h2 className="mb-8 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
                {t("aboutPage.timelineTitle")}
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="space-y-0">
              {TIMELINE.map((key) => (
                <RevealItem
                  key={key}
                  as="li"
                  className="relative border-l border-hairline py-5 pl-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[4.5px] top-[1.9rem] h-2 w-2 rounded-full bg-accent"
                  />
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                    {t(`aboutPage.timeline.${key}.period`)}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                    {t(`aboutPage.timeline.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
                    {t(`aboutPage.timeline.${key}.body`)}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>

          {/* Philosophy */}
          <Reveal as="section">
            <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
              {t("aboutPage.philosophyTitle")}
            </h2>
            <p className="max-w-[62ch] border-l-2 border-accent pl-6 text-base leading-relaxed text-ink sm:text-lg">
              {t("aboutPage.philosophy")}
            </p>
          </Reveal>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          <section>
            <Reveal>
              <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
                {t("aboutPage.stackTitle")}
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="space-y-2.5">
              {SKILLS.map((key) => (
                <RevealItem
                  key={key}
                  as="li"
                  className="flex gap-3 rounded-[2px] border border-hairline bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted transition-colors duration-300 hover:border-hairline-strong"
                >
                  <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {t(`skills.${key}`)}
                </RevealItem>
              ))}
            </RevealGroup>
          </section>

          <Reveal as="section">
            <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
              {t("aboutPage.highlightsTitle")}
            </h2>
            <dl className="space-y-4">
              {HIGHLIGHTS.map((key) => (
                <div key={key}>
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                    {t(`aboutPage.highlights.${key}.label`)}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {t(`aboutPage.highlights.${key}.value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <CTALink href="/contact">
              {t("cta.primary")}
              <ArrowRight />
            </CTALink>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
