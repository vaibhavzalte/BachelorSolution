'use client';

import React, { useMemo, useState } from 'react';
import {
  useForm,
  Controller,
  FieldValues,
  Path,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ListingCategory } from '@/types/listing.types';
import { ListingApiResponse } from '@/types/api.types';
import {
  getDefaultListingValues,
  getListingSchema,
  ListingFormValues,
  toListingRequestPayload,
} from '@/lib/listing-form.schema';
import { useCreateListing, useUpdateListing } from '@/hooks/useListings';
import {
  buildListingDetailPath,
  getRouteByCategory,
} from '@/constants/listing-routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ListingFormProps {
  category: ListingCategory;
  mode: 'create' | 'edit';
  listingId?: string;
  initialRaw?: ListingApiResponse;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </span>
    {children}
  </label>
);

export default function ListingForm({
  category,
  mode,
  listingId,
  initialRaw,
}: ListingFormProps) {
  const router = useRouter();
  const [arrImages, setArrImages] = useState<File[]>([]);
  const objSchema = useMemo(() => getListingSchema(category), [category]);
  const createMutation = useCreateListing(category);
  const updateMutation = useUpdateListing(category);
  const strLabel = getRouteByCategory(category).label;

  const objDefaultValues = useMemo((): ListingFormValues => {
    if (initialRaw) {
      const objBase = getDefaultListingValues(category, initialRaw.city ?? 'Pune');
      return {
        ...objBase,
        ...initialRaw,
        amenities: Array.isArray(initialRaw.amenities)
          ? initialRaw.amenities.join(', ')
          : '',
        ownerEmail: initialRaw.ownerEmail ?? '',
      } as ListingFormValues;
    }
    return getDefaultListingValues(category);
  }, [category, initialRaw]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    // Category-specific schemas are resolved at runtime
    resolver: zodResolver(objSchema) as never,
    defaultValues: objDefaultValues as DefaultValues<ListingFormValues>,
  });

  const getError = (strKey: string): string | undefined => {
    const objError = (errors as Record<string, { message?: string }>)[strKey];
    return objError?.message;
  };

  const onSubmit = async (objValues: ListingFormValues) => {
    try {
      const objPayload = toListingRequestPayload(category, objValues);

      if (mode === 'edit' && listingId) {
        const objUpdated = await updateMutation.mutateAsync({
          id: listingId,
          listing: objPayload,
          images: arrImages,
        });
        toast.success('Listing updated');
        router.push(buildListingDetailPath(category, objUpdated.id));
        return;
      }

      const objCreated = await createMutation.mutateAsync({
        listing: objPayload,
        images: arrImages,
      });
      toast.success('Listing created');
      router.push(buildListingDetailPath(category, objCreated.id));
    } catch {
      toast.error('Could not save listing. Check the API and try again.');
    }
  };

  const renderTextInput = (
    strName: Path<ListingFormValues>,
    strLabel: string,
    strPlaceholder = '',
    strType: React.HTMLInputTypeAttribute = 'text',
  ) => (
    <Field label={strLabel}>
      <Input
        type={strType}
        placeholder={strPlaceholder}
        className="rounded-xl"
        {...register(strName)}
      />
      {getError(strName) && (
        <span className="text-[11px] text-rose-500">{getError(strName)}</span>
      )}
    </Field>
  );

  const renderCheckbox = (strName: Path<ListingFormValues>, strLabel: string) => (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
      <Controller
        name={strName}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
        )}
      />
      {strLabel}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit as (data: FieldValues) => Promise<void>)}
      className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900 md:p-8"
    >
      <div>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {mode === 'create' ? `Post ${strLabel}` : `Edit ${strLabel}`}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Fill in the details below. Images are optional.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {category === 'rooms' && (
          <>
            {renderTextInput('title', 'Title', 'Spacious 1BHK Room')}
            {renderTextInput('roomType', 'Room Type', '1BHK')}
            {renderTextInput('availableFor', 'Available For', 'BOYS / GIRLS / ANY')}
            {renderTextInput('rent', 'Rent', '15000', 'number')}
            {renderTextInput('deposit', 'Deposit', '30000', 'number')}
            {renderTextInput('maintenance', 'Maintenance', '1500', 'number')}
            {renderTextInput('brokerage', 'Brokerage', '0', 'number')}
            {renderTextInput('amenities', 'Amenities (comma separated)', 'WiFi, Parking')}
            {renderTextInput('googleMap', 'Google Map URL')}
          </>
        )}

        {(category === 'roommates' || category === 'vacancies') && (
          <>
            {renderTextInput('title', 'Title', '1 sharing vacancy')}
            {renderTextInput('roomType', 'Room Type', '2BHK')}
            {renderTextInput('preferredTenant', 'Preferred Tenant', 'Male / Female / Any')}
            {renderTextInput('totalVacancies', 'Total Vacancies', '1', 'number')}
            {renderTextInput('rent', 'Rent', '8000', 'number')}
            {renderTextInput('deposit', 'Deposit', '16000', 'number')}
            {renderTextInput('amenities', 'Amenities (comma separated)')}
            {renderTextInput('availableFrom', 'Available From', '2026-09-01')}
          </>
        )}

        {category === 'mess' && (
          <>
            {renderTextInput('messName', 'Mess Name', 'Shree Veg Mess')}
            {renderTextInput('foodType', 'Food Type', 'VEG / NONVEG')}
            {renderTextInput('mealType', 'Meal Type', 'ALL / LUNCH / DINNER')}
            {renderTextInput('monthlyFee', 'Monthly Fee', '3500', 'number')}
            {renderTextInput('perMealFee', 'Per Meal Fee', '80', 'number')}
            <div className="flex flex-col gap-3 md:col-span-2">
              {renderCheckbox('homeDelivery', 'Home Delivery')}
              {renderCheckbox('diningArea', 'Dining Area')}
            </div>
          </>
        )}

        {category === 'food' && (
          <>
            {renderTextInput('stallName', 'Stall Name', 'Campus Maggi Point')}
            {renderTextInput('location', 'Location', 'Near Gate 2')}
            {renderTextInput('foodType', 'Food Type', 'VEG')}
            {renderTextInput('contactNumber', 'Contact Number')}
            {renderTextInput('rating', 'Rating', '4.5', 'number')}
            <div className="flex flex-col gap-3">{renderCheckbox('isOpen', 'Open Now')}</div>
          </>
        )}

        {category === 'study' && (
          <>
            {renderTextInput('roomName', 'Room Name', 'Silent Study Room A')}
            {renderTextInput('location', 'Location')}
            {renderTextInput('capacity', 'Capacity', '40', 'number')}
            {renderTextInput('availableSeats', 'Available Seats', '12', 'number')}
            {renderTextInput('rules', 'Rules')}
            {renderTextInput('rating', 'Rating', '4.6', 'number')}
            <div className="flex flex-col gap-3 md:col-span-2">
              {renderCheckbox('isAvailable', 'Available')}
              {renderCheckbox('hasWifi', 'WiFi')}
              {renderCheckbox('hasChargingPoints', 'Charging Points')}
              {renderCheckbox('hasAC', 'AC')}
            </div>
          </>
        )}

        {renderTextInput('city', 'City', 'Pune')}
        {category !== 'food' && category !== 'study' && (
          <>
            {renderTextInput('area', 'Area', 'Baner')}
            {renderTextInput('address', 'Address')}
            {renderTextInput('ownerName', 'Owner Name')}
            {renderTextInput('ownerContact', 'Owner Contact')}
            {renderTextInput('ownerEmail', 'Owner Email', 'owner@example.com', 'email')}
          </>
        )}
        {(category === 'food' || category === 'study') && (
          <>
            {renderTextInput('ownerName', 'Owner / Contact Name')}
          </>
        )}
      </div>

      <Field label="Description">
        <textarea
          className="min-h-28 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
          {...register('description' as Path<ListingFormValues>)}
        />
      </Field>

      <Field label="Images">
        <Input
          type="file"
          accept="image/*"
          multiple
          className="rounded-xl"
          onChange={(event) => {
            const arrFiles = event.target.files
              ? Array.from(event.target.files)
              : [];
            setArrImages(arrFiles);
          }}
        />
        {arrImages.length > 0 && (
          <span className="text-[11px] text-slate-500">
            {arrImages.length} file(s) selected
          </span>
        )}
      </Field>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
          className="rounded-xl bg-[var(--primary)] px-5 text-white"
        >
          {mode === 'create' ? 'Create Listing' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
