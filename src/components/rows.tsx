import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowIcon } from "./icons";
import { Eyebrow } from "./ui";
import type { WorkEntry } from "@/content/work";
import type { Post } from "@/lib/mdxUtils";

export function WorkRow({ entry }: { entry: WorkEntry }) {
  const t = useTranslations("work");
  const item = `items.${entry.slug}` as const;

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-6">
        <Eyebrow>
          {t(`categories.${entry.category}`)}
          {entry.year && ` · ${entry.year}`}
        </Eyebrow>
        {entry.metric && (
          <span className="font-mono text-xl font-medium tracking-tight text-signal">
            {entry.metric}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-2xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-signal">
        {t(`${item}.title`)}
      </h3>
      <p className="mt-1 font-mono text-eyebrow uppercase text-faint">
        {t(`${item}.kind`)}
      </p>
      <p className="mt-4 max-w-2xl leading-relaxed text-graphite">
        {t(`${item}.summary`)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
        {entry.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-[3px] border border-rule px-2 py-1 font-mono text-[0.6875rem] text-graphite"
          >
            {tech}
          </span>
        ))}
      </div>

      {entry.href && (
        <span className="mt-6 inline-flex items-center gap-2 font-mono text-eyebrow font-medium uppercase text-ink transition-colors duration-200 group-hover:text-signal">
          {t("caseStudy")}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  if (!entry.href) {
    return <article className="border-t border-rule py-10">{body}</article>;
  }

  return (
    <Link
      href={entry.href}
      className="group block border-t border-rule py-10 transition-colors duration-200 hover:border-signal"
    >
      {body}
    </Link>
  );
}

export function PostRow({ post }: { post: Post }) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const { title, date, excerpt, category, readingMinutes } = post.frontmatter;

  return (
    <article className="border-t border-rule">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col gap-2 py-6 transition-colors duration-200 md:flex-row md:gap-8"
      >
        <div className="flex shrink-0 items-baseline gap-3 md:w-40 md:flex-col md:gap-1.5">
          <time
            dateTime={date}
            className="font-mono text-[0.8125rem] text-faint"
          >
            {format.dateTime(new Date(date), {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </time>
          {category && <Eyebrow>{category}</Eyebrow>}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-signal">
            {title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
            {excerpt}
          </p>
        </div>

        <span className="shrink-0 font-mono text-[0.8125rem] text-faint md:pt-1">
          {t("readingTime", { minutes: readingMinutes })}
        </span>
      </Link>
    </article>
  );
}
