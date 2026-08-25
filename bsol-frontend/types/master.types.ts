export const MASTER_GROUPS = {
  CITY: 'CITY',
  AREA: 'AREA',
  TIME: 'TIME',
  ROOM_TYPE: 'ROOM_TYPE',
  AVAILABLE_FOR: 'AVAILABLE_FOR',
  ROOM_AMENITY: 'ROOM_AMENITY',
  PRICE_RANGE: 'PRICE_RANGE',
  CUISINE: 'CUISINE',
  FOOD_TYPE: 'FOOD_TYPE',
  MEAL_TYPE: 'MEAL_TYPE',
  PREFERRED_TENANT: 'PREFERRED_TENANT',
  STUDY_FACILITY: 'STUDY_FACILITY',
} as const;

export type MasterGroupCode = (typeof MASTER_GROUPS)[keyof typeof MASTER_GROUPS];

export interface MasterGroup {
  id?: number;
  groupCode: string;
  groupLabel: string;
  data: string[];
  isActive?: boolean;
}

export interface MasterCatalog {
  groups: MasterGroup[];
}

export interface MasterSeedResponse {
  seeded: boolean;
  skipped: boolean;
  itemCount: number;
  message: string;
}

export const EMPTY_MASTER_CATALOG: MasterCatalog = {
  groups: [],
};
