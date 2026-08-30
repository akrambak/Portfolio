import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WorkGrid } from "@/components/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("workPage.title"),
    description: t("workPage.lede"),
  };
}

export default async function WorkPage() {
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("workPage.eyebrow")}
        title={t("workPage.title")}
        lede={t("workPage.lede")}
      />
      <WorkGrid />
    </div>
  );
}
