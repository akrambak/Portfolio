import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { site, configured } from "@/config/site";
import { getLead, recordEvent, type LeadReport } from "@/lib/leads";
import { ReportBeacon, QuoteButton } from "./ReportBeacon";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: Locale; lead: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Never indexed, and the key must never leak through the Referer to the Calendly /
 *  mailto hand-off. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Security report",
    robots: { index: false, follow: false, nocache: true },
    referrer: "no-referrer",
  };
}

const SEVERITY_TONE: Record<string, string> = {
  critical: "text-accent-2 border-accent-2",
  high: "text-accent-2 border-hairline-strong",
  medium: "text-ink-muted border-hairline-strong",
  low: "text-ink-faint border-hairline",
};

export default async function ReportPage({ params, searchParams }: PageProps) {
  const { locale, lead } = await params;
  setRequestLocale(locale);

  const report = await getLead(lead);
  if (!report) notFound();

  const sp = await searchParams;
  const token = typeof sp.e === "string" ? sp.e : undefined;

  // The arrival itself, logged off the response path. A real human almost always also
  // fires report_view from the browser; this still captures a no-JS open and ties the
  // visit to the exact send via the token.
  after(async () => {
    await recordEvent({ type: "click", lead, at: new Date().toISOString(), path: "/r", meta: token ? { e: token } : undefined });
  });

  const t = await getTranslations({ locale, namespace: "report" });
  const platformName = report.platform === "magento" ? "Magento" : "PrestaShop";
  const bookingHref = configured(site.links.calendly) ? site.links.calendly : null;
  const mailto = quoteMailto(report, locale, t("quoteSubject", { domain: report.domain }));

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <ReportBeacon lead={lead} token={token} />

      <header className="mb-12">
        <p className="mb-5 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
          <span aria-hidden="true" className="h-2 w-2 bg-accent-2" />
          {t("eyebrow")}
        </p>
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.03em] text-ink">
          {report.domain}
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-ink-muted">
          {t("lede", { running: report.running })}
        </p>
      </header>

      <section className="mb-12 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
        <Fact label={t("platform")} value={platformName} />
        <Fact
          label={t("support")}
          value={report.eol ? t("eol") : t("supported")}
          tone={report.eol ? "alert" : undefined}
        />
        <Fact
          label="PHP"
          value={report.php ? t("phpEol", { version: report.php }) : t("phpOk")}
          tone={report.php ? "alert" : undefined}
        />
      </section>

      {report.cves.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink-faint">
            {t("vulnTitle", { count: report.cve_count })}
          </h2>
          <ul className="space-y-px border border-hairline bg-hairline">
            {report.cves.map((c) => (
              <li key={c.cve} className="bg-surface p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-ink">{c.cve}</span>
                  {c.severity && (
                    <span
                      className={`border px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide ${
                        SEVERITY_TONE[c.severity] ?? "text-ink-muted border-hairline"
                      }`}
                    >
                      {c.severity}
                    </span>
                  )}
                  {typeof c.cvss === "number" && (
                    <span className="font-mono text-[0.72rem] text-ink-faint">CVSS {c.cvss}</span>
                  )}
                  {c.kev && (
                    <span className="border border-accent-2 px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide text-accent-2">
                      {t("kev")}
                    </span>
                  )}
                </div>
                {c.title && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.title}</p>}
              </li>
            ))}
          </ul>
          {report.cve_count > report.cves.length && (
            <p className="mt-3 font-mono text-xs text-ink-faint">
              {t("andMore", { n: report.cve_count - report.cves.length })}
            </p>
          )}
        </section>
      )}

      <section className="mb-12 max-w-[64ch] border-l-2 border-accent pl-6">
        <h2 className="mb-3 font-display text-xl font-medium text-ink">{t("meansTitle")}</h2>
        <p className="text-base leading-relaxed text-ink-muted">{t("meansBody")}</p>
      </section>

      <section className="mb-12 max-w-[64ch]">
        <h2 className="mb-4 font-display text-xl font-medium text-ink">{t("fixTitle")}</h2>
        <ul className="space-y-2 text-base leading-relaxed text-ink-muted">
          {(["backup", "upgrade", "harden"] as const).map((k) => (
            <li key={k} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent-2" />
              {t(`fix.${k}`)}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-sm text-ink">{t("price", { price: report.price, platform: platformName })}</p>
      </section>

      <section className="flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center">
        {bookingHref && (
          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="book_call"
            data-track-location="report"
            className="inline-flex h-12 items-center justify-center rounded-[2px] bg-accent-fill px-6 font-mono text-sm tracking-tight text-accent-on transition-colors duration-200 hover:bg-ink"
          >
            {t("bookCall")}
          </a>
        )}
        <QuoteButton
          lead={lead}
          mailto={mailto}
          label={t("getQuote")}
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-[2px] border border-hairline-strong px-6 font-mono text-sm tracking-tight text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        />
      </section>

      <footer className="mt-14 border-t border-hairline pt-6 text-sm text-ink-faint">
        <p>{t("ps")}</p>
        <p className="mt-2">
          <a href={`/px/u/${lead}`} className="underline underline-offset-2 hover:text-ink-muted">
            {t("unsubscribe")}
          </a>
        </p>
      </footer>
    </div>
  );
}

function Fact({ label, value, tone }: { label: string; value: string; tone?: "alert" }) {
  return (
    <div className="bg-surface p-5">
      <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-ink-faint">{label}</p>
      <p className={`mt-2 text-sm font-medium ${tone === "alert" ? "text-accent-2" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

function quoteMailto(report: LeadReport, locale: string, subject: string): string {
  const to = site.email ?? "";
  const body =
    locale === "fr"
      ? `Bonjour,\n\nJe souhaite un devis ferme pour la mise à jour de ${report.domain} (${report.running}).\n`
      : `Hello,\n\nI'd like a fixed quote to upgrade ${report.domain} (${report.running}).\n`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
