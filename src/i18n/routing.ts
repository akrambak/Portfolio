import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

/**
 * English stays unprefixed so every URL that already ranks keeps working; French
 * lives under /fr. Before this, both languages shared one URL and a cookie picked
 * the catalogue, which meant Google only ever saw — and indexed — the English one.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // Same name the old cookie-driven switcher wrote, so a returning French visitor
  // who picked FR before this change still lands on /fr.
  localeCookie: { name: "locale", maxAge: 60 * 60 * 24 * 365 },
  // The middleware would otherwise send a Link header advertising a /fr twin for
  // every path — including blog posts, which only exist in English. The pages
  // declare their own alternates (src/lib/seo/metadata.ts), which know that.
  alternateLinks: false,
});
