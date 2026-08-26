import { FilterOption } from '@/types/filter.types';
import {
  EMPTY_MASTER_CATALOG,
  MASTER_GROUPS,
  MasterCatalog,
  MasterGroup,
} from '@/types/master.types';

const ANY_OPTION: FilterOption = { label: 'Any', value: 'Any' };
const STR_AREA_SEPARATOR = ':';

const OBJ_LABEL_OVERRIDES: Record<string, string> = {
  ANY_TIME: 'Any Time',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  NONVEG: 'Non-Veg',
  VEG: 'Pure Veg',
  EGG: 'Eggetarian',
  BUDGET: 'Under ₹50',
  MID: '₹50 – ₹150',
  PREMIUM: 'Above ₹150',
  STREET: 'Street Food',
  FAST: 'Fast Food',
  SOUTH: 'South Indian',
  NORTH: 'North Indian',
  WORKING_PROFESSIONAL: 'Working Professional',
  QUIET_ZONE: 'Quiet Zone',
  ACCESS_24X7: '24x7 Access',
  WIFI: 'WiFi',
  NAVI_MUMBAI: 'Navi Mumbai',
  VIMAN_NAGAR: 'Viman Nagar',
  PIMPLE_SAUDAGAR: 'Pimple Saudagar',
  COLLEGE_ROAD: 'College Road',
  INDIRA_NAGAR: 'Indira Nagar',
};

const RAW_VALUE_GROUPS = new Set<string>([
  MASTER_GROUPS.FOOD_TYPE,
  MASTER_GROUPS.MEAL_TYPE,
]);

const LOWERCASE_VALUE_GROUPS = new Set<string>([
  MASTER_GROUPS.PRICE_RANGE,
  MASTER_GROUPS.CUISINE,
]);

export interface MasterAreaItem {
  strCityCode: string;
  strAreaCode: string;
  strCityValue: string;
  strAreaValue: string;
}

export const formatMasterLabel = (strCode: string): string => {
  if (!strCode) {
    return '';
  }

  const strOverride = OBJ_LABEL_OVERRIDES[strCode.toUpperCase()];
  if (strOverride) {
    return strOverride;
  }

  const strWork = strCode
    .trim()
    .replace(/_/g, ' ')
    .replace(/(\d)(RK|BHK)/gi, '$1 $2');

  return strWork
    .split(/\s+/)
    .map((strPart) => {
      if (strPart.toUpperCase() === 'WIFI') return 'WiFi';
      if (['AC', 'RK', 'BHK'].includes(strPart.toUpperCase())) {
        return strPart.toUpperCase();
      }
      return strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase();
    })
    .join(' ');
};

export const formatMasterValue = (strGroupCode: string, strCode: string): string => {
  if (!strCode) {
    return '';
  }
  if (LOWERCASE_VALUE_GROUPS.has(strGroupCode)) {
    return strCode.toLowerCase();
  }
  if (RAW_VALUE_GROUPS.has(strGroupCode)) {
    return strCode;
  }
  return formatMasterLabel(strCode);
};

export const parseMasterAreaCode = (
  strRaw: string,
): { strCityCode: string; strAreaCode: string } => {
  const intSeparator = strRaw.indexOf(STR_AREA_SEPARATOR);
  if (intSeparator <= 0) {
    return { strCityCode: '', strAreaCode: strRaw };
  }

  return {
    strCityCode: strRaw.slice(0, intSeparator),
    strAreaCode: strRaw.slice(intSeparator + 1),
  };
};

export const getMasterGroup = (
  objCatalog: MasterCatalog | undefined,
  strGroupCode: string,
): MasterGroup | undefined => {
  const arrGroups = objCatalog?.groups ?? [];
  return arrGroups.find((objGroup) => objGroup.groupCode === strGroupCode);
};

export const getMasterCodes = (
  objCatalog: MasterCatalog | undefined,
  strGroupCode: string,
): string[] => {
  const arrData = getMasterGroup(objCatalog, strGroupCode)?.data;
  return Array.isArray(arrData) ? arrData : [];
};

export const getMasterAreaItems = (
  objCatalog: MasterCatalog | undefined,
): MasterAreaItem[] => {
  return getMasterCodes(objCatalog, MASTER_GROUPS.AREA).map((strRaw) => {
    const { strCityCode, strAreaCode } = parseMasterAreaCode(strRaw);
    return {
      strCityCode,
      strAreaCode,
      strCityValue: formatMasterValue(MASTER_GROUPS.CITY, strCityCode),
      strAreaValue: formatMasterValue(MASTER_GROUPS.AREA, strAreaCode),
    };
  });
};

export const getAreaOptionsForCity = (
  objCatalog: MasterCatalog | undefined,
  strCityValue: string,
): FilterOption[] => {
  const strNormalizedCity = strCityValue.trim().toLowerCase();
  const arrSeen = new Set<string>();
  const arrOptions: FilterOption[] = [];

  getMasterAreaItems(objCatalog).forEach((objItem) => {
    if (!objItem.strAreaValue) {
      return;
    }
    if (
      strNormalizedCity &&
      objItem.strCityValue.toLowerCase() !== strNormalizedCity
    ) {
      return;
    }
    if (arrSeen.has(objItem.strAreaValue)) {
      return;
    }
    arrSeen.add(objItem.strAreaValue);
    arrOptions.push({
      label: objItem.strAreaValue,
      value: objItem.strAreaValue,
    });
  });

  return arrOptions;
};

export const getMasterDefault = (
  objCatalog: MasterCatalog | undefined,
  strGroupCode: string,
): string => {
  if (strGroupCode === MASTER_GROUPS.AREA) {
    return getMasterAreaItems(objCatalog)[0]?.strAreaValue ?? '';
  }

  const arrCodes = getMasterCodes(objCatalog, strGroupCode);
  if (arrCodes.length === 0) {
    return '';
  }
  return formatMasterValue(strGroupCode, arrCodes[0]);
};

export const getMasterOptions = (
  objCatalog: MasterCatalog | undefined,
  strGroupCode: string,
  boolIncludeAny = false,
): FilterOption[] => {
  const arrOptions =
    strGroupCode === MASTER_GROUPS.AREA
      ? getAreaOptionsForCity(objCatalog, '')
      : getMasterCodes(objCatalog, strGroupCode).map((strCode) => ({
          label: formatMasterLabel(strCode),
          value: formatMasterValue(strGroupCode, strCode),
        }));

  if (!boolIncludeAny) {
    return arrOptions;
  }

  const boolHasAny = arrOptions.some((objOption) => objOption.value === ANY_OPTION.value);
  return boolHasAny ? arrOptions : [ANY_OPTION, ...arrOptions];
};

export const getLocationOptions = (
  objCatalog: MasterCatalog | undefined,
): FilterOption[] => {
  const arrCities = getMasterOptions(objCatalog, MASTER_GROUPS.CITY);
  const arrAreas = getMasterOptions(objCatalog, MASTER_GROUPS.AREA);
  return [...arrCities, ...arrAreas];
};

export const buildAreaParentCityMap = (
  objCatalog: MasterCatalog | undefined,
): Record<string, string> => {
  const objAreaToCity: Record<string, string> = {};

  getMasterAreaItems(objCatalog).forEach((objItem) => {
    if (objItem.strAreaValue && objItem.strCityValue) {
      objAreaToCity[objItem.strAreaValue] = objItem.strCityValue;
    }
  });

  return objAreaToCity;
};

export const isMasterCatalogReady = (objCatalog: MasterCatalog | undefined): boolean => {
  const arrGroups = objCatalog?.groups;
  return Array.isArray(arrGroups) && arrGroups.length > 0;
};

export const getSafeCatalog = (
  objCatalog: MasterCatalog | undefined,
): MasterCatalog => objCatalog ?? EMPTY_MASTER_CATALOG;
