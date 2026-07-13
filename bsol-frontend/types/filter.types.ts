import { ListingCategory } from '@/types/listing.types';

export type FilterFieldValue = string | string[];

export type CategoryFilterValues = Record<string, FilterFieldValue>;

export type CategoryFiltersState = Partial<Record<ListingCategory, CategoryFilterValues>>;

export type FilterFieldType = 'select' | 'number' | 'checkbox-group';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterFieldConfig {
  id: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
}
