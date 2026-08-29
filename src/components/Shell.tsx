import { useTranslations } from "next-intl";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Shell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("controls");

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[3px] focus:bg-signal focus:px-4 focus:py-3 focus:font-mono focus:text-eyebrow focus:uppercase focus:text-on-signal"
      >
        {t("skipToContent")}
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
