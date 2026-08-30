import Link from "next/link";
import type { Post, PostFrontmatter } from "@/lib/mdxUtils";
import { PlateHover } from "@/components/PlateHover";
import { ArrowRight } from "@/components/ui/CTALink";

interface PostCardProps {
  post: Post<PostFrontmatter>;
  locale: string;
  readingTimeLabel: string;
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post, locale, readingTimeLabel }: PostCardProps) {
  const { slug, frontmatter } = post;
  const { title, date, excerpt, category, tags } = frontmatter;

  return (
    <PlateHover className="h-full border border-hairline bg-surface transition-colors duration-300 hover:border-accent">
      <article className="flex h-full flex-col p-6 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline pb-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-faint">
          <time dateTime={date}>{formatDate(date, locale)}</time>
          <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
          <span>{readingTimeLabel}</span>
          {category && (
            <span className="ml-auto text-accent-2 normal-case tracking-normal">
              {category}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
          <Link
            href={`/blog/${slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-3 flex-grow text-sm leading-relaxed text-ink-muted">{excerpt}</p>

        <div className="mt-6 flex items-end justify-between gap-4">
          {tags && tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="border border-hairline bg-raised px-2 py-1 font-mono text-[0.66rem] text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <ArrowRight className="shrink-0 text-ink-faint transition-colors duration-200 group-hover:text-accent-2" />
        </div>
      </article>
    </PlateHover>
  );
}

export default PostCard;
