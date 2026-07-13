import { ListingCategory } from '@/types/listing.types';

export const SIDEBAR_CATEGORIES: {
  name: string;
  id: ListingCategory;
  iconName: string;
}[] = [
  { name: 'Rooms', id: 'rooms', iconName: 'Bed' },
  { name: 'Roommates', id: 'roommates', iconName: 'Users' },
  { name: 'Vacancies', id: 'vacancies', iconName: 'Key' },
  { name: 'Food Stalls', id: 'food', iconName: 'UtensilsCrossed' },
  { name: 'Mess', id: 'mess', iconName: 'Soup' },
  { name: 'Study Rooms', id: 'study', iconName: 'BookOpen' },
];

export const SIDEBAR_LOCATIONS = [
  'Hinjawadi',
  'Baner',
  'Wakad',
  'Aundh',
  'FC Road',
];
