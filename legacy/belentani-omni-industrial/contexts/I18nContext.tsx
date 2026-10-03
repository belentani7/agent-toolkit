import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  detectLocale,
  LOCALE_LABELS,
  LOCALE_NAMES,
  messages,
  SUPPORTED_LOCALES,
  type Locale,
  type TranslationKey,
} from '../services/i18n';

interface I18nContextValue {
  locale: Locale;
  locales: readonly Locale[];
  localeLabels: Record<Locale, string>;
  localeNames: Record<Locale, string>;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') window.localStorage.setItem('belentani_locale', nextLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    locales: SUPPORTED_LOCALES,
    localeLabels: LOCALE_LABELS,
    localeNames: LOCALE_NAMES,
    setLocale,
    t: (key) => messages[locale][key] ?? messages.es[key],
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
