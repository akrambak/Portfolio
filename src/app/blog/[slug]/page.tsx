import { getAllPostSlugs, getPostData, PostFrontmatter } from "@/lib/mdxUtils";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Reveal } from "@/components/motion/Reveal";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) return { title: "Post not found" };

  const { title, excerpt, date } = postData.frontmatter;

  return {
    title,
    description: excerpt,
    openGraph: {
      type: "article",
      title,
      description: excerpt,
      publishedTime: date,
    },
    twitter: { card: "summary_large_image", title, description: excerpt },
  };
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) notFound();

  const t = await getTranslations();
  const locale = await getLocale();
  const { source, frontmatter, readingMinutes } = postData;
  const { title, date, category, tags } = frontmatter as PostFrontmatter;

  return (
    <>
      <ScrollProgress />

      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal as="header" className="mb-12" distance={8}>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors duration-200 hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            {t("blogPage.backToAll")}
          </Link>

          <h1 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-ink">
            {title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
            <time dateTime={date}>{formatDate(date, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{t("writingSection.readingTime", { minutes: readingMinutes })}</span>
            {category && (
              <span className="rounded-[2px] border border-hairline px-2.5 py-1 normal-case tracking-normal text-accent">
                {category}
              </span>
            )}
          </div>

          {tags && tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-[2px] bg-raised px-2 py-1 font-mono text-[0.68rem] text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <div className="prose prose-lg max-w-none">
          <MDXRemote source={source} components={{}} />
        </div>

        <footer className="mt-16 border-t border-hairline pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent transition-opacity duration-200 hover:opacity-75"
          >
            {t("cta.primary")}
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </article>
    </>
  );
}
