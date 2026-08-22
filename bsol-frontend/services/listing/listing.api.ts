import { api } from '@/services/api/axios';
import {
  ListingApiResponse,
  ListingQueryParams,
  ListingRequestPayload,
  ListingTypeName,
} from '@/types/api.types';

const buildListingFormData = (
  objListing: ListingRequestPayload,
  arrImages?: File[],
): FormData => {
  const formData = new FormData();
  formData.append('listing', JSON.stringify(objListing));

  if (Array.isArray(arrImages)) {
    arrImages.forEach((objFile) => {
      formData.append('images', objFile);
    });
  }

  return formData;
};

export const listingApi = {
  healthCheck: () => api.get<string>('/listings'),

  getListings: (strTypeName: ListingTypeName, objParams?: ListingQueryParams) =>
    api.get<ListingApiResponse[]>(`/listings/${strTypeName}`, {
      params: objParams,
    }),

  getListingById: (strTypeName: ListingTypeName, intId: number | string) =>
    api.get<ListingApiResponse>(`/listings/${strTypeName}/${intId}`),

  createListing: (
    strTypeName: ListingTypeName,
    objListing: ListingRequestPayload,
    arrImages?: File[],
  ) =>
    api.post<ListingApiResponse>(
      `/listings/${strTypeName}`,
      buildListingFormData(objListing, arrImages),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),

  updateListing: (
    strTypeName: ListingTypeName,
    intId: number | string,
    objListing: ListingRequestPayload,
    arrImages?: File[],
  ) =>
    api.put<ListingApiResponse>(
      `/listings/${strTypeName}/${intId}`,
      buildListingFormData(objListing, arrImages),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ),

  deleteListing: (strTypeName: ListingTypeName, intId: number | string) =>
    api.delete(`/listings/${strTypeName}/${intId}`),
};
