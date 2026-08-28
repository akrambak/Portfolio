import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import en from './translations/en.json';
import fr from './translations/fr.json';

export type Locale = 'en' | 'fr';

export const locales: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export interface TranslationObject {
  [key: string]: string | TranslationObject;
}

export const translations: Record<Locale, TranslationObject> = {
  en,
  fr,
};

// Get the user's locale preference from localStorage or navigator
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const savedLocale = localStorage.getItem('locale') as Locale;
  if (savedLocale && Object.keys(translations).includes(savedLocale)) {
    return savedLocale;
  }
  
  const browserLocale = navigator.language.split('-')[0] as Locale;
  if (Object.keys(translations).includes(browserLocale)) {
    return browserLocale;
  }
  
  return 'en';
}

// Custom hook for using translations in components
export function useTranslation() {
  const router = useRouter();
  
  // Get current locale from localStorage or default to 'en'
  const locale = typeof window !== 'undefined' 
    ? localStorage.getItem('locale') as Locale || 'en'
    : 'en';
  
  // Translate function
  function t(key: string): string {
    const keys = key.split('.');
    let value: TranslationObject | string = translations[locale];
    
    for (const k of keys) {
      if (value === undefined) return key;
      if (typeof value === 'string') return value;
      value = value[k];
    }
    
    return typeof value === 'string' ? value : key;
  }
  
  // Change locale function
  const changeLocale = useCallback((newLocale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Force a refresh to update all components
      router.refresh();
    }
  }, [router]);
  
  return {
    t,
    locale,
    changeLocale,
    locales,
  };
} 