import { ListingCategory, Listing } from '@/types/listing.types';
import { CategoryFilterValues, CategoryFiltersState, FilterFieldConfig } from '@/types/filter.types';
import { getDefaultCategoryFilters } from '@/constants/listing-filters.config';

const ANY_VALUE = 'Any';

export const mapTimeToFreshness = (strTime: string): string | undefined => {
  switch (strTime) {
    case 'Today':
      return '24h';
    case 'This Week':
      return '1w';
    case 'This Month':
      return '4d';
    default:
      return undefined;
  }
};

export const getCategoryFilters = (
  objCategoryFilters: CategoryFiltersState,
  strCategory: ListingCategory,
): CategoryFilterValues => {
  return objCategoryFilters[strCategory] ?? getDefaultCategoryFilters(strCategory);
};

export const countActiveFilters = (
  objFilters: CategoryFilterValues,
  arrConfig: FilterFieldConfig[],
): number => {
  let intCount = 0;

  arrConfig.forEach((objField) => {
    const value = objFilters[objField.id];

    if (objField.type === 'checkbox-group') {
      if (Array.isArray(value) && value.length > 0) intCount++;
      return;
    }

    if (typeof value === 'string' && value.trim() && value !== ANY_VALUE) {
      intCount++;
    }
  });

  return intCount;
};

const parseRentValue = (strPrice: string): number => {
  const strDigits = strPrice.replace(/[^\d]/g, '');
  return parseInt(strDigits, 10) || 0;
};

const matchesAmenities = (arrListingAmenities: string[], arrSelected: string[]): boolean => {
  if (arrSelected.length === 0) return true;

  const arrNormalized = arrListingAmenities.map((strItem) => strItem.toLowerCase());
  return arrSelected.every((strSelected) =>
    arrNormalized.some((strAmenity) => strAmenity.includes(strSelected.toLowerCase())),
  );
};

const matchesRoomType = (strListingRoomType: string | undefined, strFilter: string): boolean => {
  if (!strFilter || strFilter === ANY_VALUE) return true;
  if (!strListingRoomType) return false;

  const strNormalizedListing = strListingRoomType.replace(/\s+/g, '').toLowerCase();
  const strNormalizedFilter = strFilter.replace(/\s+/g, '').toLowerCase();
  return strNormalizedListing.includes(strNormalizedFilter);
};

const matchesAvailableFor = (strListingValue: string | undefined, strFilter: string): boolean => {
  if (!strFilter || strFilter === ANY_VALUE) return true;
  if (!strListingValue) return false;
  return strListingValue.toLowerCase().includes(strFilter.toLowerCase());
};

const matchesLocation = (strListingLocation: string, strSelectedLocation: string): boolean => {
  if (!strSelectedLocation || strSelectedLocation === 'Pune') return true;
  return strListingLocation.toLowerCase().includes(strSelectedLocation.toLowerCase());
};

const formatCityForApi = (strCity: string): string => {
  const strTrimmed = strCity.trim();
  if (!strTrimmed) return 'Pune';

  return strTrimmed
    .split(/\s+/)
    .map((strPart) => strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase())
    .join(' ');
};

export const buildRoomApiParams = (
  objFilters: CategoryFilterValues,
  strLocation: string,
  strTime: string,
): Record<string, string | undefined> => {
  const objParams: Record<string, string | undefined> = {};
  const arrPuneAreas = ['Wakad', 'Hinjawadi', 'Baner', 'Aundh', 'FC Road'];

  if (strLocation && !arrPuneAreas.includes(strLocation)) {
    objParams.city = formatCityForApi(strLocation);
  } else {
    objParams.city = 'Pune';
  }

  const strRoomType = String(objFilters.roomType ?? '');
  if (strRoomType && strRoomType !== ANY_VALUE) {
    objParams.roomType = strRoomType;
  }

  const strAvailableFor = String(objFilters.availableFor ?? '');
  if (strAvailableFor && strAvailableFor !== ANY_VALUE) {
    objParams.availableFor = strAvailableFor;
  }

  const strFreshness = mapTimeToFreshness(strTime);
  if (strFreshness) {
    objParams.freshness = strFreshness;
  }

  return objParams;
};

const matchesPriceRange = (
  strPrice: string,
  strMinRent: string,
  strMaxRent: string,
): boolean => {
  const intRent = parseRentValue(strPrice);
  const intMin = strMinRent ? parseInt(strMinRent, 10) : 0;
  const intMax = strMaxRent ? parseInt(strMaxRent, 10) : 0;

  if (intMin > 0 && intRent < intMin) return false;
  if (intMax > 0 && intRent > intMax) return false;
  return true;
};

export const applyClientFilters = (
  arrListings: Listing[],
  strCategory: ListingCategory,
  objFilters: CategoryFilterValues,
  strLocation: string,
): Listing[] => {
  return arrListings.filter((objListing) => {
    if (!matchesLocation(objListing.location, strLocation)) return false;

    if (strCategory === 'rooms') {
      const strMinRent = String(objFilters.minRent ?? '');
      const strMaxRent = String(objFilters.maxRent ?? '');
      if (!matchesPriceRange(objListing.price, strMinRent, strMaxRent)) return false;

      if (!matchesRoomType(objListing.roomType, String(objFilters.roomType ?? ''))) return false;
      if (!matchesAvailableFor(objListing.availableFor, String(objFilters.availableFor ?? ''))) return false;

      const arrAmenities = Array.isArray(objFilters.amenities) ? objFilters.amenities : [];
      if (!matchesAmenities(objListing.amenities, arrAmenities)) return false;
    }

    if (strCategory === 'roommates') {
      const strMaxRent = String(objFilters.maxRent ?? '');
      if (strMaxRent && !matchesPriceRange(objListing.price, '', strMaxRent)) return false;
      if (!matchesAvailableFor(objListing.availableFor, String(objFilters.availableFor ?? ''))) return false;
      if (!matchesRoomType(objListing.roomType, String(objFilters.roomType ?? ''))) return false;
    }

    if (strCategory === 'mess' || strCategory === 'study' || strCategory === 'vacancies') {
      const strMaxRent = String(objFilters.maxRent ?? '');
      if (strMaxRent && !matchesPriceRange(objListing.price, '', strMaxRent)) return false;

      const arrAmenities = Array.isArray(objFilters.amenities) ? objFilters.amenities : [];
      if (arrAmenities.length > 0 && !matchesAmenities(objListing.amenities, arrAmenities)) return false;
    }

    if (strCategory === 'food') {
      const strPriceRange = String(objFilters.priceRange ?? '');
      const intPrice = parseRentValue(objListing.price);

      if (strPriceRange === 'budget' && intPrice > 50) return false;
      if (strPriceRange === 'mid' && (intPrice < 50 || intPrice > 150)) return false;
      if (strPriceRange === 'premium' && intPrice <= 150) return false;

      const strCuisine = String(objFilters.cuisine ?? '');
      if (strCuisine && strCuisine !== ANY_VALUE) {
        const strHaystack = `${objListing.title} ${objListing.details.join(' ')} ${objListing.tags.join(' ')}`.toLowerCase();
        if (!strHaystack.includes(strCuisine)) return false;
      }
    }

    if (strCategory === 'mess') {
      const strFoodType = String(objFilters.foodType ?? '');
      if (strFoodType && strFoodType !== ANY_VALUE) {
        const strHaystack = `${objListing.title} ${objListing.tags.join(' ')} ${objListing.amenities.join(' ')}`.toLowerCase();
        if (strFoodType === 'veg' && !strHaystack.includes('veg')) return false;
        if (strFoodType === 'nonveg' && strHaystack.includes('veg')) return false;
      }
    }

    return true;
  });
};
