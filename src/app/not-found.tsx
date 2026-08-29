import { useTranslations } from "next-intl";
import { Container, Eyebrow, PrimaryLink, QuietLink } from "@/components/ui";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container>
      <div className="flex min-h-[60vh] max-w-2xl flex-col justify-center py-20">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-graphite">{t("body")}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2">
          <PrimaryLink href="/">{t("home")}</PrimaryLink>
          <QuietLink href="/blog">{t("writing")}</QuietLink>
        </div>
      </div>
    </Container>
  );
}
