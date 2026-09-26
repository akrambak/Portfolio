import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except the API, Next internals, root-level metadata routes and any
  // path with a file extension. The OG images are deliberately NOT excluded: they
  // live under [locale], so an unprefixed /opengraph-image needs the middleware's
  // rewrite to /en to resolve at all.
  matcher: [
    "/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|rss\\.xml|manifest\\.webmanifest|icon|apple-icon|.*\\..*).*)",
  ],
};
