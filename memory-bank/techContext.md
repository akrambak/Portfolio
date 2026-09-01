# Tech Context

*   **Technologies used:** Next.js 15 (App Router, Turbopack dev), React 19, TypeScript 5, Tailwind CSS v4 (+ `@tailwindcss/typography`), Framer Motion, `next-themes`, `next-mdx-remote` + `gray-matter`, Prism (`prismjs`/`prism-themes`), `react-icons`, Geist fonts. Google Tag Manager for analytics.
*   **Development setup:** `npm install`, then `npm run dev` (port 3210). `npm run build` for production; `npm run start` serves on **port 3100**. `npm run deploy` builds as the `bak-dev` user and restarts PM2 — the only supported way to ship. `npm run lint` runs `eslint-config-next`.
*   **Technical constraints:**
    *   i18n is client-only (no SSR-localized routes); translation keys must exist in both `en.json` and `fr.json`.
    *   `mdxUtils.ts` is `server-only` — do not import it into client components.
    *   Contact API currently logs submissions; email delivery is a TODO (`src/app/api/contact/route.ts`).
    *   `.vscode/sftp.json` (SFTP deploy config) is gitignored — keep credentials out of the repo.
*   **Dependencies:** See `package.json`. No test framework or database is configured; content is static + local MDX.
