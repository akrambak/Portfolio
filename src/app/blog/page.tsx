import Link from "next/link";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getSortedPostsData, type Post } from "@/lib/mdxUtils";
import { PostRow } from "@/components/rows";
import { Container, PageHeader } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return { title: t("eyebrow"), description: t("lead") };
}

type Props = { searchParams: Promise<{ c?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const { c } = await searchParams;
  const posts = getSortedPostsData();
  const categories = [
    ...new Set(posts.map((p) => p.frontmatter.category).filter(Boolean)),
  ] as string[];
  const active = c && categories.includes(c) ? c : null;

  return <BlogIndex posts={posts} categories={categories} active={active} />;
}

function BlogIndex({
  posts,
  categories,
  active,
}: {
  posts: Post[];
  categories: string[];
  active: string | null;
}) {
  const t = useTranslations("blog");
  const visible = active
    ? posts.filter((post) => post.frontmatter.category === active)
    : posts;

  return (
    <Container>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      {categories.length > 1 && (
        <nav aria-label={t("filterLabel")} className="flex flex-wrap items-center gap-2">
          <Chip href="/blog" active={active === null}>
            {t("filterAll")}
          </Chip>
          {categories.map((category) => (
            <Chip key={category} href={`/blog?c=${category}`} active={active === category}>
              {category}
            </Chip>
          ))}
        </nav>
      )}

      <div className="mt-10 border-b border-rule pb-2">
        {visible.length > 0 ? (
          visible.map((post) => <PostRow key={post.slug} post={post} />)
        ) : (
          <p className="border-t border-rule py-12 text-graphite">{t("empty")}</p>
        )}
      </div>
    </Container>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`flex min-h-11 items-center rounded-[3px] border px-3 font-mono text-eyebrow font-medium uppercase transition-colors duration-200 ${
        active
          ? "border-signal bg-signal-wash text-signal"
          : "border-rule text-faint hover:border-rule-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
