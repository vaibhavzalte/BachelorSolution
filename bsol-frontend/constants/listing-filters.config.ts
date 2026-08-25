import { ListingCategory } from '@/types/listing.types';
import { FilterFieldConfig } from '@/types/filter.types';
import { MasterCatalog, MASTER_GROUPS } from '@/types/master.types';
import { getMasterOptions } from '@/lib/master.utils';

export const CATEGORY_FILTER_FIELDS: Record<ListingCategory, FilterFieldConfig[]> = {
  rooms: [
    {
      id: 'roomType',
      label: 'Room Type',
      type: 'select',
      masterGroup: MASTER_GROUPS.ROOM_TYPE,
      includeAny: true,
    },
    {
      id: 'availableFor',
      label: 'Available For',
      type: 'select',
      masterGroup: MASTER_GROUPS.AVAILABLE_FOR,
      includeAny: true,
    },
    { id: 'minRent', label: 'Min Rent (₹)', type: 'number', placeholder: '5000' },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '30000' },
    {
      id: 'amenities',
      label: 'Amenities',
      type: 'checkbox-group',
      masterGroup: MASTER_GROUPS.ROOM_AMENITY,
    },
  ],
  roommates: [
    {
      id: 'availableFor',
      label: 'Preferred Gender',
      type: 'select',
      masterGroup: MASTER_GROUPS.AVAILABLE_FOR,
      includeAny: true,
    },
    {
      id: 'roomType',
      label: 'Flat Type',
      type: 'select',
      masterGroup: MASTER_GROUPS.ROOM_TYPE,
      includeAny: true,
    },
    { id: 'maxRent', label: 'Max Budget (₹)', type: 'number', placeholder: '15000' },
  ],
  food: [
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'select',
      masterGroup: MASTER_GROUPS.PRICE_RANGE,
      includeAny: true,
    },
    {
      id: 'cuisine',
      label: 'Cuisine',
      type: 'select',
      masterGroup: MASTER_GROUPS.CUISINE,
      includeAny: true,
    },
  ],
  mess: [
    {
      id: 'foodType',
      label: 'Food Type',
      type: 'select',
      masterGroup: MASTER_GROUPS.FOOD_TYPE,
      includeAny: true,
    },
    { id: 'maxRent', label: 'Max Monthly (₹)', type: 'number', placeholder: '5000' },
  ],
  study: [
    {
      id: 'amenities',
      label: 'Facilities',
      type: 'checkbox-group',
      masterGroup: MASTER_GROUPS.STUDY_FACILITY,
    },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '5000' },
  ],
  vacancies: [
    {
      id: 'roomType',
      label: 'Room Type',
      type: 'select',
      masterGroup: MASTER_GROUPS.ROOM_TYPE,
      includeAny: true,
    },
    {
      id: 'preferredTenant',
      label: 'Preferred Tenant',
      type: 'select',
      masterGroup: MASTER_GROUPS.PREFERRED_TENANT,
      includeAny: true,
    },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '20000' },
  ],
};

export const buildCategoryFilterConfigs = (
  objCatalog: MasterCatalog | undefined,
): Record<ListingCategory, FilterFieldConfig[]> => {
  const objResolved = {} as Record<ListingCategory, FilterFieldConfig[]>;

  (Object.keys(CATEGORY_FILTER_FIELDS) as ListingCategory[]).forEach((strCategory) => {
    objResolved[strCategory] = CATEGORY_FILTER_FIELDS[strCategory].map((objField) => {
      if (!objField.masterGroup) {
        return objField;
      }

      return {
        ...objField,
        options: getMasterOptions(
          objCatalog,
          objField.masterGroup,
          objField.type === 'select' && objField.includeAny !== false,
        ),
      };
    });
  });

  return objResolved;
};

export const getDefaultCategoryFilters = (
  strCategory: ListingCategory,
  arrConfig: FilterFieldConfig[] = CATEGORY_FILTER_FIELDS[strCategory],
) => {
  const objDefaults: Record<string, string | string[]> = {};

  arrConfig.forEach((objField) => {
    if (objField.type === 'checkbox-group') {
      objDefaults[objField.id] = [];
    } else if (objField.type === 'select') {
      objDefaults[objField.id] = 'Any';
    } else {
      objDefaults[objField.id] = '';
    }
  });

  return objDefaults;
};

/** @deprecated Use buildCategoryFilterConfigs(catalog) so options come from master data */
export const CATEGORY_FILTER_CONFIGS = CATEGORY_FILTER_FIELDS;
