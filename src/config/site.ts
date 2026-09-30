/**
 * Every outward-facing detail lives here.
 *
 * Anything left `null` is treated as "not configured yet" and the UI that
 * would show it is not rendered at all — so a placeholder can never ship.
 * Fill these in and the social row, location line and booking CTA appear.
 */

export interface SiteConfig {
  name: string;
  /** Used for metadataBase, sitemap and OG. */
  url: string;
  email: string | null;
  location: string | null;
  availableForWork: boolean;
  links: {
    github: string | null;
    linkedin: string | null;
    calendly: string | null;
  };
  /** Shown on /privacy when set. */
  legal: {
    /** The controller's postal address. GDPR asks for contact details; email alone is the minimum. */
    postalAddress: string | null;
    /** Who hosts the server, e.g. "Hetzner Online GmbH, Germany". */
    hosting: string | null;
  };
}

export const site: SiteConfig = {
  name: "Akram Bakhouche",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bak-dev.com",

  email: "me@bak-dev.com",
  location: "Remote · EU",
  availableForWork: true,

  // Each one is hidden until it has a real URL.
  links: {
    github: "https://github.com/akrambak",
    linkedin: "https://www.linkedin.com/in/bakhoucheakram/",
    // 30-minute intro call; the event itself runs on Zoom.
    calendly: "https://calendly.com/me-bak-dev/30min",
  },

  // TODO: fill these in for the privacy policy. Each line is hidden until set.
  legal: {
    postalAddress: null,
    hosting: null,
  },
};

/** Narrowing guard — `configured(site.email)` both checks and types. */
export function configured(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export type SocialKey = keyof SiteConfig["links"];

/** Only the socials that have a real URL, in display order. */
export function activeSocials(): Array<{ key: SocialKey; href: string; label: string }> {
  const labels: Record<SocialKey, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    calendly: "Calendly",
  };

  return (["github", "linkedin"] as SocialKey[])
    .filter((key) => configured(site.links[key]))
    .map((key) => ({ key, href: site.links[key] as string, label: labels[key] }));
}
