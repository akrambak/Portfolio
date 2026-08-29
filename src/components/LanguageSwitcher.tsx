"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  const setLocale = (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
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
