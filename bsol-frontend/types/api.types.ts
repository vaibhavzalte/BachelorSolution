export type ListingTypeName =
  | 'Room'
  | 'Mess'
  | 'RoomVacancy'
  | 'FoodStall'
  | 'StudyRoom';

export interface CommonListingFields {
  subType?: string;
  primaryId?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

export interface ListingRequestPayload extends CommonListingFields {
  title?: string;
  description?: string;
  roomType?: string;
  availableFor?: string;
  rent?: number;
  deposit?: number;
  maintenance?: number;
  brokerage?: number;
  amenities?: string[];
  address?: string;
  area?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  googleMap?: string;
  messName?: string;
  foodType?: string;
  mealType?: string;
  monthlyFee?: number;
  perMealFee?: number;
  homeDelivery?: boolean;
  diningArea?: boolean;
  totalVacancies?: number;
  preferredTenant?: string;
  availableFrom?: string;
  stallName?: string;
  contactNumber?: string;
  location?: string;
  rating?: number;
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  roomName?: string;
  capacity?: number;
  availableSeats?: number;
  isAvailable?: boolean;
  hasWifi?: boolean;
  hasChargingPoints?: boolean;
  hasAC?: boolean;
  rules?: string;
  createdBy?: string;
}

export type RoomPayload = ListingRequestPayload;
export type MessPayload = ListingRequestPayload;
export type RoomVacancyPayload = ListingRequestPayload;
export type FoodStallPayload = ListingRequestPayload;
export type StudyRoomPayload = ListingRequestPayload;

export interface ListingApiResponse extends ListingRequestPayload {
  id: number;
  type: ListingTypeName;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  createTime?: string;
}

export type ListingQueryParams = Record<string, string | number | boolean | undefined>;
