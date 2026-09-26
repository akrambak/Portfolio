import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/mdxUtils";
import { locales } from "@/i18n/config";
import { localizedUrl } from "@/lib/seo/metadata";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const PAGES: Array<{ path: string; changeFrequency: Frequency; priority: number }> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/hire-me", changeFrequency: "monthly", priority: 0.95 },
  { path: "/work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Every translated page once per locale, each carrying the full hreflang set —
 * Google wants the alternates to be reciprocal, so both the /x and /fr/x entries
 * list each other. Posts are English-only, so they appear once, unprefixed; their
 * /fr twins canonicalise to them and have no business in the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
  });

  const pages = PAGES.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency,
      priority,
      alternates: alternatesFor(path),
    })),
  );

  const posts = getSortedPostsData().map((post) => ({
    url: localizedUrl("en", `/blog/${post.slug}`),
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
