import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";
import { FigureLabel } from "@/components/schematic/FigureLabel";
import { Rule } from "@/components/schematic/Rule";
import { site, configured } from "@/config/site";

const DEADLINES = ["gpsr", "eudr", "agents"] as const;
const OFFERS = ["audit", "build", "watch"] as const;
const FILTER = ["rate", "unscoped", "crypto", "rewrite", "onsite", "short", "scraping"] as const;
const PROOF = ["ruleset", "corpus", "report", "selfHosted"] as const;
const PROCESS = ["one", "two", "three", "four"] as const;
const FAQ = ["compliant", "dataLeaves", "autopilot", "invent", "versions", "nda", "ip"] as const;

/**
 * The booking CTA only points at Calendly once there is a real link; until
 * then it falls through to the contact form rather than shipping a dead
 * placeholder. Same rule as the social row in `site.ts`.
 */
const booking = configured(site.links.calendly)
  ? { href: site.links.calendly, external: true }
  : { href: "/contact", external: false };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("hirePage.metaTitle"),
    description: t("hirePage.metaDescription"),
    alternates: { canonical: `${site.url}/hire-me` },
    openGraph: {
      title: t("hirePage.metaTitle"),
      description: t("hirePage.metaDescription"),
      url: `${site.url}/hire-me`,
      type: "website",
    },
  };
}

export default async function HireMePage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("hirePage.eyebrow")}
        title={t("hirePage.title")}
        lede={t("hirePage.lede")}
      />

      <Reveal className="mb-20 flex flex-wrap gap-3">
        <CTALink href={booking.href} external={booking.external}>
          {t("hirePage.ctaPrimary")}
          <ArrowRight />
        </CTALink>
        {configured(site.email) && (
          <CTALink href={`mailto:${site.email}`} variant="ghost" external>
            {site.email}
          </CTALink>
        )}
      </Reveal>

      {/* The stakes, before the offer. Most buyers do not know this yet. */}
      <section className="mb-24">
        <SectionHeader
          figure={1}
          eyebrow={t("hirePage.problemEyebrow")}
          title={t("hirePage.problemTitle")}
        />
        <Reveal>
          <div className="max-w-[64ch] space-y-5 border-l-2 border-accent pl-6 text-base leading-relaxed text-ink sm:text-lg">
            <p>{t("hirePage.problem1")}</p>
            <p>{t("hirePage.problem2")}</p>
          </div>
          <p className="mt-6 max-w-[62ch] font-mono text-sm leading-relaxed text-ink-muted">
            {t("hirePage.problemKicker")}
          </p>
        </Reveal>

        <RevealGroup as="dl" className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
          {DEADLINES.map((key) => (
            <RevealItem key={key} className="bg-surface p-6">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-accent-2">
                {t(`hirePage.deadlines.${key}.when`)}
              </dt>
              <dd className="mt-3">
                <p className="font-display text-lg font-medium leading-snug tracking-tight text-ink">
                  {t(`hirePage.deadlines.${key}.what`)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {t(`hirePage.deadlines.${key}.body`)}
                </p>
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* The ladder. */}
      <section className="mb-24">
        <SectionHeader
          figure={2}
          eyebrow={t("hirePage.offersEyebrow")}
          title={t("hirePage.offersTitle")}
          lede={t("hirePage.offersLede")}
        />
        <RevealGroup as="ul" className="space-y-4">
          {OFFERS.map((key, index) => (
            <RevealItem
              key={key}
              as="li"
              className="rounded-[2px] border border-hairline bg-surface p-6 transition-colors duration-300 hover:border-hairline-strong sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent-2"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
                    {t(`hirePage.offers.${key}.name`)}
                  </h3>
                </div>
                <p className="shrink-0 font-mono text-sm text-ink">
                  {t(`hirePage.offers.${key}.price`)}
                </p>
              </div>

              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                {t(`hirePage.offers.${key}.timeline`)}
              </p>

              <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-ink-muted">
                {t(`hirePage.offers.${key}.body`)}
              </p>
              <p className="mt-4 max-w-[68ch] border-l border-hairline-strong pl-4 font-mono text-xs leading-relaxed text-ink-faint">
                {t(`hirePage.offers.${key}.note`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* The filter. Leading with the no's is the point of the page. */}
      <section className="mb-24">
        <SectionHeader
          figure={3}
          eyebrow={t("hirePage.filterEyebrow")}
          title={t("hirePage.filterTitle")}
          lede={t("hirePage.filterLede")}
        />
        <RevealGroup as="ul" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {FILTER.map((key) => (
            <RevealItem
              key={key}
              as="li"
              className="flex gap-3 rounded-[2px] border border-hairline bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted"
            >
              <span
                aria-hidden="true"
                className="mt-[0.6rem] h-px w-3 shrink-0 bg-accent-2"
              />
              {t(`hirePage.filter.${key}`)}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Proof. No logos yet — so lead with what can be inspected. */}
      <section className="mb-24">
        <SectionHeader
          figure={4}
          eyebrow={t("hirePage.proofEyebrow")}
          title={t("hirePage.proofTitle")}
          lede={t("hirePage.proofLede")}
        />
        <RevealGroup as="dl" className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
          {PROOF.map((key) => (
            <RevealItem key={key}>
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                {t(`hirePage.proof.${key}.label`)}
              </dt>
              <dd className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
                {t(`hirePage.proof.${key}.body`)}
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Process. */}
      <section className="mb-24">
        <SectionHeader
          figure={5}
          eyebrow={t("hirePage.processEyebrow")}
          title={t("hirePage.processTitle")}
        />
        <RevealGroup as="ol" className="space-y-0">
          {PROCESS.map((key, index) => (
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
                {t("hirePage.stepLabel", { n: index + 1 })}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                {t(`hirePage.process.${key}.title`)}
              </h3>
              <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
                {t(`hirePage.process.${key}.body`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* FAQ. */}
      <section className="mb-24">
        <SectionHeader
          figure={6}
          eyebrow={t("hirePage.faqEyebrow")}
          title={t("hirePage.faqTitle")}
        />
        <RevealGroup as="dl" className="space-y-8">
          {FAQ.map((key) => (
            <RevealItem key={key} className="max-w-[68ch]">
              <dt className="font-display text-base font-semibold tracking-tight text-ink">
                {t(`hirePage.faq.${key}.q`)}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                {t(`hirePage.faq.${key}.a`)}
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Closing. */}
      <Reveal as="section">
        <Rule className="mb-10" />
        <FigureLabel n={7} className="mb-4">
          {t("hirePage.closingEyebrow")}
        </FigureLabel>
        <h2 className="max-w-[24ch] font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-[2.6rem] sm:leading-[1.1]">
          {t("hirePage.closingTitle")}
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-muted">
          {t("hirePage.closingBody")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTALink href={booking.href} external={booking.external}>
            {t("hirePage.ctaPrimary")}
            <ArrowRight />
          </CTALink>
          {configured(site.email) && (
            <CTALink href={`mailto:${site.email}`} variant="ghost" external>
              {t("hirePage.ctaSecondary")}
            </CTALink>
          )}
        </div>
      </Reveal>
    </div>
  );
}
