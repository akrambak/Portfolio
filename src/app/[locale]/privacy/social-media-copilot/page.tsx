import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { pageMetadata } from "@/lib/seo/metadata";
import { COPILOT_PRIVACY, COPILOT_PRIVACY_UPDATED } from "@/content/copilotPrivacy";

type PageProps = { params: Promise<{ locale: Locale }> };

/** The privacy policy URL registered with LinkedIn, Meta and X for Social Media CoPilot. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const content = COPILOT_PRIVACY[locale];
  return pageMetadata({
    locale,
    path: "/privacy/social-media-copilot",
    title: `${content.eyebrow} — ${content.title}`,
    description: content.lede,
  });
}

export default async function CopilotPrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalDocument
      locale={locale}
      content={COPILOT_PRIVACY[locale]}
      updated={COPILOT_PRIVACY_UPDATED}
    />
  );
}
