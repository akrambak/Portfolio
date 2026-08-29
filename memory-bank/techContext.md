# Tech Context

*   **Technologies used:** Next.js 15 (App Router, Turbopack dev), React 19, TypeScript 5, Tailwind CSS v4 CSS-first (+ `@tailwindcss/typography`), `next-intl`, `next-themes`, `next-mdx-remote/rsc` + `gray-matter`, `rehype-pretty-code`/`shiki`, `remark-gfm`, `rehype-slug`, Geist Sans/Mono + Archivo (`next/font`), inline SVG icons. Google Tag Manager for analytics.
*   **Development setup:** `npm install`, then `npm run dev` (port 3000). `npm run build` for production; `npm run start` serves on **port 3100**. `npm run lint` runs `eslint-config-next`.
*   **Technical constraints:**
    *   i18n is SSR via a `locale` cookie (no locale-prefixed routes); every key must exist in both `messages/en.json` and `messages/fr.json`.
    *   There is no `tailwind.config.ts` — Tailwind v4 does not auto-load one. Theme changes go in `@theme inline` in `src/app/globals.css`.
    *   Colour is expressed through semantic tokens, never `dark:` variants.
    *   `mdxUtils.ts` is `server-only` — do not import it into client components.
    *   Contact API currently logs submissions; email delivery is a TODO (`src/app/api/contact/route.ts`).
    *   `.vscode/sftp.json` (SFTP deploy config) is gitignored — keep credentials out of the repo.
*   **Dependencies:** See `package.json`. No test framework or database is configured; content is static + local MDX.
