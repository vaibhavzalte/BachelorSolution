import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';

export type AppLocale = 'en' | 'mr' | 'hi';
export type TranslationDict = typeof en;
export type TranslationKey = LeafPaths<TranslationDict>;

export const DEFAULT_LOCALE: AppLocale = 'en';

export const LOCALE_OPTIONS: {
  code: AppLocale;
  nativeLabel: string;
  shortLabel: string;
}[] = [
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'mr', nativeLabel: 'मराठी', shortLabel: 'मर' },
  { code: 'hi', nativeLabel: 'हिन्दी', shortLabel: 'हि' },
];

export const DICTIONARIES: Record<AppLocale, TranslationDict> = {
  en,
  mr,
  hi,
};

type LeafPaths<T, TPrefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? LeafPaths<T[K], `${TPrefix}${K}.`>
    : `${TPrefix}${K}`;
}[keyof T & string];

const getNestedValue = (objValue: unknown, strPath: string): unknown => {
  return strPath.split('.').reduce<unknown>((objCurrent, strPart) => {
    if (objCurrent && typeof objCurrent === 'object' && strPart in objCurrent) {
      return (objCurrent as Record<string, unknown>)[strPart];
    }
    return undefined;
  }, objValue);
};

export const translate = (
  strLocale: AppLocale,
  strKey: TranslationKey | string,
  objParams?: Record<string, string | number>,
): string => {
  const objDictionary = DICTIONARIES[strLocale] ?? en;
  const strValue = getNestedValue(objDictionary, strKey);
  const strFallback = getNestedValue(en, strKey);
  let strText =
    typeof strValue === 'string'
      ? strValue
      : typeof strFallback === 'string'
        ? strFallback
        : strKey;

  if (objParams) {
    Object.entries(objParams).forEach(([strParam, strReplacement]) => {
      strText = strText.replaceAll(`{${strParam}}`, String(strReplacement));
    });
  }

  return strText;
};

export const translateMasterLabel = (
  strLocale: AppLocale,
  strLabel: string,
): string => {
  const strKey = `master.${strLabel}`;
  const strTranslated = translate(strLocale, strKey);
  return strTranslated === strKey ? strLabel : strTranslated;
};
