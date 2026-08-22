import { z } from 'zod';
import { ListingCategory } from '@/types/listing.types';
import { ListingRequestPayload } from '@/types/api.types';

const coerceOptionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const numValue = Number(value);
  return Number.isNaN(numValue) ? undefined : numValue;
}, z.number().optional()) as z.ZodType<number | undefined>;

const coerceOptionalBoolean = z.preprocess((value) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  if (value === '' || value === null || value === undefined) return undefined;
  return Boolean(value);
}, z.boolean().optional()) as z.ZodType<boolean | undefined>;

const commonFields = {
  city: z.string().min(1, 'City is required'),
  area: z.string().optional(),
  address: z.string().optional(),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  ownerEmail: z.string().email().optional().or(z.literal('')),
};

export const roomListingSchema = z.object({
  ...commonFields,
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  roomType: z.string().optional(),
  availableFor: z.string().optional(),
  rent: coerceOptionalNumber,
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  googleMap: z.string().optional(),
});

export const messListingSchema = z.object({
  ...commonFields,
  messName: z.string().min(2, 'Mess name is required'),
  description: z.string().optional(),
  foodType: z.string().optional(),
  mealType: z.string().optional(),
  monthlyFee: coerceOptionalNumber,
  perMealFee: coerceOptionalNumber,
  homeDelivery: coerceOptionalBoolean,
  diningArea: coerceOptionalBoolean,
});

export const vacancyListingSchema = z.object({
  ...commonFields,
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  roomType: z.string().optional(),
  totalVacancies: coerceOptionalNumber,
  preferredTenant: z.string().optional(),
  rent: coerceOptionalNumber,
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  availableFrom: z.string().optional(),
  googleMap: z.string().optional(),
});

export const foodStallListingSchema = z.object({
  city: z.string().min(1, 'City is required'),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  stallName: z.string().min(2, 'Stall name is required'),
  ownerName: z.string().optional(),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
  foodType: z.string().optional(),
  rating: coerceOptionalNumber,
  isOpen: coerceOptionalBoolean,
  description: z.string().optional(),
});

export const studyRoomListingSchema = z.object({
  city: z.string().min(1, 'City is required'),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  roomName: z.string().min(2, 'Room name is required'),
  location: z.string().optional(),
  capacity: coerceOptionalNumber,
  availableSeats: coerceOptionalNumber,
  isAvailable: coerceOptionalBoolean,
  hasWifi: coerceOptionalBoolean,
  hasChargingPoints: coerceOptionalBoolean,
  hasAC: coerceOptionalBoolean,
  rules: z.string().optional(),
  rating: coerceOptionalNumber,
  description: z.string().optional(),
  createdBy: z.string().optional(),
});

export type RoomListingFormValues = z.infer<typeof roomListingSchema>;
export type MessListingFormValues = z.infer<typeof messListingSchema>;
export type VacancyListingFormValues = z.infer<typeof vacancyListingSchema>;
export type FoodStallListingFormValues = z.infer<typeof foodStallListingSchema>;
export type StudyRoomListingFormValues = z.infer<typeof studyRoomListingSchema>;

export type ListingFormValues =
  | RoomListingFormValues
  | MessListingFormValues
  | VacancyListingFormValues
  | FoodStallListingFormValues
  | StudyRoomListingFormValues;

export const getListingSchema = (strCategory: ListingCategory) => {
  switch (strCategory) {
    case 'mess':
      return messListingSchema;
    case 'roommates':
    case 'vacancies':
      return vacancyListingSchema;
    case 'food':
      return foodStallListingSchema;
    case 'study':
      return studyRoomListingSchema;
    case 'rooms':
    default:
      return roomListingSchema;
  }
};

const parseAmenities = (strValue?: string): string[] | undefined => {
  if (!strValue?.trim()) return undefined;
  return strValue
    .split(',')
    .map((strItem) => strItem.trim())
    .filter(Boolean);
};

export const toListingRequestPayload = (
  strCategory: ListingCategory,
  objValues: ListingFormValues,
): ListingRequestPayload => {
  if (strCategory === 'mess') {
    const objMess = objValues as MessListingFormValues;
    return {
      ...objMess,
      ownerEmail: objMess.ownerEmail || undefined,
    };
  }

  if (strCategory === 'food') {
    const objFood = objValues as FoodStallListingFormValues;
    return { ...objFood };
  }

  if (strCategory === 'study') {
    const objStudy = objValues as StudyRoomListingFormValues;
    return { ...objStudy };
  }

  if (strCategory === 'roommates' || strCategory === 'vacancies') {
    const objVacancy = objValues as VacancyListingFormValues;
    return {
      ...objVacancy,
      amenities: parseAmenities(objVacancy.amenities),
      ownerEmail: objVacancy.ownerEmail || undefined,
    };
  }

  const objRoom = objValues as RoomListingFormValues;
  return {
    ...objRoom,
    amenities: parseAmenities(objRoom.amenities),
    ownerEmail: objRoom.ownerEmail || undefined,
  };
};

export const getDefaultListingValues = (
  strCategory: ListingCategory,
  strCity = 'Pune',
): ListingFormValues => {
  const objCommon = {
    city: strCity,
    area: '',
    address: '',
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    latitude: undefined,
    longitude: undefined,
  };

  switch (strCategory) {
    case 'mess':
      return {
        ...objCommon,
        messName: '',
        description: '',
        foodType: 'VEG',
        mealType: 'ALL',
        monthlyFee: undefined,
        perMealFee: undefined,
        homeDelivery: false,
        diningArea: true,
      } as ListingFormValues;
    case 'roommates':
    case 'vacancies':
      return {
        ...objCommon,
        title: '',
        description: '',
        roomType: '',
        totalVacancies: 1,
        preferredTenant: 'Any',
        rent: undefined,
        deposit: undefined,
        maintenance: undefined,
        brokerage: undefined,
        amenities: '',
        availableFrom: '',
        googleMap: '',
      } as ListingFormValues;
    case 'food':
      return {
        city: strCity,
        latitude: undefined,
        longitude: undefined,
        stallName: '',
        ownerName: '',
        contactNumber: '',
        location: '',
        foodType: 'VEG',
        rating: undefined,
        isOpen: true,
        description: '',
      } as ListingFormValues;
    case 'study':
      return {
        city: strCity,
        latitude: undefined,
        longitude: undefined,
        roomName: '',
        location: '',
        capacity: undefined,
        availableSeats: undefined,
        isAvailable: true,
        hasWifi: true,
        hasChargingPoints: true,
        hasAC: false,
        rules: '',
        rating: undefined,
        description: '',
        createdBy: 'guest',
      } as ListingFormValues;
    case 'rooms':
    default:
      return {
        ...objCommon,
        title: '',
        description: '',
        roomType: '1BHK',
        availableFor: 'ANY',
        rent: undefined,
        deposit: undefined,
        maintenance: undefined,
        brokerage: undefined,
        amenities: 'WiFi, Parking',
        googleMap: '',
      } as ListingFormValues;
  }
};
