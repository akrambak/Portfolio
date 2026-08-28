# System Patterns

*   **System architecture:** Next.js App Router. Root `layout.tsx` sets up fonts, GTM, `ThemeProvider`, and the shared `Layout` (Navbar + animated `<main>` + Footer). Routes live under `src/app/*`; reusable UI under `src/components/*`; server/data helpers under `src/lib/*`.
*   **Key technical decisions:**
    *   Client-side i18n via `localStorage` (`locale` key) and a custom `useTranslation()` hook instead of locale-prefixed routes. The `i18n` block in `next.config.ts` is a Pages-Router leftover and is not used by the App Router runtime.
    *   Theming through `next-themes` (`class` strategy, system default).
    *   Blog content as local MDX files read server-side (`mdxUtils.ts` marked `server-only`) and serialized with `next-mdx-remote`.
*   **Design patterns in use:**
    *   `mounted` guard pattern — locale/theme-aware client components return `null` until mounted to avoid hydration mismatches.
    *   `AnimatePresence` keyed by `pathname` for route-transition animations.
    *   Frontmatter-driven content (`gray-matter`) with typed `PostFrontmatter`.
*   **Component relationships:** `Layout` → `Navbar` (`LanguageSwitcher`, `ThemeToggleButton`), animated `main`, `Footer`, `CursorGlow`. Pages compose cards (`ProjectCard`, `ModuleCard`, `ThemeCard`, `PostCard`). `ContactForm` → `POST /api/contact`.
