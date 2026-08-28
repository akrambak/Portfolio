# Active Context

*   **Current work focus:** Bilingual (EN/FR) support — the custom client-side i18n system (`src/lib/i18n/`), `LanguageSwitcher`, and wiring translations through Navbar, Footer, Layout, Home, About, and ContactForm.
*   **Recent changes:** Added the i18n module and translation files, the `LanguageSwitcher` component, GTM/GTAG integration, a fixed production port (3100), and general CSS/effect polish. Project documentation (README + this memory bank) authored.
*   **Next steps:** Finish translating remaining pages (Modules, Themes, Portfolio, Blog), replace placeholder profile/project images, set real LinkedIn/GitHub URLs in `Footer`, and wire the contact form to an email provider.
*   **Active decisions and considerations:** Keeping i18n client-side for simplicity; the `next.config.ts` `i18n` block is inert under the App Router and can be removed later. Watch for hydration mismatches in locale/theme-aware components (handled with the `mounted` guard).
