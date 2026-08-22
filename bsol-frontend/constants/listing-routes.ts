import { ListingCategory } from '@/types/listing.types';
import { ListingTypeName } from '@/types/api.types';

export type ListingRouteSlug =
  | 'room'
  | 'roommates'
  | 'vacancies'
  | 'food-stalls'
  | 'mess'
  | 'study-rooms';

export interface ListingRouteConfig {
  slug: ListingRouteSlug;
  category: ListingCategory;
  typeName: ListingTypeName;
  label: string;
  path: `/${ListingRouteSlug}`;
}

export const LISTING_ROUTES: ListingRouteConfig[] = [
  { slug: 'room', category: 'rooms', typeName: 'Room', label: 'Rooms', path: '/room' },
  {
    slug: 'roommates',
    category: 'roommates',
    typeName: 'RoomVacancy',
    label: 'Roommates',
    path: '/roommates',
  },
  {
    slug: 'vacancies',
    category: 'vacancies',
    typeName: 'RoomVacancy',
    label: 'Vacancies',
    path: '/vacancies',
  },
  {
    slug: 'food-stalls',
    category: 'food',
    typeName: 'FoodStall',
    label: 'Food Stalls',
    path: '/food-stalls',
  },
  { slug: 'mess', category: 'mess', typeName: 'Mess', label: 'Mess', path: '/mess' },
  {
    slug: 'study-rooms',
    category: 'study',
    typeName: 'StudyRoom',
    label: 'Study Rooms',
    path: '/study-rooms',
  },
];

export const DEFAULT_LISTING_ROUTE = LISTING_ROUTES[0];

export const getRouteBySlug = (strSlug: string): ListingRouteConfig | undefined =>
  LISTING_ROUTES.find((objRoute) => objRoute.slug === strSlug);

export const getRouteByCategory = (
  strCategory: ListingCategory,
): ListingRouteConfig =>
  LISTING_ROUTES.find((objRoute) => objRoute.category === strCategory) ??
  DEFAULT_LISTING_ROUTE;

export const getRouteByTypeName = (
  strTypeName: string,
): ListingRouteConfig =>
  LISTING_ROUTES.find((objRoute) => objRoute.typeName === strTypeName) ??
  DEFAULT_LISTING_ROUTE;

export const isValidListingSlug = (strSlug: string): strSlug is ListingRouteSlug =>
  LISTING_ROUTES.some((objRoute) => objRoute.slug === strSlug);

export const categoryToTypeName = (strCategory: ListingCategory): ListingTypeName =>
  getRouteByCategory(strCategory).typeName;

export const typeNameToCategory = (
  strTypeName: string,
  strPreferredCategory?: ListingCategory,
): ListingCategory => {
  if (strPreferredCategory) {
    const objPreferred = getRouteByCategory(strPreferredCategory);
    if (objPreferred.typeName === strTypeName) {
      return strPreferredCategory;
    }
  }

  const strNormalized = strTypeName.toLowerCase();
  if (strNormalized === 'roomvacancy' || strNormalized === 'room_vacancy') {
    return strPreferredCategory === 'roommates' ? 'roommates' : 'vacancies';
  }

  return getRouteByTypeName(strTypeName).category;
};

export const buildListingDetailPath = (
  strCategory: ListingCategory,
  strId: string | number,
): string => `${getRouteByCategory(strCategory).path}/${strId}`;

export const buildListingCreatePath = (strCategory: ListingCategory): string =>
  `${getRouteByCategory(strCategory).path}/new`;

export const buildListingEditPath = (
  strCategory: ListingCategory,
  strId: string | number,
): string => `${getRouteByCategory(strCategory).path}/${strId}/edit`;
