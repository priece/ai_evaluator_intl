'use client';

import { createContext, useContext } from 'react';
import {
  useTranslations as useNextIntlTranslations,
  useLocale as useNextIntlLocale
} from 'next-intl';
import { locales } from '../../i18n/request';

type Locale = (typeof locales)[number];

interface I18nContextType {
  locale: Locale;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useTranslations(namespace?: string) {
  return useNextIntlTranslations(namespace);
}

export function useLocale(): Locale {
  return useNextIntlLocale() as Locale;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function getStatusLabels(t: (key: string) => string) {
  return {
    0: t('status.notStarted'),
    1: t('status.performing'),
    2: t('status.performanceEnded'),
    3: t('status.evaluating'),
    4: t('status.evaluated'),
    5: t('status.roundEnded')
  };
}
