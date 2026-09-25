import type { Metadata } from "next";
import { site } from "@/config/site";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };

/**
 * The absolute URL of `path` in `locale`, matching `localePrefix: "as-needed"`:
 * English unprefixed, everything else under /<locale>. `path` is "/" or starts
 * with "/" and has no trailing slash.
 */
export function localizedUrl(locale: Locale, path: string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const suffix = path === "/" ? "" : path;
  return `${site.url}${prefix}${suffix}` || site.url;
}

interface PageMetadataInput {
  locale: Locale;
  /** Locale-free path, e.g. "/hire-me". */
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article";
  /**
   * False for pages whose body only exists in one language (blog posts are
   * English-only). Their /fr twin then points its canonical at the English URL
   * instead of claiming to be a French page with English content in it, which
   * is what Google treats as a duplicate.
   */
  translated?: boolean;
  article?: { publishedTime: string; tags?: string[] };
}

/**
 * Canonical, hreflang alternates and a complete Open Graph block for one page.
 *
 * Complete because Next merges metadata one top-level key at a time: a page that
 * sets `openGraph` replaces the layout's wholesale, so siteName and locale have to
 * be restated here or they silently vanish from that page.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  translated = true,
  article,
}: PageMetadataInput): Metadata {
  const contentLocale = translated ? locale : defaultLocale;
  const canonical = localizedUrl(contentLocale, path);

  // A page's own `openGraph` also drops the image the layout segment's
  // opengraph-image.tsx contributed, so point back at it. Articles are left alone:
  // their own opengraph-image.tsx sits in their segment and wins over this.
  const images = type === "article" ? undefined : [localizedUrl(locale, "/opengraph-image")];

  const languages: Record<string, string> = translated
    ? Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]))
    : { [defaultLocale]: localizedUrl(defaultLocale, path) };
  languages["x-default"] = localizedUrl(defaultLocale, path);

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical, languages },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      locale: OG_LOCALE[contentLocale],
      alternateLocale: translated
        ? locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l])
        : undefined,
      ...(title ? { title } : {}),
      description,
      ...(images ? { images } : {}),
      ...(article && type === "article"
        ? { publishedTime: article.publishedTime, tags: article.tags, authors: [site.url] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      ...(images ? { images } : {}),
    },
  };
}
