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
}

export const site: SiteConfig = {
  name: "Akram Bakhouche",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bak-dev.com",

  // TODO: replace with the real values.
  email: null,
  location: null,
  availableForWork: true,
  links: {
    github: null,
    linkedin: null,
    calendly: null,
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
