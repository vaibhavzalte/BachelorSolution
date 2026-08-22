import { ListingApiResponse, ListingTypeName } from '@/types/api.types';

export type ListingCategory = 'rooms' | 'roommates' | 'food' | 'mess' | 'study' | 'vacancies';

export type ListingMediaType = 'image' | 'video';

export interface ListingMediaItem {
  url: string;
  type: ListingMediaType;
}

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  location: string;
  price: string;
  pricePeriod: string;
  negotiable?: boolean;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  media?: ListingMediaItem[];
  verified?: boolean;
  timestamp: string;
  details: string[];
  amenities: string[];
  tags: string[];
  timePosted: string;
  checkmarks?: boolean;
  description?: string;
  roomType?: string;
  availableFor?: string;
  address?: string;
  area?: string;
  city?: string;
  deposit?: number;
  maintenance?: number;
  brokerage?: number;
  ownerContact?: string;
  ownerEmail?: string;
  typeName?: ListingTypeName;
  raw?: ListingApiResponse;
}

export interface CategoryCount {
  name: string;
  id: ListingCategory | 'all';
  count: number;
  iconName: string;
}

export interface LocationCount {
  name: string;
  count: number;
}

export interface Room {
  id: string;
  title: string;
  location: string;
}