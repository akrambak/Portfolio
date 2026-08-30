import { getTranslations } from "next-intl/server";
import { ArrowRight, CTALink } from "@/components/ui/CTALink";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="mb-6 font-display text-6xl font-semibold tracking-[-0.04em] text-accent sm:text-8xl">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
        {t("notFound.title")}
      </h1>
      <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-muted">
        {t("notFound.body")}
      </p>
      <div className="mt-9">
        <CTALink href="/">
          {t("notFound.cta")}
          <ArrowRight />
        </CTALink>
      </div>
    </div>
  );
}
