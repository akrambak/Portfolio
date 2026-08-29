export const site = {
  name: "Akram Bakhouche",
  initials: "AB",
  url: "https://bak-dev.com",
  email: "me@bak-dev.com",
  locationLabel: "Remote · EU",
} as const;

// Fill these in and the matching UI appears automatically.
// Anything left empty is never rendered — no dead links, ever.
export const links = {
  linkedin: "", // TODO: https://www.linkedin.com/in/...
  github: "", // TODO: https://github.com/...
  calendly: "", // TODO: https://calendly.com/...
  x: "", // TODO: https://x.com/...
} as const;

export type LinkKey = keyof typeof links;

export const activeLinks = (Object.entries(links) as [LinkKey, string][]).filter(
  ([, href]) => href.length > 0,
);
