import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Personal lead reports live under /r/<key> and /fr/r/<key>: private, unguessable,
    // one per prospect, never meant to be indexed. /px is the machine tracking surface.
    rules: { userAgent: "*", allow: "/", disallow: ["/r/", "/fr/r/", "/px/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
