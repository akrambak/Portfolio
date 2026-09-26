import { getPostData } from "@/lib/mdxUtils";
import { site } from "@/config/site";
import { OG_SIZE, renderPlate } from "@/lib/seo/ogPlate";

export const alt = "Article cover";
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * One card per post, so a shared link shows the article's own title rather than
 * the generic site card. Posts are English-only, so the card is too.
 */
export default async function PostImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const title = post?.frontmatter.title ?? site.name;
  const tags = post?.frontmatter.tags?.slice(0, 4).join(" · ") ?? "";

  return renderPlate({
    kicker: `${site.name} · ${post?.frontmatter.category ?? "Writing"}`,
    before: title,
    footer: tags,
    figure: "bak-dev.com/blog",
    compact: true,
  });
}
