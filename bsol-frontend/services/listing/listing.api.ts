import { api } from '@/services/api/axios';
import { ListingCategory } from '@/types/listing.types';

type ListingFilterParams = {
  category?: string;
  query?: string;
  keyword?: string;
  location?: string;
  time?: string;
};

export const listingApi = {
  getListings: (
    category: ListingCategory | 'all' = 'all',
    query = '',
    location = 'Pune',
    time = 'Any Time',
  ) => {
    const params: ListingFilterParams = {};

    if (category && category !== 'all') {
      params.category = category;
    }

    if (query) {
      params.query = query;
      params.keyword = query;
    }

    if (location) {
      params.location = location;
    }

    if (time && time !== 'Any Time') {
      params.time = time;
    }

    return api.get('/listings', { params });
  },

  getListingsByCategory: (category: string, params?: ListingFilterParams) =>
    api.get(`/listings/category/${category}`, { params }),

  getRooms: (params?: Record<string, string | undefined>) =>
    api.get('/roomManagment/Room', { params }),
};
