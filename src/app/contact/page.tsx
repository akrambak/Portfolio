import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";
import { activeSocials, configured, site } from "@/config/site";

const ICONS = { github: FaGithub, linkedin: FaLinkedin } as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("contactPage.title"),
    description: t("contactPage.lede"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations();
  const socials = activeSocials();
  const hasDirect = configured(site.email) || configured(site.location) || socials.length > 0;
  // Until site.ts is filled in there is no sidebar, so the form takes the
  // full column instead of sitting next to an empty half.
  const hasSidebar = hasDirect || configured(site.links.calendly);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        lede={t("contactPage.lede")}
      />

      <div
        className={
          "grid grid-cols-1 gap-14 lg:gap-20 " +
          (hasSidebar ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" : "max-w-2xl")
        }
      >
        <Reveal as="section">
          <h2 className="mb-7 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
            {t("contactPage.formTitle")}
          </h2>
          <ContactForm />
        </Reveal>

        {hasSidebar && (
        <div className="space-y-12">
          {hasDirect && (
            <Reveal as="section">
              <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
                {t("contactPage.infoTitle")}
              </h2>
              <ul className="space-y-3">
                {configured(site.email) && (
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="font-mono text-base text-accent transition-opacity duration-200 hover:opacity-75"
                    >
                      {site.email}
                    </a>
                  </li>
                )}
                {configured(site.location) && (
                  <li className="text-sm text-ink-muted">{site.location}</li>
                )}
                {socials.length > 0 && (
                  <li className="flex flex-wrap gap-2 pt-2">
                    {socials.map(({ key, href, label }) => {
                      const Icon = ICONS[key as keyof typeof ICONS];
                      if (!Icon) return null;
                      return (
                        <Link
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center gap-2.5 rounded-[2px] border border-hairline px-4 font-mono text-xs text-ink-muted transition-colors duration-200 hover:border-hairline-strong hover:text-ink"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {label}
                        </Link>
                      );
                    })}
                  </li>
                )}
              </ul>
            </Reveal>
          )}

          {configured(site.links.calendly) && (
            <Reveal as="section">
              <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.16em] text-ink-faint">
                {t("contactPage.bookTitle")}
              </h2>
              <p className="mb-6 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
                {t("contactPage.bookBody")}
              </p>
              <CTALink href={site.links.calendly} external>
                {t("contactPage.bookCta")}
                <ArrowRight />
              </CTALink>
            </Reveal>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
