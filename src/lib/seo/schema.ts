import { activeSocials, configured, site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { localizedUrl } from "./metadata";

/**
 * schema.org builders. Every node has a stable `@id`, so a page can reference the
 * Person and the business declared once in the layout instead of repeating them,
 * and Google stitches the graph together across pages.
 */

export const ids = {
  person: `${site.url}/#person`,
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
} as const;

const KNOWS_ABOUT = [
  "Claude SDK",
  "AI agents",
  "LLM evaluation",
  "Prompt caching",
  "Laravel",
  "PHP",
  "PrestaShop",
  "Flutter",
  "GPSR compliance",
  "EUDR compliance",
  "E-commerce",
];

/** Person + ProfessionalService + WebSite, rendered once in the locale layout. */
export function siteGraph(locale: Locale, t: { jobTitle: string; description: string }) {
  const sameAs = activeSocials().map((social) => social.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": ids.person,
        name: site.name,
        url: site.url,
        jobTitle: t.jobTitle,
        knowsAbout: KNOWS_ABOUT,
        knowsLanguage: ["en", "fr"],
        ...(configured(site.email) ? { email: `mailto:${site.email}` } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        worksFor: { "@id": ids.business },
      },
      {
        "@type": "ProfessionalService",
        "@id": ids.business,
        name: site.name,
        url: site.url,
        description: t.description,
        founder: { "@id": ids.person },
        image: `${site.url}/opengraph-image`,
        areaServed: { "@type": "Place", name: "European Union" },
        availableLanguage: ["English", "French"],
        priceRange: "€€€",
        ...(configured(site.email) ? { email: site.email } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: site.url,
        name: site.name,
        inLanguage: locale,
        publisher: { "@id": ids.person },
      },
    ],
  };
}

export function breadcrumbs(locale: Locale, trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: localizedUrl(locale, crumb.path),
    })),
  };
}

export function faqPage(entries: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

interface Offer {
  name: string;
  description: string;
  /** Free text such as "€1,500–2,500" — parsed for a price range when it can be. */
  price: string;
}

/** "€1,500–2,500" → { min: 1500, max: 2500 }. Anything unparseable is left out. */
function priceRange(text: string): { min: number; max: number } | null {
  const numbers = text.match(/\d[\d,.\s]*/g)?.map((n) => Number(n.replace(/[^\d]/g, "")));
  if (!numbers || numbers.length === 0 || numbers.some(Number.isNaN)) return null;
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

export function serviceCatalog(locale: Locale, path: string, name: string, offers: Offer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    url: localizedUrl(locale, path),
    provider: { "@id": ids.business },
    areaServed: { "@type": "Place", name: "European Union" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name,
      itemListElement: offers.map((offer) => {
        const range = priceRange(offer.price);
        return {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: offer.name, description: offer.description },
          ...(range
            ? {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "EUR",
                  minPrice: range.min,
                  maxPrice: range.max,
                },
              }
            : {}),
        };
      }),
    },
  };
}

export function blogPosting(post: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  tags?: string[];
}) {
  const url = localizedUrl("en", `/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    // The posts are written in English; the /fr route only translates the chrome.
    inLanguage: "en",
    image: `${url}/opengraph-image`,
    keywords: post.tags?.join(", "),
    author: { "@id": ids.person },
    publisher: { "@id": ids.person },
  };
}

export function collectionPage(
  locale: Locale,
  path: string,
  name: string,
  items: Array<{ name: string; description: string; url?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: localizedUrl(locale, path),
    author: { "@id": ids.person },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.name,
          description: item.description,
          ...(item.url ? { url: item.url } : {}),
          creator: { "@id": ids.person },
        },
      })),
    },
  };
}
