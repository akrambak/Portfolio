import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { Archivo } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import Shell from "@/components/Shell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site, activeLinks } from "@/config/site";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#12161b" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t("role")}`,
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${t("role")}`,
      description: t("description"),
      url: site.url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${t("role")}`,
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const t = await getTranslations("meta");
  const messages = await getMessages();

  // Only the namespaces the client components read cross the wire.
  const clientMessages = {
    nav: messages.nav,
    controls: messages.controls,
    form: messages.form,
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: t("role"),
    description: t("description"),
    knowsLanguage: ["fr", "en"],
    sameAs: activeLinks.map(([, href]) => href),
  };

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink">
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MD68KMQC');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MD68KMQC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Shell>{children}</Shell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
