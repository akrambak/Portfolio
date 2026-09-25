import type { ReactNode } from "react";

/**
 * The real root layout is [locale]/layout.tsx — it owns <html lang>, which has to
 * know the locale. This pass-through only exists so src/app/not-found.tsx has a
 * layout to sit in.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
