const BASE_URL = "http://localhost:8080/uv-api/v1";
const MGMT_NAME = "bsol";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ListingType = "room" | "Mess" | "food-stall";

export interface Room {
  id?: number;
  title: string;
  description?: string;
  roomType: string;        // 1RK | 1BHK | 2BHK
  availableFor: string;    // BOYS | GIRLS | FAMILY
  furnished?: boolean;
  totalRooms?: number;
  availableRooms?: number;
  rent?: number;
  deposit?: number;
  maintenance?: number;
  wifi?: boolean;
  parking?: boolean;
  ac?: boolean;
  foodIncluded?: boolean;
  attachedBathroom?: boolean;
  address?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  status?: string;
  createdBy?: string;
}

export interface Mess {
  id?: number;
  title: string;
  description?: string;
  foodType?: string;       // VEG | NON-VEG | BOTH
  mealType?: string;       // BREAKFAST | LUNCH | DINNER | ALL
  monthlyFee?: number;
  perMealFee?: number;
  homeDelivery?: boolean;
  diningArea?: boolean;
  address?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  status?: string;
  createdBy?: string;
}

export interface FoodStall {
  id?: number;
  stallName: string;
  ownerName?: string;
  contactNumber?: string;
  location?: string;
  foodType?: string;       // Veg | Non-Veg | Both
  rating?: number;
  isOpen?: boolean;
  description?: string;
  createdBy?: string;
}

export type AnyListing = Room | Mess | FoodStall;

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getListings(type: ListingType): Promise<AnyListing[]> {
  const res = await fetch(`${BASE_URL}/${MGMT_NAME}/${type}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch listings: ${res.statusText}`);
  return res.json();
}

export async function createListing(
  type: ListingType,
  payload: AnyListing
): Promise<AnyListing> {
  const res = await fetch(`${BASE_URL}/${MGMT_NAME}/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create listing: ${errText}`);
  }
  return res.json();
}
