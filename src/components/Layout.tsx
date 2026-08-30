import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Page shell. Transparent on purpose — the paper and its drafting grid are
 * painted by <html>, so nothing here may set a background over them.
 *
 * Free of motion: route transitions live in app/template.tsx, the only
 * wrapper the App Router re-mounts on navigation.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-accent-fill focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-on"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
