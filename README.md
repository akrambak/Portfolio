# Akram Bakhouche — Portfolio

Personal portfolio for a Fullstack Web & Mobile Developer, built with the Next.js App Router. It features a bilingual (EN/FR) interface, light/dark theming, an MDX-powered blog, animated page transitions, and a contact form.

**Live focus:** showcase profile, skills, PrestaShop modules, themes, project portfolio, and blog.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack dev server) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` (pink accent) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (class strategy, system default) |
| Content | MDX via `next-mdx-remote` + `gray-matter` |
| Syntax highlighting | Prism (`prismjs`, `prism-themes`) |
| Icons | `react-icons` |
| Fonts | Geist Sans / Geist Mono (`geist`) |
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
│   ├── layout.tsx           # Root layout: fonts, GTM, ThemeProvider, <Layout>
│   ├── page.tsx             # Home (hero, skills, highlights, testimonials)
│   ├── about/               # About
│   ├── modules/             # PrestaShop modules
│   ├── themes/              # Themes showcase
│   ├── portfolio/           # Project portfolio
│   ├── blog/                # Blog index + [slug] post pages
│   ├── contact/             # Contact page
│   └── api/contact/route.ts # POST endpoint for the contact form
├── components/              # Navbar, Footer, Layout, cards, ThemeToggle, etc.
└── lib/
    ├── mdxUtils.ts          # Server-only MDX reading/serialization
    └── i18n/                # Client-side translation system (en/fr)
content/blog/                # Blog posts (*.mdx)
public/                      # Static assets & placeholder images
memory-bank/                 # Project context docs (see below)
```

## Internationalization

Language switching is **client-side** and does not use locale-prefixed routes. State lives in `localStorage` under the `locale` key (`en` | `fr`).

- Translation strings: `src/lib/i18n/translations/{en,fr}.json`
- Hook: `useTranslation()` from `@/lib/i18n` exposes `t('dotted.key')`, the current `locale`, and `changeLocale()`
- UI: `LanguageSwitcher` toggles the locale and calls `router.refresh()` to re-render

Components that read translations render `null` until mounted to avoid hydration mismatches.

> Note: the `i18n` block in `next.config.ts` is a Pages-Router artifact and is **not** used by the App Router runtime — the working mechanism is the client-side system described above.

### Adding a translation

Add the same key to both `en.json` and `fr.json`, then read it with `t('your.new.key')`.

## Theming

`next-themes` drives light/dark/system modes via the `class` strategy (configured in `src/app/layout.tsx`). `ThemeToggleButton` switches themes; Tailwind `dark:` variants handle styling.

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
