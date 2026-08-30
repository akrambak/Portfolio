import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { activeSocials, configured, site } from "@/config/site";

const ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
} as const;

const FOOTER_LINKS = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "writing" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Footer() {
  const t = useTranslations();
  const socials = activeSocials();

  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-mono text-sm font-semibold text-ink">
              <span className="text-accent">/</span> {site.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {t("footer.blurb")}
            </p>
            {configured(site.email) && (
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-block font-mono text-sm text-accent transition-opacity duration-200 hover:opacity-75"
              >
                {site.email}
              </a>
            )}
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center font-mono text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                {t(`navigation.${link.key}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-6 border-t border-hairline pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-ink-faint">
            © {new Date().getFullYear()} {site.name}. {t("footer.copyright")}
          </p>

          {socials.length > 0 && (
            <ul className="flex items-center gap-1">
              {socials.map(({ key, href, label }) => {
                const Icon = ICONS[key as keyof typeof ICONS];
                if (!Icon) return null;
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-[2px] text-ink-faint transition-colors duration-200 hover:bg-raised hover:text-ink"
                    >
                      <span className="sr-only">{label}</span>
                      <Icon className="h-[18px] w-[18px]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
