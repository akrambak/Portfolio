import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/mdxUtils";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.8 },
  ];

  const posts = getSortedPostsData().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...routes, ...posts];
}
