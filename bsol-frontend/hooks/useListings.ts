import { useQuery } from '@tanstack/react-query';
import { getListings } from '@/services/listing.service';
import { ListingCategory } from '@/types/listing.types';
import { CategoryFiltersState } from '@/types/filter.types';

export const useListings = (
  category: ListingCategory | 'all' = 'all',
  query: string = '',
  location: string = 'Pune',
  time: string = 'Any Time',
  categoryFilters: CategoryFiltersState = {},
) => {
  return useQuery({
    queryKey: ['listings', category, query, location, time, categoryFilters],
    queryFn: () => getListings(category, query, location, time, categoryFilters),
    staleTime: 1000 * 60 * 5,
  });
};
