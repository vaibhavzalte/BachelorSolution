import { ListingCategory } from '@/types/listing.types';
import { FilterFieldConfig } from '@/types/filter.types';

const ANY_OPTION = { label: 'Any', value: 'Any' };

const arrRoomTypeOptions = [
  ANY_OPTION,
  { label: '1 RK', value: '1RK' },
  { label: '1 BHK', value: '1 BHK' },
  { label: '2 BHK', value: '2 BHK' },
  { label: '3 BHK', value: '3 BHK' },
];

const arrAvailableForOptions = [
  ANY_OPTION,
  { label: 'Boys', value: 'Boys' },
  { label: 'Girls', value: 'Girls' },
  { label: 'Family', value: 'Family' },
];

const arrRoomAmenityOptions = [
  { label: 'WiFi', value: 'WiFi' },
  { label: 'Parking', value: 'Parking' },
  { label: 'Fully Furnished', value: 'Fully Furnished' },
  { label: 'Semi Furnished', value: 'Semi Furnished' },
  { label: 'AC', value: 'AC' },
  { label: 'Hot Water', value: 'Hot Water' },
  { label: 'Lift', value: 'Lift' },
  { label: 'Security', value: 'Security' },
];

export const CATEGORY_FILTER_CONFIGS: Record<ListingCategory, FilterFieldConfig[]> = {
  rooms: [
    { id: 'roomType', label: 'Room Type', type: 'select', options: arrRoomTypeOptions },
    { id: 'availableFor', label: 'Available For', type: 'select', options: arrAvailableForOptions },
    { id: 'minRent', label: 'Min Rent (₹)', type: 'number', placeholder: '5000' },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '30000' },
    { id: 'amenities', label: 'Amenities', type: 'checkbox-group', options: arrRoomAmenityOptions },
  ],
  roommates: [
    { id: 'availableFor', label: 'Preferred Gender', type: 'select', options: arrAvailableForOptions },
    { id: 'roomType', label: 'Flat Type', type: 'select', options: arrRoomTypeOptions },
    { id: 'maxRent', label: 'Max Budget (₹)', type: 'number', placeholder: '15000' },
  ],
  food: [
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'select',
      options: [
        ANY_OPTION,
        { label: 'Under ₹50', value: 'budget' },
        { label: '₹50 – ₹150', value: 'mid' },
        { label: 'Above ₹150', value: 'premium' },
      ],
    },
    {
      id: 'cuisine',
      label: 'Cuisine',
      type: 'select',
      options: [
        ANY_OPTION,
        { label: 'Street Food', value: 'street' },
        { label: 'Fast Food', value: 'fast' },
        { label: 'South Indian', value: 'south' },
        { label: 'North Indian', value: 'north' },
      ],
    },
  ],
  mess: [
    {
      id: 'foodType',
      label: 'Food Type',
      type: 'select',
      options: [
        ANY_OPTION,
        { label: 'Pure Veg', value: 'veg' },
        { label: 'Non-Veg', value: 'nonveg' },
        { label: 'Eggetarian', value: 'egg' },
      ],
    },
    { id: 'maxRent', label: 'Max Monthly (₹)', type: 'number', placeholder: '5000' },
  ],
  study: [
    {
      id: 'amenities',
      label: 'Facilities',
      type: 'checkbox-group',
      options: [
        { label: 'WiFi', value: 'WiFi' },
        { label: 'AC', value: 'AC' },
        { label: 'Quiet Zone', value: 'Quiet Zone' },
        { label: '24x7 Access', value: '24x7 Access' },
      ],
    },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '5000' },
  ],
  vacancies: [
    { id: 'roomType', label: 'Room Type', type: 'select', options: arrRoomTypeOptions },
    {
      id: 'preferredTenant',
      label: 'Preferred Tenant',
      type: 'select',
      options: [
        ANY_OPTION,
        { label: 'Students', value: 'Students' },
        { label: 'Working Professional', value: 'Working Professional' },
        { label: 'Boys', value: 'Boys' },
        { label: 'Girls', value: 'Girls' },
      ],
    },
    { id: 'maxRent', label: 'Max Rent (₹)', type: 'number', placeholder: '20000' },
  ],
};

export const getDefaultCategoryFilters = (strCategory: ListingCategory) => {
  const arrConfig = CATEGORY_FILTER_CONFIGS[strCategory];
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
