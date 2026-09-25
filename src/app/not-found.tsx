import Link from "next/link";
import "./globals.css";

/**
 * Last-resort 404 for requests the i18n middleware never sees (paths with a file
 * extension, for instance). Everything else gets the localized [locale]/not-found.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 text-center">
          <p className="mb-6 font-mono text-6xl text-accent">404</p>
          <Link href="/" className="font-mono text-sm text-ink underline">
            bak-dev.com
          </Link>
        </main>
      </body>
    </html>
  );
}
