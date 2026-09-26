import { getSortedPostsData } from "@/lib/mdxUtils";
import { site } from "@/config/site";
import { localizedUrl } from "@/lib/seo/metadata";

/** Rebuilt at most hourly; posts are read from disk, so a new one appears without a deploy. */
export const revalidate = 3600;

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS for the blog. Feed readers are a small audience; the point is the aggregators
 * and AI crawlers that discover new posts through feeds long before a recrawl of
 * the sitemap would find them.
 */
export function GET() {
  const posts = getSortedPostsData();
  const self = `${site.url}/rss.xml`;

  const items = posts
    .map((post) => {
      const url = localizedUrl("en", `/blog/${post.slug}`);
      const categories = (post.frontmatter.tags ?? [])
        .map((tag) => `<category>${escape(tag)}</category>`)
        .join("");
      return `<item><title>${escape(post.frontmatter.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate><description>${escape(post.frontmatter.excerpt)}</description>${categories}</item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(site.name)} — Notes from production</title><link>${site.url}/blog</link><description>Architecture write-ups, patterns and cost math from wiring Claude into apps that were already live.</description><language>en</language><atom:link href="${self}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
