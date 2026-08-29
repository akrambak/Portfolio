import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { CalendarIcon } from "@/components/icons";
import { Container, DataSheet, PageHeader, SectionHeader } from "@/components/ui";
import { links, site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("eyebrow"), description: t("lead") };
}

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <Container>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <div className="grid gap-14 pb-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <section>
          <SectionHeader label={t("formLabel")} />
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>

        <aside className="lg:pt-1">
          <SectionHeader label={t("directLabel")} />
          <div className="mt-8">
            <DataSheet
              rows={[
                {
                  label: t("emailLabel"),
                  value: (
                    <a
                      href={`mailto:${site.email}`}
                      className="text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 hover:text-signal"
                    >
                      {site.email}
                    </a>
                  ),
                },
                { label: t("locationLabel"), value: site.locationLabel },
                { label: t("responseLabel"), value: t("responseValue") },
                { label: t("languagesLabel"), value: t("languagesValue") },
              ]}
            />
          </div>

          {links.calendly && (
            <div className="mt-10 rounded-[3px] border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">{t("callLabel")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{t("callBody")}</p>
              <a
                href={links.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-rule-strong px-4 font-mono text-eyebrow font-medium uppercase text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
              >
                <CalendarIcon className="h-4 w-4" />
                {t("callAction")}
              </a>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
