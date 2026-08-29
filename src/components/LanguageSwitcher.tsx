"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const setLocale = (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            activeLocale === locale
              ? "bg-accent-600 text-white font-bold dark:bg-accent-500"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label={`Switch to ${localeNames[locale]} language`}
          title={localeNames[locale]}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
