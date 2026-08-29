# Akram Bakhouche — Portfolio

Personal site for a fullstack engineer working on AI systems: Claude-SDK agents wired into production Laravel and PrestaShop apps. Built on the Next.js App Router, bilingual EN/FR (SSR), light/dark, MDX blog.

**Design direction — "instrument panel."** The page reads as a precision datasheet: hairline rules, monospace data, tabular numerals, generous whitespace, and a single rationed accent. Sober enough for a technical recruiter's first scan; specific enough to convert a client lead.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack dev server) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4, **CSS-first** (`@theme` in `globals.css`) + `@tailwindcss/typography` |
| i18n | [`next-intl`](https://next-intl.dev) — SSR, `locale` cookie |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (class strategy, system default) |
| Content | MDX via `next-mdx-remote/rsc` + `gray-matter` |
| Syntax highlighting | `rehype-pretty-code` + `shiki` (dual light/dark theme) |
| Motion | CSS only — no animation library |
| Icons | Inline SVG (`src/components/icons.tsx`) |
| Fonts | Archivo (display) + Geist Sans / Geist Mono, self-hosted via `next/font` |
| Analytics | Google Tag Manager |

## Getting Started

**Prerequisites:** Node.js 18.18+ (20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with Turbopack (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on **port 3100** |
| `npm run lint` | ESLint (`eslint-config-next`) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Fonts, metadata, GTM, JSON-LD, providers, Shell
│   ├── page.tsx             # Home
│   ├── work/                # Case studies + capability record (?c= filters)
│   ├── blog/                # Writing index + [slug] post pages
│   ├── about/               # Bio, stack, principles
│   ├── contact/             # Form + direct channels
│   ├── not-found.tsx        # 404
│   ├── sitemap.ts           # sitemap.xml
│   ├── robots.ts            # robots.txt
│   ├── opengraph-image.tsx  # Generated social card
│   ├── globals.css          # Design tokens + base + prose + motion
│   └── api/contact/route.ts # POST endpoint (honeypot + validation)
├── components/
│   ├── ui.tsx               # Container, SectionHeader, DataSheet, PageHeader, links
│   ├── rows.tsx             # WorkRow, PostRow
│   ├── Shell.tsx, Nav.tsx, Footer.tsx, icons.tsx
│   └── ThemeToggle.tsx, LocaleToggle.tsx, ContactForm.tsx
├── config/site.ts           # Identity + external links (single source of truth)
├── content/work.ts          # Work entries (structure; copy lives in messages/)
├── i18n/                    # next-intl config + request handler
└── lib/mdxUtils.ts          # server-only MDX reading, reading time, adjacency
content/blog/                # Blog posts (*.mdx)
messages/{en,fr}.json        # All UI copy
memory-bank/                 # Project context docs
```

## Design tokens

There is **no `tailwind.config.ts`** — Tailwind v4 does not auto-load one, and the previous config was silently dead.

The whole palette is defined twice in `src/app/globals.css` — once on `:root`, once on `.dark` — and mapped through `@theme inline`. Components use semantic utilities only:

`bg-paper` · `bg-raised` · `bg-sunken` · `text-ink` · `text-graphite` · `text-faint` · `border-rule` · `border-rule-strong` · `bg-signal` · `text-signal` · `bg-signal-wash` · `text-on-signal`

> **Do not add `dark:` variants.** Add or reuse a token — the `.dark` block flips the entire site at once. Every foreground/background pair is verified at ≥4.5:1 in both modes.

Type roles: `font-display` (Archivo, ≥28px only), `font-sans` (Geist Sans, body), `font-mono` (Geist Mono, all labels and data). `text-eyebrow` is the small uppercase mono label used throughout.

## Motion

CSS only. One staggered `animate-rise` sequence on page load; `.reveal` scroll animation is progressive enhancement behind `@supports (animation-timeline: view())`, so unsupported browsers simply show the content. `prefers-reduced-motion` is honoured globally in `globals.css`.

## Content

### Links and identity

Everything external lives in `src/config/site.ts`. **An empty value renders nothing** — social icons, the Calendly block and the `sameAs` JSON-LD all disappear rather than shipping a dead link. Fill in `linkedin`, `github`, `calendly` and they appear.

### Work entries

Structure (slug, category, year, stack, metric, link) goes in `src/content/work.ts`; copy goes in `messages/{en,fr}.json` under `work.items.<slug>`. Entries with `status: "draft"` are never rendered — add the copy, flip the status, and the entry appears.

### Blog posts

Drop a `.mdx` file into `content/blog/`:

```yaml
---
title: "Post title"
date: 2026-05-28
excerpt: "Short summary"
category: "Patterns"
tags: ["Claude SDK", "PHP"]
---
```

Reading time is computed, and the category becomes a filter on `/blog` automatically.

### Translations

Add the same key to both `messages/en.json` and `messages/fr.json`. Key parity is not optional — a missing key throws at render. Multi-item strings (capability points, principles, story paragraphs) are pipe-delimited (`|`) and split at render.

## Contact Form

`ContactForm` posts to `POST /api/contact`, which drops honeypot submissions and validates `name`, `email`, `subject`, `message`.

> The route currently **logs** submissions. Wiring an email provider (Resend, Postmark, SES) is a documented TODO in `src/app/api/contact/route.ts`.

## Routing

`/portfolio`, `/modules` and `/themes` 308-redirect into `/work` (the last two with a category filter) — see `next.config.ts`.

## Deployment

`npm run build` produces a standard Next.js build. Self-hosting: `npm run start` binds to **port 3100**. Set `site.url` in `src/config/site.ts` to the production domain — sitemap, canonical URLs and JSON-LD all derive from it.

## License

See [`LICENSE`](./LICENSE).
