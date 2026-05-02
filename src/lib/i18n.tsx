'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import translations
import zh from '../../messages/zh.json';
import en from '../../messages/en.json';

// Available locales
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

// Translations object
const translations: Record<Locale, any> = {
  zh,
  en
};

// Context type
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Get nested value from object
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Format string with params
function formatString(str: string, params?: Record<string, any>): string {
  if (!params) return str;
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), params[key]),
    str
  );
}

// Provider component
export function I18nProvider({
  children,
  initialLocale
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // 初始化时从 localStorage 读取语言偏好
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      setLocaleState(savedLocale as Locale);
    }
  }, []);

  // 包装 setLocale 以保存到 localStorage
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    const value = getNestedValue(translations[locale], key);
    if (value === undefined) {
      // Fallback to key
      console.warn(`Translation not found: ${key}`);
      return key;
    }
    return formatString(String(value), params);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use i18n
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper hook to just get the translation function
export function useTranslations(namespace?: string) {
  const { t } = useI18n();
  if (!namespace) return t;
  return (key: string, params?: Record<string, any>) => t(`${namespace}.${key}`, params);
}

// Helper hook to just get the locale
export function useLocale() {
  return useI18n().locale;
}
