# System Patterns

*   **System architecture:** Next.js App Router. Root `layout.tsx` sets up fonts (Geist Sans/Mono + Archivo), GTM, `Person` JSON-LD, `ThemeProvider`, `NextIntlClientProvider` (scoped messages), and `Shell` (skip link + `Nav` + `<main>` + `Footer`). Routes live under `src/app/*`; reusable UI under `src/components/*`; server/data helpers under `src/lib/*`; content data under `src/content/*`; links and identity under `src/config/site.ts`.
*   **Key technical decisions:**
    *   **Design tokens, not `dark:` variants.** `globals.css` defines the whole palette twice — once on `:root`, once on `.dark` — and maps it through Tailwind v4's `@theme inline`. Components use semantic utilities (`bg-paper`, `text-graphite`, `border-rule`, `text-signal`), so a single `.dark` block flips the entire site. Do not add `dark:` classes; add or reuse a token.
    *   **Tailwind v4 is CSS-first.** There is no `tailwind.config.ts` — v4 does not auto-load one. Theme lives in `@theme inline`, plugins load with `@plugin`.
    *   i18n is SSR via `next-intl` with a `locale` cookie (`src/i18n/request.ts`); no locale-prefixed routes.
    *   Theming through `next-themes` (`class` strategy, system default), with `color-scheme` set per mode.
    *   Blog content is local MDX read server-side (`mdxUtils.ts`, `server-only`) and rendered by `next-mdx-remote/rsc` with `remark-gfm`, `rehype-slug` and `rehype-pretty-code` (shiki dual theme).
    *   Filtering (work categories, blog categories) is server-side via `searchParams` — shareable URLs, no client JS.
*   **Design patterns in use:**
    *   Async server page → sync inner component, so `useTranslations` can be used after awaiting `params`/`searchParams`.
    *   Motion is CSS-only: one staggered `animate-rise` load sequence, plus `.reveal` gated behind `@supports (animation-timeline: view())`. `prefers-reduced-motion` is honoured globally.
    *   Config-driven links: anything empty in `src/config/site.ts` renders nothing, so a dead CTA is impossible.
    *   Frontmatter-driven content (`gray-matter`) with typed `PostFrontmatter` including computed `readingMinutes`.
*   **Component relationships:** `Shell` → `Nav` (`LocaleToggle`, `ThemeToggle`) + `main` + `Footer`. Pages compose primitives from `components/ui.tsx` (`Container`, `SectionHeader`, `DataSheet`, `PageHeader`, `PrimaryLink`, `QuietLink`, `Eyebrow`) and rows from `components/rows.tsx` (`WorkRow`, `PostRow`). `ContactForm` → `POST /api/contact`.
