'use client';

import React, { useEffect } from 'react';
import { useLocaleStore } from '@/store/useLocaleStore';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const strLocale = useLocaleStore((objState) => objState.strLocale);

  useEffect(() => {
    document.documentElement.lang = strLocale;
    document.documentElement.classList.toggle('locale-devanagari', strLocale !== 'en');
  }, [strLocale]);

  return <>{children}</>;
}
