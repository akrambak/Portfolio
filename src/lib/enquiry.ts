/**
 * The enquiry vocabulary — shared by the form, the API route and the mailer.
 *
 * Deliberately NOT `server-only`: the client renders these options and the route
 * validates against them, so the moment the two files hold their own copies the
 * allow-list drifts and a legitimate answer starts failing validation. One list,
 * three consumers.
 *
 * Every slug is `[A-Za-z0-9]` by construction. That is not cosmetic: these values
 * reach a mail subject and an SMTP header, and a slug that cannot contain CR/LF
 * cannot inject one. It also lets a slug double as an i18n path segment
 * (`contactFields.budget.options.from5to15k`), which is why they are camelCase
 * rather than hyphenated — the same nested-object convention as `workPage.filters.*`.
 */

export const ROUTES = ["project", "question", "hiring", "hello"] as const;
export type EnquiryRoute = (typeof ROUTES)[number];

/** What the page opens on, so it is never in an unselected dead state. */
export const DEFAULT_ROUTE: EnquiryRoute = "project";

/**
 * Where an unrecognised route lands on the server.
 *
 * Not a 400. A browser holding a bundle from before this change posts no route at
 * all, and this file is the one that silently discarded every enquiry until 575a390
 * — it does not get a second way to lose one. An enquiry filed under the wrong
 * heading is recoverable; an enquiry that 400s is gone.
 */
export const FALLBACK_ROUTE: EnquiryRoute = "hello";

export const OPTIONS = {
  projectType: ["aiAgents", "ecommerce", "webApp", "mobile", "legacy", "unsure"],
  budget: ["under5k", "from5to15k", "from15to40k", "over40k", "undecided"],
  timeline: ["asap", "month", "quarter", "exploring"],
  engagement: ["fulltime", "contract", "fractional", "advisory"],
  heardVia: ["github", "linkedin", "search", "referral", "event", "other"],
} as const;

export type ChoiceField = keyof typeof OPTIONS;

/** The only multi-select. A single pill cannot occupy two chips — see ChoiceGroup. */
export const MULTI_FIELDS: readonly ChoiceField[] = ["projectType"];

export function isMulti(field: ChoiceField): boolean {
  return MULTI_FIELDS.includes(field);
}

/** Bounds the array the route will accept, so a crafted payload cannot pad the mail body. */
export const MAX_PROJECT_TYPES = OPTIONS.projectType.length;

/** Which questions each route asks, in display order. `question` asks nothing on purpose. */
export const ROUTE_FIELDS: Record<EnquiryRoute, readonly ChoiceField[]> = {
  project: ["projectType", "budget", "timeline"],
  question: [],
  hiring: ["engagement", "timeline"],
  hello: ["heardVia"],
};

/**
 * Required for the client's nudge ONLY. The server never rejects a submission over
 * a missing choice — required-ness belongs in the form, never in a 400.
 */
export const ROUTE_REQUIRED: Record<EnquiryRoute, readonly ChoiceField[]> = {
  project: ["projectType"],
  question: [],
  hiring: ["engagement"],
  hello: [],
};

/**
 * Inbox-facing English, never shown in the UI.
 *
 * The recipient reads one language regardless of the visitor's locale cookie, so a
 * French enquiry must not arrive with French labels to be translated back. The i18n
 * catalogues own what the visitor sees; this owns what the inbox sees.
 */
export const EN_ROUTE_LABELS: Record<EnquiryRoute, string> = {
  project: "New project",
  question: "Quick question",
  hiring: "Hiring / contract",
  hello: "Hello",
};

export const EN_FIELD_LABELS: Record<ChoiceField, string> = {
  projectType: "Type",
  budget: "Budget",
  timeline: "Timeline",
  engagement: "Engagement",
  heardVia: "Found via",
};

export const EN_LABELS: Record<ChoiceField, Record<string, string>> = {
  projectType: {
    aiAgents: "AI agents & LLM features",
    ecommerce: "E-commerce (PrestaShop, Shopify)",
    webApp: "Web app (Laravel, Next.js)",
    mobile: "Mobile (Flutter)",
    legacy: "Legacy rescue & migration",
    unsure: "Not sure yet",
  },
  budget: {
    under5k: "Under EUR 5k",
    from5to15k: "EUR 5k-15k",
    from15to40k: "EUR 15k-40k",
    over40k: "EUR 40k+",
    undecided: "Not defined yet",
  },
  timeline: {
    asap: "ASAP",
    month: "Within a month",
    quarter: "This quarter",
    exploring: "Just exploring",
  },
  engagement: {
    fulltime: "Full-time employment",
    contract: "Contract (B2B)",
    fractional: "Fractional / part-time",
    advisory: "Advisory",
  },
  heardVia: {
    github: "GitHub",
    linkedin: "LinkedIn",
    search: "Search",
    referral: "Referral",
    event: "Conference or meetup",
    other: "Elsewhere",
  },
};

/** Narrowing guard for a value that arrived over the wire. */
export function isRoute(value: unknown): value is EnquiryRoute {
  return typeof value === "string" && (ROUTES as readonly string[]).includes(value);
}
