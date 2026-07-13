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
  pricePeriod: string; // e.g. "month", "plate", etc.
  negotiable?: boolean;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  media?: ListingMediaItem[];  verified?: boolean;
  timestamp: string;
  details: string[]; // e.g. ["2BHK", "2nd Floor"]
  amenities: string[]; // e.g. ["Fully Furnished", "WiFi", "Parking"]
  tags: string[]; // e.g. ["Any Gender", "2 Sharing", "Available from 1 Aug"]
  timePosted: string; // e.g. "10:30 AM", "Yesterday, 8:45 PM"
  checkmarks?: boolean; // Show visual tick marks
  // Room-specific fields from backend
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