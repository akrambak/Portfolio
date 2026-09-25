"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  // Navigates to the same page under the other locale's URL rather than flipping
  // a cookie in place — each language now has its own indexable address. The
  // middleware still writes the `locale` cookie on the way through.
  const setLocale = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale, scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-[2px] border border-hairline p-0.5"
    >
      {locales.map((locale) => {
        const active = activeLocale === locale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => setLocale(locale)}
            disabled={isPending}
            aria-pressed={active}
            aria-label={`Switch to ${localeNames[locale]}`}
            title={localeNames[locale]}
            className={
              "relative flex h-9 min-w-11 cursor-pointer items-center justify-center rounded-[2px] px-2 font-mono text-xs tracking-wider transition-colors duration-200 disabled:cursor-wait " +
              (active ? "text-ink" : "text-ink-faint hover:text-ink")
            }
          >
            {active && (
              <motion.span
                layoutId="locale-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-[2px] bg-raised"
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
