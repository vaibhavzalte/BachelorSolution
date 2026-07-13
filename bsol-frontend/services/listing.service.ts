import { Listing, ListingCategory } from '@/types/listing.types';
import { listingApi } from '@/services/listing/listing.api';
import { parseMediaUrls } from '@/lib/media.utils';
import { CategoryFiltersState } from '@/types/filter.types';
import {
  applyClientFilters,
  buildRoomApiParams,
  getCategoryFilters,
} from '@/lib/filter.utils';

const normalizeCategory = (value?: string | null): ListingCategory => {
  switch (value?.toLowerCase()) {
    case 'room':
    case 'rooms':
      return 'rooms';
    case 'roommate':
    case 'roommates':
    case 'flatmate':
    case 'flatmates':
      return 'roommates';
    case 'food':
    case 'foodstall':
    case 'food-stall':
      return 'food';
    case 'mess':
    case 'meal':
    case 'meals':
      return 'mess';
    case 'study':
    case 'studyroom':
    case 'study-room':
    case 'vacancy':
    case 'vacancies':
      return 'study';
    default:
      return 'rooms';
  }
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const extractPayloadArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload as Record<string, unknown>;
  const keys = ['content', 'data', 'listings', 'items', 'result', 'records'];

  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) {
      return value as Record<string, unknown>[];
    }
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

  return objAmenityLabels[strNormalized] ?? strValue
    .split(/[\s_-]+/)
    .map((strPart) => strPart.charAt(0).toUpperCase() + strPart.slice(1).toLowerCase())
    .join(' ');
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
    return dtdValue.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (intDiffDays === 1) {
    return `Yesterday, ${dtdValue.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  if (intDiffDays < 7) {
    return `${intDiffDays} days ago`;
  }

  return dtdValue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const isRoomPayload = (payload: Record<string, unknown>): boolean => {
  const strType = String(payload.type ?? payload.category ?? '').toLowerCase();
  return strType === 'room' || strType === 'rooms' || Boolean(payload.roomType ?? payload.rent);
};

const buildRoomListingFromPayload = (payload: Record<string, unknown>): Listing => {
  const strTitle = String(payload.title ?? 'Untitled Room');
  const strArea = String(payload.area ?? '');
  const strCity = String(payload.city ?? 'Pune');
  const strAddress = String(payload.address ?? '');
  const strRoomType = String(payload.roomType ?? '');
  const strAvailableFor = String(payload.availableFor ?? '');
  const strDescription = String(payload.description ?? '');
  const strOwnerName = String(payload.ownerName ?? payload.userName ?? 'Owner');
  const strStatus = String(payload.status ?? '');

  const strLocation = [strArea, strCity]
    .filter(Boolean)
    .map((strPart) => capitalizeWords(strPart))
    .join(', ') || capitalizeWords(strAddress) || 'Pune';

  const arrDetails: string[] = [];
  if (strRoomType) arrDetails.push(strRoomType);
  if (strAddress && strAddress.toLowerCase() !== strCity.toLowerCase()) {
    arrDetails.push(capitalizeWords(strAddress));
  }

  const arrAmenities = normalizeStringArray(payload.amenities).map(formatAmenity);

  const arrTags: string[] = [];
  if (strAvailableFor) arrTags.push(formatAvailableFor(strAvailableFor));
  if (strRoomType && !arrDetails.includes(strRoomType)) arrTags.push(strRoomType);

  const numDeposit = typeof payload.deposit === 'number' ? payload.deposit : undefined;
  const numMaintenance = typeof payload.maintenance === 'number' ? payload.maintenance : undefined;
  const numBrokerage = typeof payload.brokerage === 'number' ? payload.brokerage : undefined;

  if (numDeposit && numDeposit > 0) arrTags.push(`Deposit ${toDisplayPrice(numDeposit)}`);
  if (numMaintenance && numMaintenance > 0) arrTags.push(`Maint. ${toDisplayPrice(numMaintenance)}/mo`);
  if (numBrokerage && numBrokerage > 0) arrTags.push(`Brokerage ${toDisplayPrice(numBrokerage)}`);
  if (strStatus === 'Active') arrTags.push('Active');

  const arrImages = Array.isArray(payload.images) ? payload.images : [];
  const arrImageUrls = arrImages.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0,
  );
  const arrMedia = parseMediaUrls(arrImageUrls);
  const strImageUrl = arrMedia[0]?.url ?? '';

  const strTimePosted = formatTimePosted(
    payload.createTime ?? payload.createdAt ?? payload.timePosted ?? payload.timestamp,
  );

  return {
    id: String(payload.id ?? `room-${strTitle}`),
    title: strTitle,
    category: 'rooms',
    location: strLocation,
    price: toDisplayPrice(payload.rent ?? payload.price ?? payload.monthlyRent),
    pricePeriod: 'month',
    negotiable: Boolean(payload.negotiable ?? payload.isNegotiable),
    userName: strOwnerName,
    userAvatar: '',
    imageUrl: strImageUrl,
    media: arrMedia,
    verified: strStatus === 'Active',
    timestamp: strTimePosted,
    details: arrDetails.length > 0 ? arrDetails : ['Contact for details'],
    amenities: arrAmenities,
    tags: arrTags.length > 0 ? arrTags : ['Room Available'],
    timePosted: strTimePosted,
    checkmarks: strStatus === 'Active',
    description: strDescription || undefined,
    roomType: strRoomType || undefined,
    availableFor: strAvailableFor || undefined,
    address: strAddress || undefined,
    area: strArea || undefined,
    city: strCity || undefined,
    deposit: numDeposit,
    maintenance: numMaintenance,
    brokerage: numBrokerage,
    ownerContact: payload.ownerContact != null ? String(payload.ownerContact) : undefined,
    ownerEmail: typeof payload.ownerEmail === 'string' ? payload.ownerEmail : undefined,
  };
};

const buildListingFromPayload = (payload: Record<string, unknown>): Listing => {
  if (isRoomPayload(payload)) {
    return buildRoomListingFromPayload(payload);
  }

  const title = String(payload.title ?? payload.name ?? payload.description ?? 'Untitled listing');
  const category = normalizeCategory(String(payload.category ?? payload.type ?? payload.listingType ?? 'rooms'));
  const city = String(payload.city ?? payload.location ?? payload.area ?? 'Pune');
  const address = String(payload.address ?? '');
  const location = [city, address].filter(Boolean).join(', ');
  const priceValue = payload.price ?? payload.rent ?? payload.monthlyRent ?? payload.amount ?? payload.pricePerMonth;
  const pricePeriod = String(payload.pricePeriod ?? payload.period ?? payload.rentType ?? payload.priceType ?? 'month');
  const details = normalizeStringArray(payload.details ?? payload.specs ?? payload.highlights);
  const amenities = normalizeStringArray(payload.amenities ?? payload.features ?? payload.facilities);
  const tags = normalizeStringArray(payload.tags ?? payload.badges ?? payload.labels);
  const userName = String(payload.userName ?? payload.ownerName ?? payload.postedBy ?? payload.contactName ?? 'Owner');
  const timePosted = String(payload.timePosted ?? payload.createdAt ?? payload.timestamp ?? payload.postedAt ?? 'Just now');

  const arrImages = Array.isArray(payload.images)
    ? payload.images.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const imageValue = payload.imageUrl ?? payload.image ?? payload.thumbnail ?? payload.avatar;
  const strSingleImage = typeof imageValue === 'string' && imageValue.trim() ? imageValue : '';
  const arrImageUrls = arrImages.length > 0 ? arrImages : strSingleImage ? [strSingleImage] : [];
  const arrMedia = parseMediaUrls(arrImageUrls);
  const imageUrl = arrMedia[0]?.url ?? '';

  const roomType = typeof payload.roomType === 'string' && payload.roomType.trim() ? payload.roomType : '';
  const availableFor = typeof payload.availableFor === 'string' && payload.availableFor.trim() ? payload.availableFor : '';
  const status = typeof payload.status === 'string' && payload.status.trim() ? payload.status : '';

  const finalDetails = details.length > 0
    ? details
    : [roomType, availableFor].filter(Boolean);
  const finalAmenities = amenities.length > 0
    ? amenities
    : [status].filter(Boolean);
  const finalTags = tags.length > 0
    ? tags
    : [roomType, availableFor, status].filter(Boolean);

  return {
    id: String(payload.id ?? `${category}-${title}`),
    title,
    category,
    location: location || 'Pune',
    price: toDisplayPrice(priceValue),
    pricePeriod,
    negotiable: Boolean(payload.negotiable ?? payload.isNegotiable),
    userName,
    userAvatar: typeof payload.userAvatar === 'string' && payload.userAvatar.trim()
      ? payload.userAvatar
      : '/images/avatar_default.svg',
    imageUrl,
    media: arrMedia.length > 0 ? arrMedia : undefined,
    verified: Boolean(payload.verified ?? payload.isVerified ?? status === 'Active'),
    timestamp: timePosted,
    details: finalDetails.length > 0 ? finalDetails : ['Available now'],
    amenities: finalAmenities.length > 0 ? finalAmenities : ['Contact owner'],
    tags: finalTags.length > 0 ? finalTags : ['Verified listing'],
    timePosted,
    checkmarks: Boolean(payload.checkmarks ?? payload.isVerified ?? status === 'Active'),
  };
};

export const getListings = async (
  category?: string,
  query?: string,
  location?: string,
  time?: string,
  categoryFilters?: CategoryFiltersState,
): Promise<Listing[]> => {
  const strCategory = (category && category !== 'all' ? category : 'rooms') as ListingCategory;
  const objFilters = getCategoryFilters(categoryFilters ?? {}, strCategory);

  try {
    const normalizedCategory: ListingCategory | 'all' = category && category !== 'all'
      ? (category as ListingCategory)
      : 'all';
    const response = await listingApi.getListings(normalizedCategory, query ?? '', location ?? 'Pune', time ?? 'Any Time');
    const payload = extractPayloadArray(response.data);

    if (payload.length > 0) {
      const arrListings = payload.map((item) => buildListingFromPayload(item));
      return applyClientFilters(arrListings, strCategory, objFilters, location ?? 'Pune');
    }
  } catch (error) {
    console.warn('[listing-service] /listings request failed, trying room endpoint.', error);
  }

  if (strCategory === 'rooms') {
    try {
      const objRoomParams = buildRoomApiParams(objFilters, location ?? 'Pune', time ?? 'Any Time');
      const roomResponse = await listingApi.getRooms(objRoomParams);
      const payload = extractPayloadArray(roomResponse.data);

      if (payload.length > 0) {
        const arrListings = payload.map((item) => buildListingFromPayload(item));
        return applyClientFilters(arrListings, strCategory, objFilters, location ?? 'Pune');
      }
    } catch (error) {
      console.warn('[listing-service] Backend room request failed.', error);
    }
  }

  return [];
};
