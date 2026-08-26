import { z } from 'zod';
import { ListingCategory } from '@/types/listing.types';
import { ListingRequestPayload } from '@/types/api.types';

const coerceOptionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const numValue = Number(value);
  return Number.isNaN(numValue) ? undefined : numValue;
}, z.number().optional()) as z.ZodType<number | undefined>;

const coerceRequiredNumber = (strMessage: string) =>
  z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const numValue = Number(value);
    return Number.isNaN(numValue) ? undefined : numValue;
  }, z.number().positive(strMessage)) as z.ZodType<number>;

const coerceOptionalBoolean = z.preprocess((value) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  if (value === '' || value === null || value === undefined) return undefined;
  return Boolean(value);
}, z.boolean().optional()) as z.ZodType<boolean | undefined>;

const requiredString = (strMessage: string) => z.string().trim().min(1, strMessage);

const requiredUrl = requiredString('Google Map URL is required').refine((strValue) => {
  try {
    const objUrl = new URL(strValue);
    return objUrl.protocol === 'http:' || objUrl.protocol === 'https:';
  } catch {
    return false;
  }
}, 'Enter a valid Google Map URL');

const requiredContact = requiredString('Contact number is required').refine(
  (strValue) => strValue.replace(/\D/g, '').length >= 10,
  'Enter a valid 10-digit contact number',
);

const locationFields = {
  city: requiredString('City is required'),
  area: requiredString('Area is required'),
  address: z.string().optional(),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  ownerName: requiredString('Owner name is required'),
  ownerContact: requiredContact,
  ownerEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
};

export const roomListingSchema = z.object({
  ...locationFields,
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().optional(),
  roomType: requiredString('Room type is required'),
  availableFor: requiredString('Available for is required'),
  rent: coerceRequiredNumber('Rent is required'),
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  googleMap: requiredUrl,
});

export const messListingSchema = z.object({
  ...locationFields,
  messName: z.string().trim().min(2, 'Mess name is required'),
  description: z.string().optional(),
  foodType: requiredString('Food type is required'),
  mealType: requiredString('Meal type is required'),
  monthlyFee: coerceRequiredNumber('Monthly fee is required'),
  perMealFee: coerceOptionalNumber,
  homeDelivery: coerceOptionalBoolean,
  diningArea: coerceOptionalBoolean,
  googleMap: requiredUrl,
});

export const vacancyListingSchema = z.object({
  ...locationFields,
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().optional(),
  roomType: requiredString('Room type is required'),
  totalVacancies: coerceOptionalNumber,
  preferredTenant: requiredString('Preferred tenant is required'),
  rent: coerceRequiredNumber('Rent is required'),
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  availableFrom: z.string().optional(),
  googleMap: requiredUrl,
});

export const foodStallListingSchema = z.object({
  city: requiredString('City is required'),
  area: requiredString('Area is required'),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  stallName: z.string().trim().min(2, 'Stall name is required'),
  ownerName: requiredString('Owner name is required'),
  contactNumber: requiredContact,
  location: z.string().optional(),
  foodType: requiredString('Food type is required'),
  rating: coerceOptionalNumber,
  isOpen: coerceOptionalBoolean,
  description: z.string().optional(),
  googleMap: requiredUrl,
});

export const studyRoomListingSchema = z.object({
  city: requiredString('City is required'),
  area: requiredString('Area is required'),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  roomName: z.string().trim().min(2, 'Room name is required'),
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
  ownerName: requiredString('Owner name is required'),
  ownerContact: requiredContact,
  googleMap: requiredUrl,
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
    return {
      ...objFood,
      location: objFood.location?.trim() || objFood.area,
    };
  }

  if (strCategory === 'study') {
    const objStudy = objValues as StudyRoomListingFormValues;
    return {
      ...objStudy,
      location: objStudy.location?.trim() || objStudy.area,
    };
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
  objMasterDefaults: {
    strCity?: string;
  } = {},
): ListingFormValues => {
  const strCity = objMasterDefaults.strCity ?? '';
  const objCommon = {
    city: strCity,
    area: '',
    address: '',
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    latitude: undefined,
    longitude: undefined,
    googleMap: '',
  };

  switch (strCategory) {
    case 'mess':
      return {
        ...objCommon,
        messName: '',
        description: '',
        foodType: '',
        mealType: '',
        monthlyFee: undefined,
        perMealFee: undefined,
        homeDelivery: false,
        diningArea: true,
      } as unknown as ListingFormValues;
    case 'roommates':
    case 'vacancies':
      return {
        ...objCommon,
        title: '',
        description: '',
        roomType: '',
        totalVacancies: 1,
        preferredTenant: '',
        rent: undefined,
        deposit: undefined,
        maintenance: undefined,
        brokerage: undefined,
        amenities: '',
        availableFrom: '',
      } as unknown as ListingFormValues;
    case 'food':
      return {
        city: strCity,
        area: '',
        latitude: undefined,
        longitude: undefined,
        stallName: '',
        ownerName: '',
        contactNumber: '',
        location: '',
        foodType: '',
        rating: undefined,
        isOpen: true,
        description: '',
        googleMap: '',
      } as unknown as ListingFormValues;
    case 'study':
      return {
        city: strCity,
        area: '',
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
        ownerName: '',
        ownerContact: '',
        googleMap: '',
      } as unknown as ListingFormValues;
    case 'rooms':
    default:
      return {
        ...objCommon,
        title: '',
        description: '',
        roomType: '',
        availableFor: '',
        rent: undefined,
        deposit: undefined,
        maintenance: undefined,
        brokerage: undefined,
        amenities: '',
      } as unknown as ListingFormValues;
  }
};
