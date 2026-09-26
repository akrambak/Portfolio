import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { ContactRouter } from "@/components/contact/ContactRouter";
import { PageHeader } from "@/components/ui/PageHeader";
import { activeSocials, configured, site } from "@/config/site";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contactPage.title"),
    description: t("contactPage.lede"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        lede={t("contactPage.lede")}
      />

      {/*
        The router owns its own two-column grid, so there is no longer a page-level branch that
        can render an empty half. The `configured()` guards move down into the title block
        rather than disappearing — site.ts still decides what is real enough to show.
      */}
      <ContactRouter
        siteName={site.name}
        email={configured(site.email) ? site.email : null}
        location={configured(site.location) ? site.location : null}
        socials={activeSocials()}
        calendly={configured(site.links.calendly) ? site.links.calendly : null}
      />
    </div>
  );
}
