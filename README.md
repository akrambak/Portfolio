# Akram Bakhouche — Portfolio

Personal portfolio for a Fullstack Web & Mobile Developer, built with the Next.js App Router. It features a bilingual (EN/FR) interface, light/dark theming, an MDX-powered blog, animated page transitions, and a contact form.

**Live focus:** showcase profile, skills, PrestaShop modules, themes, project portfolio, and blog.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack dev server) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens in `globals.css` + `@tailwindcss/typography` |
| Animation | [Framer Motion](https://www.framer.com/motion/), centralised in `src/lib/motion.ts` |
| Art direction | "Blueprint" — single committed light palette, drafting grid, schematic chrome |
| Content | MDX via `next-mdx-remote` + `gray-matter` |
| Syntax highlighting | Prism (`prismjs`, `prism-themes`) |
| Icons | `react-icons` |
| Fonts | Space Grotesk (display) / IBM Plex Sans (body) / IBM Plex Mono (annotation) via `next/font/google` |
| Analytics | Google Tag Manager |

## Getting Started

**Prerequisites:** Node.js 18.18+ (20 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server with Turbopack (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on **port 3100** |
| `npm run lint` | Run ESLint (`eslint-config-next`) |

## Project Structure

```
src/
├── app/                     # App Router routes
│   ├── layout.tsx           # Root layout: fonts, metadata, GTM, ThemeProvider, <Layout>
│   ├── template.tsx         # Route transition (re-mounts on navigation)
│   ├── page.tsx             # Home (hero, proof, work, capabilities, writing, CTA)
│   ├── work/                # Filterable grid: AI, e-commerce, mobile, modules, themes
│   ├── about/               # About
│   ├── blog/                # Blog index + [slug] post pages
│   ├── contact/             # Contact page
│   ├── not-found.tsx        # 404
│   ├── opengraph-image.tsx  # Generated OG image
│   ├── sitemap.ts robots.ts # SEO surface
│   └── api/contact/route.ts # POST endpoint for the contact form
├── components/
│   ├── motion/              # Reveal, TextReveal, SpotlightCard, Magnetic, ScrollProgress
│   ├── home/                # Hero, Capabilities, Testimonials
│   └── ui/                  # CTALink, PageHeader, SectionHeader
├── config/site.ts           # Email, socials, Calendly, availability (see below)
├── content/work.ts          # Unified work catalogue behind /work
├── i18n/                    # next-intl locale config + request handler
└── lib/
    ├── mdxUtils.ts          # Server-only MDX reading + reading-time
    └── motion.ts            # Durations, easings, distances, variant factories
content/blog/                # Blog posts (*.mdx)
messages/                    # en.json / fr.json
memory-bank/                 # Project context docs (see below)
```

## Site configuration

Every outward-facing detail — email, GitHub, LinkedIn, Calendly, location, availability — lives in **`src/config/site.ts`**. Anything left `null` is treated as "not configured yet" and the UI that would show it is **not rendered at all**, so a placeholder can never ship. Fill the file in and the social row, direct-contact block and booking CTA appear on their own.

## Internationalization

Server-side via **next-intl**, without locale-prefixed routes. The active locale is stored in a `locale` cookie (`en` | `fr`) and read in `src/i18n/request.ts`.

- Translation strings: `messages/{en,fr}.json`
- Server components: `getTranslations()` from `next-intl/server`
- Client components: `useTranslations()` from `next-intl`
- UI: `LanguageSwitcher` sets the cookie and calls `router.refresh()`

### Adding a translation

Add the same key to **both** `messages/en.json` and `messages/fr.json`, then read it with `t('your.new.key')`. The two files must stay at exact key parity.

## Design system & motion — "Blueprint"

The site is drawn as a technical document: warm paper, a drafting grid, hairline rules with tick ends, mono annotations, one ink colour (`--accent`, blueprint navy) plus one annotation colour (`--accent-2`, redline). Corners are 2px, elevation comes from rules and inset paper, and there are no shadows or gradients.

Design tokens are declared CSS-first in `src/app/globals.css` using Tailwind v4's `@theme`, with semantic names (`canvas`, `surface`, `raised`, `hairline`, `ink`, `ink-muted`, `ink-faint`, `accent`, `accent-2`). There is **no `tailwind.config.ts`** — Tailwind v4 ignores a JS config unless `@config` is declared, which is why an earlier accent colour and every `prose` style silently emitted no CSS.

> Raw CSS must reference `--font-grotesk` / `--font-plex` / `--font-plex-mono` and the easing variables directly. `@theme inline` inlines its values into utilities and emits **no** custom property, so `var(--font-sans)` in a hand-written rule resolves to nothing and invalidates the declaration.

The drafting grid lives on the `<html>` background (8px minor, 64px major) rather than a pseudo-element, so nothing in the tree may paint an opaque background over it.

**Schematic primitives** in `src/components/schematic/` supply the drawn chrome: `Rule`, `DimensionLine`, `CornerBrackets`, `FigureLabel` and `SchematicPlate`. `PlateHover` reveals a local grid under the cursor by writing `--mx`/`--my` inside a rAF, so nothing re-renders on mousemove.

**Generated imagery, no photography.** `src/lib/plate.ts` derives a plan-view from a hash of each work item's slug (FNV-1a seeding mulberry32) — deterministic on purpose, since `Math.random()` would produce different geometry on server and client and surface as a hydration mismatch. `PipelineSchematic` on the home page is an annotated plan of a real agent pipeline.

All motion constants live in `src/lib/motion.ts`. Every animated component gates on `useReducedMotion()`, backed by a global `prefers-reduced-motion` rule in `globals.css`.

> Motion is driven by Framer Motion, which runs on `requestAnimationFrame`. Elements that animate in start from `opacity: 0`, so in an environment where rAF never fires (JavaScript disabled, or a suspended renderer) they stay hidden.

## Routing

`/portfolio`, `/modules` and `/themes` were merged into the filterable `/work` grid and now issue permanent redirects (see `next.config.ts`).

## Theming

There is **one** committed light palette and no theme toggle. `next-themes`, the `dark:` variant and the `.dark` token block were all removed: a single context lets the paper, ink weights and grid density be tuned once rather than survive two, and it removes a class of contrast bugs. Components style with semantic tokens (`bg-surface`, `text-ink`), so re-skinning is a token swap rather than a sweep.

## Blog (MDX)

Posts live in `content/blog/*.mdx` and are read server-side by `src/lib/mdxUtils.ts` (`server-only`).

Frontmatter shape:

```yaml
---
title: "Post title"
date: 2025-05-01
excerpt: "Short summary"
category: "Optional"
tags: ["optional", "tags"]
---
```

- `getSortedPostsData()` — index, newest first
- `getPostData(slug)` — single post, serialized with `next-mdx-remote`

Add a post by dropping a new `.mdx` file into `content/blog/`.

## Contact Form

`ContactForm` posts to `POST /api/contact`, which validates `name`, `email`, `subject`, and `message`.

> The API route currently **logs** submissions server-side; wiring an email provider (e.g. Resend, SendGrid, Nodemailer) is a documented TODO in `src/app/api/contact/route.ts`.

## Analytics

Google Tag Manager (container `GTM-MD68KMQC`) is injected in `src/app/layout.tsx` via `next/script`, with the `<noscript>` fallback in `<body>`.

## Deployment

Optimized for [Vercel](https://vercel.com/new). `npm run build` produces a standard Next.js build. If self-hosting, note `npm run start` binds to **port 3100**.

## memory-bank/

`memory-bank/` holds structured project context (brief, product, system patterns, tech, active context, progress) consumed by AI coding tools. Keep it current when project scope or status changes.

## License

See [`LICENSE`](./LICENSE).
