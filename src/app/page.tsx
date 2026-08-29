import { useTranslations } from "next-intl";
import { getSortedPostsData } from "@/lib/mdxUtils";
import { capabilities, publishedWork } from "@/content/work";
import { site } from "@/config/site";
import { PostRow, WorkRow } from "@/components/rows";
import Pipeline from "@/components/Pipeline";
import { DevicesIcon, InsertionIcon, StorefrontIcon } from "@/components/icons";
import {
  Band,
  Container,
  DataSheet,
  Display,
  Eyebrow,
  PrimaryLink,
  QuietLink,
  SectionHeader,
  Ticker,
} from "@/components/ui";

export default function HomePage() {
  const posts = getSortedPostsData().slice(0, 3);
  return <Home posts={posts} />;
}

function Home({ posts }: { posts: ReturnType<typeof getSortedPostsData> }) {
  const t = useTranslations("home");
  const tc = useTranslations("capabilities");
  const tt = useTranslations("testimonials");
  const glyphs = { agents: InsertionIcon, commerce: StorefrontIcon, apps: DevicesIcon };

  const sheetRows = (
    ["shipping", "core", "ai", "also", "languages", "available"] as const
  ).map((key) => ({ label: t(`sheet.${key}`), value: t(`sheet.${key}Value`) }));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="band-invert relative flex min-h-[92svh] flex-col overflow-hidden">
        <Container className="flex flex-1 flex-col justify-center">
          <div className="pb-14 pt-14 sm:pb-16 sm:pt-16">
            <p className="animate-rise">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
            </p>

            <Display text={t("headlineLines")} delay={120} className="mt-8" />

            <p
              className="animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-graphite sm:text-xl"
              style={{ animationDelay: "560ms" }}
            >
              {t("lead")}
            </p>

            <div
              className="animate-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
              style={{ animationDelay: "640ms" }}
            >
              <PrimaryLink href="/contact">{t("ctaPrimary")}</PrimaryLink>
              <QuietLink href="/blog">{t("ctaSecondary")}</QuietLink>
            </div>
          </div>

        </Container>

        <Container>
          {/* Three real figures, ticking up. */}
          <dl className="grid gap-8 border-t border-rule py-10 sm:grid-cols-3 sm:gap-6 sm:py-12">
            {[
              { key: "years", to: 8, suffix: "", gain: false, delay: 800 },
              { key: "saving", to: 80, suffix: "%", gain: true, delay: 900 },
              { key: "files", to: 5, suffix: "", gain: false, delay: 1000 },
            ].map(({ key, to, suffix, gain, delay }) => (
              <div key={key}>
                <dd
                  className={`text-mega font-semibold tabular-nums ${
                    gain ? "text-gain" : "text-ink"
                  }`}
                >
                  <Ticker to={to} suffix={suffix} delay={delay} />
                </dd>
                <dt className="mt-3 max-w-[22ch] font-mono text-[0.8125rem] leading-relaxed text-graphite">
                  {t(`stats.${key}`)}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── The facts ────────────────────────────────────────────────── */}
      <Band className="reveal py-16 sm:py-20">
        <SectionHeader label={t("capabilitiesLabel")} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <DataSheet rows={sheetRows} />
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {capabilities.map((key) => {
              const Glyph = glyphs[key];
              return (
                <div key={key}>
                  <Glyph className="h-7 w-7 text-graphite" />
                  <h2 className="mt-5 text-lg font-semibold leading-snug tracking-tight">
                    {tc(`${key}.title`)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">
                    {tc(`${key}.body`)}
                  </p>
                  <ul className="mt-5 border-t border-rule">
                    {tc(`${key}.points`)
                      .split("|")
                      .map((point) => (
                        <li
                          key={point}
                          className="border-b border-rule py-2 font-mono text-[0.75rem] text-graphite"
                        >
                          {point}
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Band>

      {/* ── How it goes in ───────────────────────────────────────────── */}
      <Band tone="sunken" className="reveal py-16 sm:py-24">
        <SectionHeader label={t("pipelineLabel")} />
        <Pipeline />
      </Band>

      {/* ── Selected work ────────────────────────────────────────────── */}
      <Band className="reveal py-16 sm:py-24">
        <SectionHeader
          label={t("workLabel")}
          action={<QuietLink href="/work">{t("workAction")}</QuietLink>}
        />
        <div className="mt-2 border-b border-rule">
          {publishedWork.map((entry) => (
            <WorkRow key={entry.slug} entry={entry} />
          ))}
        </div>
      </Band>

      {/* ── Proof ────────────────────────────────────────────────────── */}
      <Band tone="invert" className="reveal py-16 sm:py-24">
        <SectionHeader label={t("proofLabel")} />
        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-16">
          {(["clientA", "clientB"] as const).map((key) => (
            <blockquote key={key}>
              {/* Quote scale, not display scale: text-mega (up to 68px) is for
                  the stat numbers and headlines, and made a one-line quote wrap
                  to four. Leading opened up to match the smaller size. */}
              <p className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                &ldquo;{tt(`${key}.quote`)}&rdquo;
              </p>
              <footer className="mt-6 border-t border-rule pt-4">
                <Eyebrow>{tt(`${key}.author`)}</Eyebrow>
              </footer>
            </blockquote>
          ))}
        </div>
      </Band>

      {/* ── Writing ──────────────────────────────────────────────────── */}
      <Band className="reveal py-16 sm:py-24">
        <SectionHeader
          label={t("writingLabel")}
          action={<QuietLink href="/blog">{t("writingAction")}</QuietLink>}
        />
        <div className="mt-2 border-b border-rule">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      </Band>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <Band tone="invert" className="reveal py-20 sm:py-28">
        <Eyebrow>{t("contactLabel")}</Eyebrow>
        <Display as="h2" size="mega" text={t("contactHeadline")} className="mt-8 max-w-4xl" />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
          {t("contactBody")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
          <PrimaryLink href="/contact">{t("contactAction")}</PrimaryLink>
          <QuietLink href={`mailto:${site.email}`} external>
            {site.email}
          </QuietLink>
        </div>
      </Band>
    </>
  );
}
