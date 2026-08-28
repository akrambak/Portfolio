"use client";

import { useTranslation, Locale, locales } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {Object.entries(locales).map(([localeKey, localeName]) => (
        <button
          key={localeKey}
          onClick={() => changeLocale(localeKey as Locale)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === localeKey
              ? 'bg-accent-600 text-white font-bold dark:bg-accent-500'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label={`Switch to ${localeName} language`}
          title={localeName}
        >
          {localeKey.toUpperCase()}
        </button>
      ))}
    </div>
  );
} 