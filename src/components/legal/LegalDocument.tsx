import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { configured, site } from "@/config/site";
import type { PrivacyBlock, PrivacyContent } from "@/content/privacy";

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** `{email}` → site.email, `[label](href)` → an anchor. Nothing else is interpreted. */
function renderText(text: string): ReactNode[] {
  const filled = text.replaceAll("{email}", site.email ?? "");
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of filled.matchAll(LINK)) {
    const [whole, label, href] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(filled.slice(last, index));
    const external = href.startsWith("http");
    parts.push(
      <a
        key={index}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>,
    );
    last = index + whole.length;
  }
  if (last < filled.length) parts.push(filled.slice(last));
  return parts;
}

function Block({ block }: { block: PrivacyBlock }) {
  switch (block.kind) {
    case "p":
      return <p>{renderText(block.text)}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{renderText(item)}</li>
          ))}
        </ul>
      );
    case "table":
      // Wide on a phone: the table scrolls inside its own box, never the page.
      return (
        <div className="not-prose my-6 overflow-x-auto border border-hairline">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="bg-raised">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="border-b border-hairline px-4 py-3 font-mono text-[0.68rem] font-normal uppercase tracking-[0.12em] text-ink-faint"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-hairline last:border-b-0">
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={
                        "px-4 py-3 align-top leading-relaxed " +
                        (index === 0 ? "font-medium text-ink" : "text-ink-muted")
                      }
                    >
                      {renderText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

interface LegalDocumentProps {
  locale: Locale;
  content: PrivacyContent;
  /** ISO date, shown under the title. */
  updated: string;
}

/**
 * A privacy policy page body: title block, last-updated line, then each section.
 * The controller section also shows site.legal's postal address and host once set.
 */
export function LegalDocument({ locale, content, updated }: LegalDocumentProps) {
  const updatedLabel = new Date(updated).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <PageHeader eyebrow={content.eyebrow} title={content.title} lede={content.lede} />

      <p className="-mt-8 mb-12 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
        {content.updatedLabel} · <time dateTime={updated}>{updatedLabel}</time>
      </p>

      <div className="prose max-w-none">
        {content.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2>{section.title}</h2>
            {section.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
            {section.id === "controller" && (
              <>
                {configured(site.legal.postalAddress) && (
                  <p>
                    {content.controllerAddress}: {site.legal.postalAddress}
                  </p>
                )}
                {configured(site.legal.hosting) && (
                  <p>
                    {content.hostingLabel}: {site.legal.hosting}
                  </p>
                )}
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
