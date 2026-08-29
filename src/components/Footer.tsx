import Link from "next/link";
import { useTranslations } from "next-intl";
import { GitHubIcon, LinkedInIcon, XIcon } from "./icons";
import { Container, Eyebrow } from "./ui";
import { site, activeLinks, type LinkKey } from "@/config/site";

const socialIcons: Partial<Record<LinkKey, typeof GitHubIcon>> = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  x: XIcon,
};

const socialLabels: Partial<Record<LinkKey, string>> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

const routes = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "writing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-rule">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2">
          <div>
            <p className="font-display text-base font-semibold tracking-tight">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-graphite">{t("meta.role")}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block font-mono text-[0.8125rem] text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 hover:text-signal"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label={t("nav.secondary")} className="sm:justify-self-end">
            <ul className="space-y-2.5">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="font-mono text-eyebrow font-medium uppercase text-graphite transition-colors duration-200 hover:text-signal"
                  >
                    {t(`nav.${route.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <Eyebrow>
            © {new Date().getFullYear()} {site.name} · {site.locationLabel}
          </Eyebrow>
          {activeLinks.length > 0 && (
            <ul className="flex items-center gap-1">
              {activeLinks.map(([key, href]) => {
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center text-faint transition-colors duration-200 hover:text-ink"
                    >
                      <span className="sr-only">{socialLabels[key]}</span>
                      <Icon className="h-[1.05rem] w-[1.05rem]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  );
}
