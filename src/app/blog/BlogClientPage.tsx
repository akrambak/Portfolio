"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Post, PostFrontmatter } from "@/lib/mdxUtils";
import { dur, ease } from "@/lib/motion";

interface BlogClientPageProps {
  allPosts: Post<PostFrontmatter>[];
}

export default function BlogClientPage({ allPosts }: BlogClientPageProps) {
  const t = useTranslations();
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(allPosts.flatMap((post) => post.frontmatter.tags ?? []))).sort(),
    [allPosts],
  );

  const filteredPosts = useMemo(
    () =>
      selectedTag
        ? allPosts.filter((post) => post.frontmatter.tags?.includes(selectedTag))
        : allPosts,
    [allPosts, selectedTag],
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("blogPage.eyebrow")}
        title={t("blogPage.title")}
        lede={t("blogPage.lede")}
      />

      {tags.length > 0 && (
        <div
          role="group"
          aria-label={t("blogPage.filterBy")}
          className="mb-10 flex flex-wrap gap-2"
        >
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            aria-pressed={selectedTag === null}
            className={
              "relative flex h-9 cursor-pointer items-center rounded-[2px] px-3.5 font-mono text-xs tracking-tight transition-colors duration-200 " +
              (selectedTag === null
                ? "text-accent-on"
                : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink")
            }
          >
            {selectedTag === null && (
              <motion.span
                layoutId="tag-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            {t("blogPage.backToAll")}
          </button>

          {tags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(active ? null : tag)}
                aria-pressed={active}
                className={
                  "relative flex h-9 cursor-pointer items-center rounded-[2px] px-3.5 font-mono text-xs tracking-tight transition-colors duration-200 " +
                  (active
                    ? "text-accent-on"
                    : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink")
                }
              >
                {active && (
                  <motion.span
                    layoutId="tag-pill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[2px] bg-accent-fill"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">{t("blogPage.empty")}</p>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.li
                key={post.slug}
                layout={!reduced}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -4 }}
                transition={{ duration: reduced ? 0 : dur.base, ease: ease.out }}
              >
                <PostCard
                  post={post}
                  locale={locale}
                  readingTimeLabel={t("writingSection.readingTime", {
                    minutes: post.readingMinutes,
                  })}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
