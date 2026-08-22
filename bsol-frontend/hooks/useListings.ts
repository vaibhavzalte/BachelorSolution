import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing,
} from '@/services/listing.service';
import { ListingCategory } from '@/types/listing.types';
import { CategoryFiltersState } from '@/types/filter.types';
import { ListingRequestPayload } from '@/types/api.types';

export const listingQueryKeys = {
  all: ['listings'] as const,
  list: (
    category: ListingCategory | 'all',
    query: string,
    location: string,
    time: string,
    categoryFilters: CategoryFiltersState,
  ) =>
    [...listingQueryKeys.all, 'list', category, query, location, time, categoryFilters] as const,
  detail: (category: ListingCategory, id: string | number) =>
    [...listingQueryKeys.all, 'detail', category, String(id)] as const,
};

export const useListings = (
  category: ListingCategory | 'all' = 'all',
  query: string = '',
  location: string = 'Pune',
  time: string = 'Any Time',
  categoryFilters: CategoryFiltersState = {},
) => {
  return useQuery({
    queryKey: listingQueryKeys.list(category, query, location, time, categoryFilters),
    queryFn: () => getListings(category, query, location, time, categoryFilters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useListing = (category: ListingCategory, id: string | number, enabled = true) => {
  return useQuery({
    queryKey: listingQueryKeys.detail(category, id),
    queryFn: () => getListingById(category, id),
    enabled: enabled && Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateListing = (category: ListingCategory) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listing,
      images,
    }: {
      listing: ListingRequestPayload;
      images?: File[];
    }) => createListing(category, listing, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.all });
    },
  });
};

export const useUpdateListing = (category: ListingCategory) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      listing,
      images,
    }: {
      id: string | number;
      listing: ListingRequestPayload;
      images?: File[];
    }) => updateListing(category, id, listing, images),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: listingQueryKeys.detail(category, variables.id),
      });
    },
  });
};

export const useDeleteListing = (category: ListingCategory) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteListing(category, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.all });
    },
  });
};
