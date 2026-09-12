import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from '../assets/locales/en.json';
import trMessages from '../assets/locales/tr.json';
import { LOCALE_STORAGE_KEY, LEGACY_LOCALE_STORAGE_KEY } from '../utils/constants.js';

/**
 * @file LocaleProvider.jsx
 * @description Internationalization context provider supporting English ('en') and Turkish ('tr').
 * Persists selected locale in localStorage and provides a lightweight translation helper `t(id)`.
 */

const LocaleContext = createContext(null);

const messages = {
  en: enMessages,
  tr: trMessages,
};

/**
 * Custom hook to access active locale, language switcher, and translation helper.
 */
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export const AVAILABLE_LOCALES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

/**
 * LocaleProvider wrapping the react-intl IntlProvider.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function LocaleProvider({ children }) {
  // State at the top of the component
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved =
        localStorage.getItem(LOCALE_STORAGE_KEY) || localStorage.getItem(LEGACY_LOCALE_STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'tr')) return saved;
    } catch {}
    const browserLang = navigator.language?.toLowerCase() || 'en';
    return browserLang.startsWith('tr') ? 'tr' : 'en';
  });

  const setLocale = (newLocale) => {
    if (messages[newLocale]) {
      setLocaleState(newLocale);
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      } catch {}
    }
  };

  const activeMessages = useMemo(() => messages[locale] || messages.en, [locale]);

  /**
   * Quick translation lookup helper.
   * @param {string} id - Message key
   * @param {Record<string, any>} [values] - Interpolation values
   * @returns {string} Translated string
   */
  const t = useCallback(
    (id, values = {}) => {
      let msg = activeMessages[id] || messages.en[id] || id;
      if (values) {
        Object.keys(values).forEach((k) => {
          msg = msg.replace(new RegExp(`{${k}}`, 'g'), values[k]);
        });
      }
      return msg;
    },
    [activeMessages]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      availableLocales: AVAILABLE_LOCALES,
    }),
    [locale, t]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={activeMessages} defaultLocale="en">
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
