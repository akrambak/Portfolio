/**
 * One catalogue behind /work and the "selected work" strip on the home page.
 *
 * Replaces the three near-identical Portfolio / Modules / Themes datasets.
 * `href` is omitted rather than set to "#" when there is nothing to link to
 * yet, so a dead link can never render.
 */

export type WorkKind = "ai" | "ecommerce" | "mobile" | "module" | "theme";

export interface WorkItem {
  slug: string;
  title: string;
  tagline: string;
  kind: WorkKind;
  stack: string[];
  href?: string;
  external?: boolean;
  featured?: boolean;
}

/** Filter order on /work. `all` is prepended by the grid. */
export const WORK_KINDS: WorkKind[] = ["ai", "ecommerce", "mobile", "module", "theme"];

export const WORK: WorkItem[] = [
  {
    slug: "career-os",
    title: "Career-OS",
    tagline:
      "A job-search agent that runs itself: five scrapers feeding a Claude scorer with prompt caching, plus an evaluable drafter.",
    kind: "ai",
    stack: ["Python", "Claude SDK", "Prompt caching", "Evals"],
    href: "/blog/career-os-architecture",
    featured: true,
  },
  {
    slug: "prestashop-claude-agent",
    title: "PrestaShop × Claude agent",
    tagline:
      "A five-file module pattern that wires a Claude agent into the PrestaShop back-office without touching core.",
    kind: "ai",
    stack: ["PrestaShop", "PHP", "Claude SDK"],
    href: "/blog/claude-agent-prestashop-5-files",
    featured: true,
  },
  {
    slug: "llm-eval-harness",
    title: "LLM regression harness",
    tagline:
      "Fixture-based evals with tolerance bands, run on every prompt edit and every model update — so silent regressions surface in CI, not in support tickets.",
    kind: "ai",
    stack: ["Claude SDK", "Testing", "CI"],
    href: "/blog/evaluating-claude-features-before-production",
    featured: true,
  },
  {
    slug: "ecommerce-platform",
    title: "E-commerce platform",
    tagline: "Complete online store on PrestaShop with a custom theme and bespoke modules.",
    kind: "ecommerce",
    stack: ["PrestaShop", "PHP", "MySQL", "jQuery", "Bootstrap"],
  },
  {
    slug: "laravel-api-service",
    title: "Laravel API service",
    tagline: "Backend REST API powering several client applications, with a tested cache layer.",
    kind: "ecommerce",
    stack: ["Laravel", "PHP", "MySQL", "Redis", "PHPUnit"],
  },
  {
    slug: "flutter-booking-app",
    title: "Flutter booking app",
    tagline: "Cross-platform service-booking app backed by Firebase auth and Firestore.",
    kind: "mobile",
    stack: ["Flutter", "Dart", "Firebase", "Bloc"],
  },
  {
    slug: "vue-admin-dashboard",
    title: "Vue admin dashboard",
    tagline: "Data visualisation and management interface for a SaaS product.",
    kind: "mobile",
    stack: ["Vue.js", "Vuex", "Tailwind CSS", "Chart.js", "Laravel"],
  },
  {
    slug: "inventory-manager",
    title: "Inventory Manager",
    tagline: "PrestaShop module for bulk product updates and stock management.",
    kind: "module",
    stack: ["PrestaShop", "PHP", "Smarty"],
  },
  {
    slug: "advanced-seo-suite",
    title: "Advanced SEO Suite",
    tagline: "Automated meta tags and sitemaps to lift store visibility.",
    kind: "module",
    stack: ["PrestaShop", "PHP", "SEO"],
  },
  {
    slug: "one-page-checkout",
    title: "One-Page Checkout",
    tagline: "Collapses the checkout funnel into a single step to recover abandoned carts.",
    kind: "module",
    stack: ["PrestaShop", "PHP", "jQuery"],
  },
  {
    slug: "affiliate-program-manager",
    title: "Affiliate Program Manager",
    tagline: "Affiliate tracking, referral attribution and automated commission payouts.",
    kind: "module",
    stack: ["PrestaShop", "PHP", "MySQL"],
  },
  {
    slug: "minimalist-clean-theme",
    title: "Minimalist Clean",
    tagline: "Typography-led storefront theme built on a whitespace-first grid.",
    kind: "theme",
    stack: ["PrestaShop", "Bootstrap", "SASS"],
  },
  {
    slug: "vibrant-product-showcase",
    title: "Vibrant Showcase",
    tagline: "Colour-forward theme built to put product photography first.",
    kind: "theme",
    stack: ["PrestaShop", "SASS", "Responsive"],
  },
  {
    slug: "tech-gadget-hub",
    title: "Tech Gadget Hub",
    tagline: "Dark-mode storefront theme tailored to electronics catalogues.",
    kind: "theme",
    stack: ["PrestaShop", "Dark mode", "SASS"],
  },
];

export const FEATURED_WORK = WORK.filter((item) => item.featured);

export function workByKind(kind: WorkKind | "all"): WorkItem[] {
  return kind === "all" ? WORK : WORK.filter((item) => item.kind === kind);
}
