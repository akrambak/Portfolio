import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { OG_SIZE, renderPlate } from "@/lib/seo/ogPlate";

export const alt = `${site.name} — AI-augmented fullstack engineer`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** The site card, in the language of the page that is being shared. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return renderPlate({
    kicker: site.name,
    before: t("lineA"),
    emphasis: t("emphasis"),
    after: t("lineB"),
    footer: "Claude SDK · Laravel · Flutter · PrestaShop",
    figure: "FIG. 01",
  });
}
