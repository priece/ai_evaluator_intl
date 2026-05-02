'use client';

import { useLocale, useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { setLocale } = useI18n();
  const locale = useLocale();

  const handleSwitch = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleSwitch('zh')}
        className={`px-2 py-1 text-xs rounded transition ${
          locale === 'zh'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2 py-1 text-xs rounded transition ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        EN
      </button>
    </div>
  );
}
