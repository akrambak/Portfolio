import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except the API, the /px tracking surface, Next internals,
  // root-level metadata routes and any path with a file extension. The OG images
  // are deliberately NOT excluded: they live under [locale], so an unprefixed
  // /opengraph-image needs the middleware's rewrite to /en to resolve at all.
  //
  // /px is excluded like /api: it is a machine surface (an email open pixel and
  // its readback, src/app/px/**), never localized, and must not be rewritten to
  // a locale. The .gif and .json paths carry a dot and so would be excluded by
  // the extension rule anyway; naming px keeps that independent of the suffix.
  matcher: [
    "/((?!api|px|_next|_vercel|sitemap\\.xml|robots\\.txt|rss\\.xml|manifest\\.webmanifest|icon|apple-icon|.*\\..*).*)",
  ],
};
