'use client';

import { useCallback } from 'react';
import { translate, translateMasterLabel, TranslationKey } from '@/i18n';
import { useLocaleStore } from '@/store/useLocaleStore';

export const useI18n = () => {
  const strLocale = useLocaleStore((objState) => objState.strLocale);
  const setLocale = useLocaleStore((objState) => objState.setLocale);

  const t = useCallback(
    (strKey: TranslationKey | string, objParams?: Record<string, string | number>) =>
      translate(strLocale, strKey, objParams),
    [strLocale],
  );

  const tMaster = useCallback(
    (strLabel: string) => translateMasterLabel(strLocale, strLabel),
    [strLocale],
  );

  return { strLocale, setLocale, t, tMaster };
};
