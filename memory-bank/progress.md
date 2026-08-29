# Progress

*   **What works:** Four-route site — Home, Work, Blog (MDX index + `[slug]`), About, Contact — on a token-based design system ("instrument panel": paper/ink/graphite with a single rationed `signal` accent). Full EN/FR SSR coverage with key parity enforced. Light/dark via tokens, CSS-only motion, GTM, sitemap, robots, `Person` and `BlogPosting` JSON-LD, generated OG image, MDX with shiki syntax highlighting, server-side category filters, honeypot-protected contact form, 404 page.
*   **What's left to build:** Real client case studies (two `draft` entries scaffolded in `src/content/work.ts`), LinkedIn/GitHub/Calendly URLs in `src/config/site.ts`, email delivery for the contact form, and confirmation that `site.url` matches the deployed domain.
*   **Current status:** Redesigned and rebuilt. `next build` and `next lint` both clean; production served on port 3100.
*   **Known issues:** Contact API only logs submissions (no email sent). Social/Calendly links are unset, so those UI blocks are hidden by design until filled. `site.url` is currently assumed to be `https://bak-dev.com`.
