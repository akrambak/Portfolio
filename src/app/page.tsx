import { getLocale, getTranslations } from "next-intl/server";
import { getSortedPostsData } from "@/lib/mdxUtils";
import { FEATURED_WORK } from "@/content/work";
import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { Testimonials } from "@/components/home/Testimonials";
import { Stat } from "@/components/Stat";
import { WorkCard } from "@/components/WorkCard";
import { PostCard } from "@/components/PostCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { FigureLabel } from "@/components/schematic/FigureLabel";
import { CornerBrackets } from "@/components/schematic/CornerBrackets";
import { configured, site } from "@/config/site";

const STATS = ["years", "cost", "languages"] as const;

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const posts = getSortedPostsData().slice(0, 3);

  const primaryHref = configured(site.links.calendly) ? site.links.calendly : "/contact";

  return (
    <>
      <Hero />

      {/* Proof strip */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <Reveal>
            <FigureLabel n={2} className="mb-8">
              {t("figure.proof")}
            </FigureLabel>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STATS.map((key) => (
              <RevealItem key={key}>
                <Stat
                  value={t(`proof.${key}.value`)}
                  suffix={t(`proof.${key}.suffix`)}
                  label={t(`proof.${key}.label`)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Selected work */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          figure={3}
          eyebrow={t("figure.work")}
          title={t("workSection.title")}
          lede={t("workSection.lede")}
          action={
            <CTALink href="/work" variant="ghost">
              {t("workSection.viewAll")}
              <ArrowRight />
            </CTALink>
          }
        />
        <RevealGroup
          as="ul"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_WORK.map((item) => (
            <RevealItem key={item.slug} as="li">
              <WorkCard
                item={item}
                kindLabel={t(`workPage.filters.${item.kind}`)}
                caseStudyLabel={t("workPage.caseStudy")}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Capabilities />

      {/* Latest writing */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeader
            figure={5}
            eyebrow={t("figure.writing")}
            title={t("writingSection.title")}
            lede={t("writingSection.lede")}
            action={
              <CTALink href="/blog" variant="ghost">
                {t("writingSection.viewAll")}
                <ArrowRight />
              </CTALink>
            }
          />
          <RevealGroup
            as="ul"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <RevealItem key={post.slug} as="li">
                <PostCard
                  post={post}
                  locale={locale}
                  readingTimeLabel={t("writingSection.readingTime", {
                    minutes: post.readingMinutes,
                  })}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          figure={6}
          eyebrow={t("figure.testimonials")}
          title={t("testimonialSection.title")}
        />
        <Testimonials />
      </section>

      {/* Closing CTA — a drafted title block */}
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <Reveal>
          <div className="relative border border-hairline-strong bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
            <CornerBrackets size={14} active />
            <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
              {t("cta.eyebrow")}
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-base leading-relaxed text-ink-muted">
              {t("cta.body")}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CTALink
                href={primaryHref as string}
                external={configured(site.links.calendly)}
              >
                {t("cta.primary")}
                <ArrowRight />
              </CTALink>
              <CTALink href="/work" variant="ghost">
                {t("cta.secondary")}
              </CTALink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
