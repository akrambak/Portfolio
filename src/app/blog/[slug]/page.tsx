import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { useFormatter, useTranslations } from "next-intl";
import { getAdjacentPosts, getAllPostSlugs, getPostData, type Post } from "@/lib/mdxUtils";
import { ArrowIcon } from "@/components/icons";
import { Container, Eyebrow, PrimaryLink, QuietLink } from "@/components/ui";
import { site } from "@/config/site";

const prettyCode: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  if (!post) return {};

  const { title, excerpt, date, tags } = post.frontmatter;
  return {
    title,
    description: excerpt,
    keywords: tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description: excerpt,
      publishedTime: date,
      authors: [site.name],
      url: `/blog/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description: excerpt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);
  if (!post) notFound();

  const { previous, next } = getAdjacentPosts(slug);
  return <BlogPost post={post} previous={previous} next={next} />;
}

function BlogPost({
  post,
  previous,
  next,
}: {
  post: NonNullable<ReturnType<typeof getPostData>>;
  previous: Post | null;
  next: Post | null;
}) {
  const t = useTranslations("blog");
  const th = useTranslations("home");
  const format = useFormatter();
  const { title, date, excerpt, category, tags, readingMinutes } = post.frontmatter;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    author: { "@type": "Person", name: site.name, url: site.url },
    keywords: tags?.join(", "),
    url: `${site.url}/blog/${post.slug}`,
  };

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-[46rem]">
        <div className="pt-10">
          <QuietLink href="/blog">{t("backToIndex")}</QuietLink>
        </div>

        <header className="border-b border-rule pb-10 pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {category && <Eyebrow>{category}</Eyebrow>}
            <span aria-hidden className="h-px w-6 bg-rule" />
            <time dateTime={date} className="font-mono text-[0.8125rem] text-faint">
              {format.dateTime(new Date(date), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="font-mono text-[0.8125rem] text-faint">
              {t("readingTime", { minutes: readingMinutes })}
            </span>
          </div>

          <h1 className="mt-6 text-[2rem] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-graphite">{excerpt}</p>

          {tags && tags.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-[3px] border border-rule px-2 py-1 font-mono text-[0.6875rem] text-graphite"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="prose prose-lg max-w-none py-12">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
              },
            }}
          />
        </div>

        <div className="border-t border-rule py-12">
          <h2 className="text-2xl font-semibold tracking-tight">{t("ctaHeadline")}</h2>
          <p className="mt-3 leading-relaxed text-graphite">{t("ctaBody")}</p>
          <div className="mt-6">
            <PrimaryLink href="/contact">{th("ctaPrimary")}</PrimaryLink>
          </div>
        </div>

        {(previous || next) && (
          <nav className="grid border-t border-rule sm:grid-cols-2">
            {previous && (
              <AdjacentLink post={previous} label={t("previous")} direction="back" />
            )}
            {next && (
              <AdjacentLink post={next} label={t("next")} direction="forward" />
            )}
          </nav>
        )}
      </div>
    </Container>
  );
}

function AdjacentLink({
  post,
  label,
  direction,
}: {
  post: Post;
  label: string;
  direction: "back" | "forward";
}) {
  const forward = direction === "forward";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block py-8 ${forward ? "sm:col-start-2 sm:text-right" : ""}`}
    >
      <span
        className={`flex items-center gap-2 font-mono text-eyebrow font-medium uppercase text-faint ${
          forward ? "sm:justify-end" : ""
        }`}
      >
        {!forward && <ArrowIcon className="h-3.5 w-3.5 rotate-180" />}
        {label}
        {forward && <ArrowIcon className="h-3.5 w-3.5" />}
      </span>
      <span className="mt-2 block font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-signal">
        {post.frontmatter.title}
      </span>
    </Link>
  );
}
