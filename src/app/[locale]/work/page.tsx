import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { collectionPage } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { WORK } from "@/content/work";
import { site } from "@/config/site";
import { WorkGrid } from "@/components/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/work",
    title: t("workPage.title"),
    description: t("workPage.lede"),
  });
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <JsonLd
        data={collectionPage(
          locale,
          "/work",
          t("workPage.title"),
          WORK.map((item) => ({
            name: item.title,
            description: item.tagline,
            url: item.href
              ? item.external
                ? item.href
                : `${site.url}${item.href}`
              : undefined,
          })),
        )}
      />
      <PageHeader
        eyebrow={t("workPage.eyebrow")}
        title={t("workPage.title")}
        lede={t("workPage.lede")}
      />
      <WorkGrid />
    </div>
  );
}
