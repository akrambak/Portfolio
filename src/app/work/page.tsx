import Link from "next/link";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { publishedWork, workCategories, type WorkCategory } from "@/content/work";
import { WorkRow } from "@/components/rows";
import { Container, DataSheet, PageHeader, SectionHeader } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("work");
  return { title: t("eyebrow"), description: t("lead") };
}

type Props = { searchParams: Promise<{ c?: string }> };

export default async function WorkPage({ searchParams }: Props) {
  const { c } = await searchParams;
  const active = workCategories.includes(c as WorkCategory) ? (c as WorkCategory) : null;
  return <Work active={active} />;
}

function Work({ active }: { active: WorkCategory | null }) {
  const t = useTranslations("work");
  const entries = active
    ? publishedWork.filter((entry) => entry.category === active)
    : publishedWork;

  const engagementKeys = ["commerce", "backend", "mobile", "frontend", "delivery"] as const;

  return (
    <Container>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <nav aria-label={t("filterLabel")} className="flex flex-wrap items-center gap-2">
        <FilterChip href="/work" active={active === null}>
          {t("filterAll")}
        </FilterChip>
        {workCategories.map((category) => (
          <FilterChip
            key={category}
            href={`/work?c=${category}`}
            active={active === category}
          >
            {t(`categories.${category}`)}
          </FilterChip>
        ))}
      </nav>

      <div className="mt-10 border-b border-rule">
        {entries.length > 0 ? (
          entries.map((entry) => <WorkRow key={entry.slug} entry={entry} />)
        ) : (
          <p className="border-t border-rule py-12 text-graphite">{t("empty")}</p>
        )}
      </div>

      <section className="reveal py-16 sm:py-20">
        <SectionHeader label={t("engagementsLabel")} />
        <div className="mt-10 max-w-3xl">
          <DataSheet
            rows={engagementKeys.map((key) => ({
              label: t(`engagements.${key}`),
              value: t(`engagements.${key}Value`),
            }))}
          />
        </div>
      </section>
    </Container>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-11 items-center rounded-[3px] border px-3 font-mono text-eyebrow font-medium uppercase transition-colors duration-200 ${
        active
          ? "border-signal bg-signal-wash text-signal"
          : "border-rule text-faint hover:border-rule-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
