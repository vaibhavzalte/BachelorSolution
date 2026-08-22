import { Listing, ListingCategory } from '@/types/listing.types';
import { ListingApiResponse } from '@/types/api.types';
import { listingApi } from '@/services/listing/listing.api';
import { parseMediaUrls } from '@/lib/media.utils';
import { CategoryFiltersState } from '@/types/filter.types';
import {
  applyClientFilters,
  buildListingApiParams,
  getCategoryFilters,
} from '@/lib/filter.utils';
import {
  categoryToTypeName,
  typeNameToCategory,
} from '@/constants/listing-routes';
import {
  ListingRequestPayload,
  ListingTypeName,
} from '@/types/api.types';

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toDisplayPrice = (value: unknown): string => {
  if (typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return 'Contact';
};

const formatAmenity = (strValue: string): string => {
  const strNormalized = strValue.trim().toLowerCase();
  const objAmenityLabels: Record<string, string> = {
    wifi: 'WiFi',
    parking: 'Parking',
    semifurnished: 'Semi Furnished',
    'semi furnished': 'Semi Furnished',
    fullyfurnished: 'Fully Furnished',
    'fully furnished': 'Fully Furnished',
    furnished: 'Furnished',
    'hot water': 'Hot Water',
    ac: 'AC',
    lift: 'Lift',
    security: 'Security',
  };

  return (
    objAmenityLabels[strNormalized] ??
    strValue
      .split(/[\s_-]+/)
      .map((strPart) => strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase())
      .join(' ')
  );
};

const formatAvailableFor = (strValue: string): string => {
  const strNormalized = strValue.trim().toLowerCase();
  switch (strNormalized) {
    case 'boys':
    case 'boy':
      return 'Boys Only';
    case 'girls':
    case 'girl':
      return 'Girls Only';
    case 'family':
    case 'families':
      return 'Family';
    case 'any':
    case 'all':
      return 'Any Gender';
    default:
      return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();
  }
};

const capitalizeWords = (strValue: string): string =>
  strValue
    .split(/\s+/)
    .filter(Boolean)
    .map((strPart) => strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase())
    .join(' ');

const formatTimePosted = (value: unknown): string => {
  if (!value) return 'Recently';

  const dtdValue = new Date(String(value));
  if (Number.isNaN(dtdValue.getTime())) return String(value);

  const dtdNow = new Date();
  const intDiffMs = dtdNow.getTime() - dtdValue.getTime();
  const intDiffDays = Math.floor(intDiffMs / (1000 * 60 * 60 * 24));

  if (intDiffDays === 0) {
    return dtdValue.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  if (intDiffDays === 1) {
    return `Yesterday, ${dtdValue.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }
  if (intDiffDays < 7) {
    return `${intDiffDays} days ago`;
  }

  return dtdValue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const getListingTitle = (payload: ListingApiResponse): string => {
  return String(
    payload.title ??
      payload.messName ??
      payload.stallName ??
      payload.roomName ??
      'Untitled listing',
  );
};

export const mapApiListingToUi = (
  payload: ListingApiResponse,
  strPreferredCategory?: ListingCategory,
): Listing => {
  const strType = String(payload.type ?? '');
  const strCategory = typeNameToCategory(strType || 'Room', strPreferredCategory);
  const strTitle = getListingTitle(payload);
  const strArea = String(payload.area ?? '');
  const strCity = String(payload.city ?? 'Pune');
  const strAddress = String(payload.address ?? payload.location ?? '');
  const strRoomType = String(payload.roomType ?? '');
  const strAvailableFor = String(payload.availableFor ?? payload.preferredTenant ?? '');
  const strDescription = String(payload.description ?? '');
  const strOwnerName = String(payload.ownerName ?? 'Owner');
  const strStatus = String(payload.status ?? '');
  const strFoodType = String(payload.foodType ?? '');

  const strLocation =
    [strArea, strCity]
      .filter(Boolean)
      .map((strPart) => capitalizeWords(strPart))
      .join(', ') ||
    capitalizeWords(strAddress) ||
    'Pune';

  const priceValue =
    payload.rent ?? payload.monthlyFee ?? payload.perMealFee ?? payload.rating;

  let strPricePeriod = 'month';
  if (strCategory === 'food') strPricePeriod = 'visit';
  if (strCategory === 'mess' && payload.perMealFee && !payload.monthlyFee) {
    strPricePeriod = 'meal';
  }
  if (strCategory === 'study') strPricePeriod = 'seat';

  const arrDetails: string[] = [];
  if (strRoomType) arrDetails.push(strRoomType);
  if (payload.totalVacancies != null) {
    arrDetails.push(`${payload.totalVacancies} vacancy`);
  }
  if (payload.capacity != null) {
    arrDetails.push(`Capacity ${payload.capacity}`);
  }
  if (payload.availableSeats != null) {
    arrDetails.push(`${payload.availableSeats} seats free`);
  }
  if (strFoodType) arrDetails.push(strFoodType);
  if (payload.mealType) arrDetails.push(String(payload.mealType));
  if (strAddress && strAddress.toLowerCase() !== strCity.toLowerCase()) {
    arrDetails.push(capitalizeWords(strAddress));
  }

  const arrAmenities = normalizeStringArray(payload.amenities).map(formatAmenity);
  if (payload.homeDelivery) arrAmenities.push('Home Delivery');
  if (payload.diningArea) arrAmenities.push('Dining Area');
  if (payload.hasWifi) arrAmenities.push('WiFi');
  if (payload.hasAC) arrAmenities.push('AC');
  if (payload.hasChargingPoints) arrAmenities.push('Charging');

  const arrTags: string[] = [];
  if (strAvailableFor) arrTags.push(formatAvailableFor(strAvailableFor));
  if (strFoodType) arrTags.push(strFoodType);
  if (payload.isOpen === true) arrTags.push('Open Now');
  if (payload.isAvailable === true) arrTags.push('Available');

  const numDeposit = typeof payload.deposit === 'number' ? payload.deposit : undefined;
  const numMaintenance =
    typeof payload.maintenance === 'number' ? payload.maintenance : undefined;
  const numBrokerage =
    typeof payload.brokerage === 'number' ? payload.brokerage : undefined;

  if (numDeposit && numDeposit > 0) arrTags.push(`Deposit ${toDisplayPrice(numDeposit)}`);
  if (numMaintenance && numMaintenance > 0) {
    arrTags.push(`Maint. ${toDisplayPrice(numMaintenance)}/mo`);
  }
  if (numBrokerage && numBrokerage > 0) {
    arrTags.push(`Brokerage ${toDisplayPrice(numBrokerage)}`);
  }
  if (strStatus.toUpperCase() === 'ACTIVE') arrTags.push('Active');

  const arrImages = Array.isArray(payload.images) ? payload.images : [];
  const arrImageUrls = arrImages.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0,
  );
  const arrMedia = parseMediaUrls(arrImageUrls);
  const strImageUrl = arrMedia[0]?.url ?? '';

  const strTimePosted = formatTimePosted(
    payload.createTime ?? payload.createdAt ?? payload.updatedAt,
  );

  return {
    id: String(payload.id ?? `${strCategory}-${strTitle}`),
    title: strTitle,
    category: strCategory,
    location: strLocation,
    price: toDisplayPrice(priceValue),
    pricePeriod: strPricePeriod,
    negotiable: false,
    userName: strOwnerName,
    userAvatar: '',
    imageUrl: strImageUrl,
    media: arrMedia,
    verified: strStatus.toUpperCase() === 'ACTIVE',
    timestamp: strTimePosted,
    details: arrDetails.length > 0 ? arrDetails : ['Contact for details'],
    amenities: arrAmenities,
    tags: arrTags.length > 0 ? arrTags : ['Listing Available'],
    timePosted: strTimePosted,
    checkmarks: strStatus.toUpperCase() === 'ACTIVE',
    description: strDescription || undefined,
    roomType: strRoomType || undefined,
    availableFor: strAvailableFor || undefined,
    address: strAddress || undefined,
    area: strArea || undefined,
    city: strCity || undefined,
    deposit: numDeposit,
    maintenance: numMaintenance,
    brokerage: numBrokerage,
    ownerContact:
      payload.ownerContact != null
        ? String(payload.ownerContact)
        : payload.contactNumber != null
          ? String(payload.contactNumber)
          : undefined,
    ownerEmail: typeof payload.ownerEmail === 'string' ? payload.ownerEmail : undefined,
    typeName: (payload.type as ListingTypeName) || categoryToTypeName(strCategory),
    raw: payload,
  };
};

export const getListings = async (
  category?: string,
  query?: string,
  location?: string,
  time?: string,
  categoryFilters?: CategoryFiltersState,
): Promise<Listing[]> => {
  const strCategory = (
    category && category !== 'all' ? category : 'rooms'
  ) as ListingCategory;
  const objFilters = getCategoryFilters(categoryFilters ?? {}, strCategory);
  const strTypeName = categoryToTypeName(strCategory);
  const objParams = buildListingApiParams(
    objFilters,
    location ?? 'Pune',
    time ?? 'Any Time',
    strCategory,
  );

  if (query?.trim()) {
    objParams.keyword = query.trim();
  }

  const response = await listingApi.getListings(strTypeName, objParams);
  const arrPayload = Array.isArray(response.data) ? response.data : [];
  const arrListings = arrPayload.map((item) => mapApiListingToUi(item, strCategory));

  return applyClientFilters(arrListings, strCategory, objFilters, location ?? 'Pune');
};

export const getListingById = async (
  strCategory: ListingCategory,
  strId: string | number,
): Promise<Listing> => {
  const strTypeName = categoryToTypeName(strCategory);
  const response = await listingApi.getListingById(strTypeName, strId);
  return mapApiListingToUi(response.data, strCategory);
};

export const createListing = async (
  strCategory: ListingCategory,
  objListing: ListingRequestPayload,
  arrImages?: File[],
): Promise<Listing> => {
  const strTypeName = categoryToTypeName(strCategory);
  const response = await listingApi.createListing(strTypeName, objListing, arrImages);
  return mapApiListingToUi(response.data, strCategory);
};

export const updateListing = async (
  strCategory: ListingCategory,
  strId: string | number,
  objListing: ListingRequestPayload,
  arrImages?: File[],
): Promise<Listing> => {
  const strTypeName = categoryToTypeName(strCategory);
  const response = await listingApi.updateListing(
    strTypeName,
    strId,
    objListing,
    arrImages,
  );
  return mapApiListingToUi(response.data, strCategory);
};

export const deleteListing = async (
  strCategory: ListingCategory,
  strId: string | number,
): Promise<void> => {
  const strTypeName = categoryToTypeName(strCategory);
  await listingApi.deleteListing(strTypeName, strId);
};
