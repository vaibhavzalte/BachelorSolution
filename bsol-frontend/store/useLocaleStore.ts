import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppLocale, DEFAULT_LOCALE } from '@/i18n';

interface LocaleState {
  strLocale: AppLocale;
  setLocale: (strLocale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      strLocale: DEFAULT_LOCALE,
      setLocale: (strLocale) => set({ strLocale }),
    }),
    { name: 'bsol-locale' },
  ),
);
