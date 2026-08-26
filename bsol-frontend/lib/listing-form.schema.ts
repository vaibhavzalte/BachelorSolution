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

export type ListingFormMessages = {
  cityRequired: string;
  areaRequired: string;
  ownerNameRequired: string;
  contactRequired: string;
  contactInvalid: string;
  emailInvalid: string;
  mapRequired: string;
  mapInvalid: string;
  titleRequired: string;
  roomTypeRequired: string;
  availableForRequired: string;
  rentRequired: string;
  messNameRequired: string;
  foodTypeRequired: string;
  mealTypeRequired: string;
  monthlyFeeRequired: string;
  preferredTenantRequired: string;
  stallNameRequired: string;
  roomNameRequired: string;
};

export const DEFAULT_FORM_MESSAGES: ListingFormMessages = {
  cityRequired: 'City is required',
  areaRequired: 'Area is required',
  ownerNameRequired: 'Owner name is required',
  contactRequired: 'Contact number is required',
  contactInvalid: 'Enter a valid 10-digit contact number',
  emailInvalid: 'Enter a valid email',
  mapRequired: 'Google Map URL is required',
  mapInvalid: 'Enter a valid Google Map URL',
  titleRequired: 'Title is required',
  roomTypeRequired: 'Room type is required',
  availableForRequired: 'Available for is required',
  rentRequired: 'Rent is required',
  messNameRequired: 'Mess name is required',
  foodTypeRequired: 'Food type is required',
  mealTypeRequired: 'Meal type is required',
  monthlyFeeRequired: 'Monthly fee is required',
  preferredTenantRequired: 'Preferred tenant is required',
  stallNameRequired: 'Stall name is required',
  roomNameRequired: 'Room name is required',
};

const requiredString = (strMessage: string) => z.string().trim().min(1, strMessage);

const buildRequiredUrl = (objMessages: ListingFormMessages) =>
  requiredString(objMessages.mapRequired).refine((strValue) => {
    try {
      const objUrl = new URL(strValue);
      return objUrl.protocol === 'http:' || objUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }, objMessages.mapInvalid);

const buildRequiredContact = (objMessages: ListingFormMessages) =>
  requiredString(objMessages.contactRequired).refine(
    (strValue) => strValue.replace(/\D/g, '').length >= 10,
    objMessages.contactInvalid,
  );

const buildLocationFields = (objMessages: ListingFormMessages) => ({
  city: requiredString(objMessages.cityRequired),
  area: requiredString(objMessages.areaRequired),
  address: z.string().optional(),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  ownerName: requiredString(objMessages.ownerNameRequired),
  ownerContact: buildRequiredContact(objMessages),
  ownerEmail: z.string().email(objMessages.emailInvalid).optional().or(z.literal('')),
});

export const roomListingSchema = z.object({
  ...buildLocationFields(DEFAULT_FORM_MESSAGES),
  title: z.string().trim().min(3, DEFAULT_FORM_MESSAGES.titleRequired),
  description: z.string().optional(),
  roomType: requiredString(DEFAULT_FORM_MESSAGES.roomTypeRequired),
  availableFor: requiredString(DEFAULT_FORM_MESSAGES.availableForRequired),
  rent: coerceRequiredNumber(DEFAULT_FORM_MESSAGES.rentRequired),
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  googleMap: buildRequiredUrl(DEFAULT_FORM_MESSAGES),
});

export const messListingSchema = z.object({
  ...buildLocationFields(DEFAULT_FORM_MESSAGES),
  messName: z.string().trim().min(2, DEFAULT_FORM_MESSAGES.messNameRequired),
  description: z.string().optional(),
  foodType: requiredString(DEFAULT_FORM_MESSAGES.foodTypeRequired),
  mealType: requiredString(DEFAULT_FORM_MESSAGES.mealTypeRequired),
  monthlyFee: coerceRequiredNumber(DEFAULT_FORM_MESSAGES.monthlyFeeRequired),
  perMealFee: coerceOptionalNumber,
  homeDelivery: coerceOptionalBoolean,
  diningArea: coerceOptionalBoolean,
  googleMap: buildRequiredUrl(DEFAULT_FORM_MESSAGES),
});

export const vacancyListingSchema = z.object({
  ...buildLocationFields(DEFAULT_FORM_MESSAGES),
  title: z.string().trim().min(3, DEFAULT_FORM_MESSAGES.titleRequired),
  description: z.string().optional(),
  roomType: requiredString(DEFAULT_FORM_MESSAGES.roomTypeRequired),
  totalVacancies: coerceOptionalNumber,
  preferredTenant: requiredString(DEFAULT_FORM_MESSAGES.preferredTenantRequired),
  rent: coerceRequiredNumber(DEFAULT_FORM_MESSAGES.rentRequired),
  deposit: coerceOptionalNumber,
  maintenance: coerceOptionalNumber,
  brokerage: coerceOptionalNumber,
  amenities: z.string().optional(),
  availableFrom: z.string().optional(),
  googleMap: buildRequiredUrl(DEFAULT_FORM_MESSAGES),
});

export const foodStallListingSchema = z.object({
  city: requiredString(DEFAULT_FORM_MESSAGES.cityRequired),
  area: requiredString(DEFAULT_FORM_MESSAGES.areaRequired),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  stallName: z.string().trim().min(2, DEFAULT_FORM_MESSAGES.stallNameRequired),
  ownerName: requiredString(DEFAULT_FORM_MESSAGES.ownerNameRequired),
  contactNumber: buildRequiredContact(DEFAULT_FORM_MESSAGES),
  location: z.string().optional(),
  foodType: requiredString(DEFAULT_FORM_MESSAGES.foodTypeRequired),
  rating: coerceOptionalNumber,
  isOpen: coerceOptionalBoolean,
  description: z.string().optional(),
  googleMap: buildRequiredUrl(DEFAULT_FORM_MESSAGES),
});

export const studyRoomListingSchema = z.object({
  city: requiredString(DEFAULT_FORM_MESSAGES.cityRequired),
  area: requiredString(DEFAULT_FORM_MESSAGES.areaRequired),
  subType: z.string().optional(),
  primaryId: z.string().optional(),
  latitude: coerceOptionalNumber,
  longitude: coerceOptionalNumber,
  roomName: z.string().trim().min(2, DEFAULT_FORM_MESSAGES.roomNameRequired),
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
  ownerName: requiredString(DEFAULT_FORM_MESSAGES.ownerNameRequired),
  ownerContact: buildRequiredContact(DEFAULT_FORM_MESSAGES),
  googleMap: buildRequiredUrl(DEFAULT_FORM_MESSAGES),
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

export const getFormMessagesFromT = (
  fnTranslate: (strKey: string) => string,
): ListingFormMessages => ({
  cityRequired: fnTranslate('validation.cityRequired'),
  areaRequired: fnTranslate('validation.areaRequired'),
  ownerNameRequired: fnTranslate('validation.ownerNameRequired'),
  contactRequired: fnTranslate('validation.contactRequired'),
  contactInvalid: fnTranslate('validation.contactInvalid'),
  emailInvalid: fnTranslate('validation.emailInvalid'),
  mapRequired: fnTranslate('validation.mapRequired'),
  mapInvalid: fnTranslate('validation.mapInvalid'),
  titleRequired: fnTranslate('validation.titleRequired'),
  roomTypeRequired: fnTranslate('validation.roomTypeRequired'),
  availableForRequired: fnTranslate('validation.availableForRequired'),
  rentRequired: fnTranslate('validation.rentRequired'),
  messNameRequired: fnTranslate('validation.messNameRequired'),
  foodTypeRequired: fnTranslate('validation.foodTypeRequired'),
  mealTypeRequired: fnTranslate('validation.mealTypeRequired'),
  monthlyFeeRequired: fnTranslate('validation.monthlyFeeRequired'),
  preferredTenantRequired: fnTranslate('validation.preferredTenantRequired'),
  stallNameRequired: fnTranslate('validation.stallNameRequired'),
  roomNameRequired: fnTranslate('validation.roomNameRequired'),
});

export const getListingSchema = (
  strCategory: ListingCategory,
  objMessages: ListingFormMessages = DEFAULT_FORM_MESSAGES,
) => {
  const objLocation = buildLocationFields(objMessages);
  const objUrl = buildRequiredUrl(objMessages);
  const objContact = buildRequiredContact(objMessages);

  switch (strCategory) {
    case 'mess':
      return z.object({
        ...objLocation,
        messName: z.string().trim().min(2, objMessages.messNameRequired),
        description: z.string().optional(),
        foodType: requiredString(objMessages.foodTypeRequired),
        mealType: requiredString(objMessages.mealTypeRequired),
        monthlyFee: coerceRequiredNumber(objMessages.monthlyFeeRequired),
        perMealFee: coerceOptionalNumber,
        homeDelivery: coerceOptionalBoolean,
        diningArea: coerceOptionalBoolean,
        googleMap: objUrl,
      });
    case 'roommates':
    case 'vacancies':
      return z.object({
        ...objLocation,
        title: z.string().trim().min(3, objMessages.titleRequired),
        description: z.string().optional(),
        roomType: requiredString(objMessages.roomTypeRequired),
        totalVacancies: coerceOptionalNumber,
        preferredTenant: requiredString(objMessages.preferredTenantRequired),
        rent: coerceRequiredNumber(objMessages.rentRequired),
        deposit: coerceOptionalNumber,
        maintenance: coerceOptionalNumber,
        brokerage: coerceOptionalNumber,
        amenities: z.string().optional(),
        availableFrom: z.string().optional(),
        googleMap: objUrl,
      });
    case 'food':
      return z.object({
        city: requiredString(objMessages.cityRequired),
        area: requiredString(objMessages.areaRequired),
        subType: z.string().optional(),
        primaryId: z.string().optional(),
        latitude: coerceOptionalNumber,
        longitude: coerceOptionalNumber,
        stallName: z.string().trim().min(2, objMessages.stallNameRequired),
        ownerName: requiredString(objMessages.ownerNameRequired),
        contactNumber: objContact,
        location: z.string().optional(),
        foodType: requiredString(objMessages.foodTypeRequired),
        rating: coerceOptionalNumber,
        isOpen: coerceOptionalBoolean,
        description: z.string().optional(),
        googleMap: objUrl,
      });
    case 'study':
      return z.object({
        city: requiredString(objMessages.cityRequired),
        area: requiredString(objMessages.areaRequired),
        subType: z.string().optional(),
        primaryId: z.string().optional(),
        latitude: coerceOptionalNumber,
        longitude: coerceOptionalNumber,
        roomName: z.string().trim().min(2, objMessages.roomNameRequired),
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
        ownerName: requiredString(objMessages.ownerNameRequired),
        ownerContact: objContact,
        googleMap: objUrl,
      });
    case 'rooms':
    default:
      return z.object({
        ...objLocation,
        title: z.string().trim().min(3, objMessages.titleRequired),
        description: z.string().optional(),
        roomType: requiredString(objMessages.roomTypeRequired),
        availableFor: requiredString(objMessages.availableForRequired),
        rent: coerceRequiredNumber(objMessages.rentRequired),
        deposit: coerceOptionalNumber,
        maintenance: coerceOptionalNumber,
        brokerage: coerceOptionalNumber,
        amenities: z.string().optional(),
        googleMap: objUrl,
      });
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
