import { notFound } from "next/navigation";

/**
 * The middleware rewrites every unmatched path into a locale, so without this
 * catch-all an unknown URL would fall through to the bare root not-found, outside
 * the site chrome. Throwing here renders [locale]/not-found.tsx instead — in the
 * visitor's language, with the navbar.
 */
export default function CatchAll() {
  notFound();
}
