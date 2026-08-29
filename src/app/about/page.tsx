import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import {
  Container,
  DataSheet,
  PageHeader,
  PrimaryLink,
  QuietLink,
  SectionHeader,
} from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("eyebrow"), description: t("lead") };
}

export default function AboutPage() {
  const t = useTranslations("about");
  const th = useTranslations("home");
  const stackKeys = ["backend", "ai", "commerce", "frontend", "mobile", "ways"] as const;

  return (
    <Container>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <section className="reveal py-12 sm:py-16">
        <SectionHeader label={t("storyLabel")} />
        <div className="mt-10 max-w-2xl space-y-6">
          {t("story")
            .split("|")
            .map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-lg leading-relaxed text-graphite">
                {paragraph}
              </p>
            ))}
        </div>
      </section>

      <section className="reveal py-12 sm:py-16">
        <SectionHeader label={t("stackLabel")} />
        <div className="mt-10 max-w-3xl">
          <DataSheet
            rows={stackKeys.map((key) => ({
              label: t(`stack.${key}`),
              value: t(`stack.${key}Value`),
            }))}
          />
        </div>
      </section>

      <section className="reveal py-12 sm:py-16">
        <SectionHeader label={t("principlesLabel")} />
        <ul className="mt-10 max-w-3xl border-t border-rule">
          {t("principles")
            .split("|")
            .map((principle) => (
              <li
                key={principle.slice(0, 32)}
                className="border-b border-rule py-5 text-lg leading-relaxed text-graphite"
              >
                {principle}
              </li>
            ))}
        </ul>
      </section>

      <section className="reveal pb-8 pt-12 sm:pt-16">
        <div className="grid gap-8 border-t border-rule pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {t("ctaHeadline")}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-graphite">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <PrimaryLink href="/contact">{th("ctaPrimary")}</PrimaryLink>
            <QuietLink href={`mailto:${site.email}`} external>
              {site.email}
            </QuietLink>
          </div>
        </div>
      </section>
    </Container>
  );
}
