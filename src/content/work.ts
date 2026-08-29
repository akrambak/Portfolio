export type WorkCategory = "ai" | "ecommerce" | "mobile" | "modules";

export type WorkEntry = {
  slug: string;
  category: WorkCategory;
  year: string;
  stack: string[];
  /** Rendered large, in tabular numerals. Keep it to one honest figure. */
  metric: string;
  /** Deep link: a case-study article, a repo, a live site. */
  href?: string;
  status: "published" | "draft";
};

/* Copy for each entry lives in messages/{en,fr}.json under `work.items.<slug>`
   so both locales stay in sync. Entries marked `draft` are never rendered —
   add the copy, flip the status, and the card appears. */
export const workEntries: WorkEntry[] = [
  {
    slug: "career-os",
    category: "ai",
    year: "2026",
    stack: ["Python", "Claude SDK", "Prompt caching", "Eval harness"],
    metric: "−80%",
    href: "/blog/career-os-architecture",
    status: "published",
  },
  {
    slug: "prestashop-claude",
    category: "modules",
    year: "2026",
    stack: ["PrestaShop 1.7", "PHP", "Claude SDK", "Smarty"],
    metric: "5 files",
    href: "/blog/claude-agent-prestashop-5-files",
    status: "published",
  },

  // TODO: your own client work. Add copy under work.items.<slug> in both
  // messages files, then change status to "published".
  {
    slug: "placeholder-ecommerce",
    category: "ecommerce",
    year: "",
    stack: [],
    metric: "",
    status: "draft",
  },
  {
    slug: "placeholder-mobile",
    category: "mobile",
    year: "",
    stack: [],
    metric: "",
    status: "draft",
  },
];

export const publishedWork = workEntries.filter((w) => w.status === "published");

export const workCategories: WorkCategory[] = ["ai", "ecommerce", "mobile", "modules"];

/* Eight years of delivery, described as capability rather than invented as
   named case studies. */
export const capabilities = ["agents", "commerce", "apps"] as const;

export type Capability = (typeof capabilities)[number];
