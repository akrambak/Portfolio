import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/mdxUtils";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/blog", "/about", "/contact"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const posts = getSortedPostsData().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...posts];
}
