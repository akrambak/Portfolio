"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LocaleToggle() {
  const active = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      className="flex items-center rounded-[3px] border border-rule"
      aria-busy={isPending}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => select(locale)}
          aria-current={active === locale ? "true" : undefined}
          title={localeNames[locale]}
          className={`h-11 w-11 cursor-pointer font-mono text-eyebrow font-medium uppercase transition-colors duration-200 ${
            active === locale
              ? "bg-signal-wash text-signal"
              : "text-faint hover:text-ink"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
