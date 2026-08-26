'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { LOCALE_OPTIONS, AppLocale } from '@/i18n';
import { useI18n } from '@/hooks/useI18n';

export default function LanguageSwitcher() {
  const { strLocale, setLocale, t } = useI18n();

  return (
    <div className="relative">
      <Globe className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      <select
        value={strLocale}
        aria-label={t('nav.language')}
        onChange={(objEvent) => setLocale(objEvent.target.value as AppLocale)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-[11px] font-bold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
      >
        {LOCALE_OPTIONS.map((objOption) => (
          <option key={objOption.code} value={objOption.code}>
            {objOption.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
