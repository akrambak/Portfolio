# Progress

*   **What works:** App Router site with Home, About, Modules, Themes, Portfolio, Blog (MDX index + `[slug]`), and Contact pages. Light/dark theming, Framer Motion route transitions, `CursorGlow`, GTM analytics, EN/FR language switching, and the contact form UI posting to `/api/contact` (with field validation).
*   **What's left to build:** Full EN/FR coverage across all pages, real content/images (profile, projects, themes), email delivery for the contact form, and populated social links.
*   **Current status:** Actively developed. Builds and runs; production served on port 3100.
*   **Known issues:** Contact API only logs submissions (no email sent). Footer social links are placeholders (`#`). Home uses a placeholder profile image. The `next.config.ts` `i18n` config is inert under the App Router.
