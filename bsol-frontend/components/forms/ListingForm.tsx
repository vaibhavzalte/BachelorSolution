'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
import {
  ClipboardList,
  MapPin,
  UserRound,
  ImageIcon,
  CircleAlert,
} from 'lucide-react';
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
import { useMasters } from '@/providers/MasterProvider';
import { getAreaOptionsForCity, getMasterOptions } from '@/lib/master.utils';
import { MASTER_GROUPS } from '@/types/master.types';
import { FilterOption } from '@/types/filter.types';
import { cn } from '@/lib/utils';

interface ListingFormProps {
  category: ListingCategory;
  mode: 'create' | 'edit';
  listingId?: string;
  initialRaw?: ListingApiResponse;
}

const STR_CONTROL_CLASS =
  'h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:border-blue-400';

const Field = ({
  strLabel,
  boolRequired,
  strError,
  strHint,
  boolFullWidth,
  children,
}: {
  strLabel: string;
  boolRequired?: boolean;
  strError?: string;
  strHint?: string;
  boolFullWidth?: boolean;
  children: React.ReactNode;
}) => (
  <label className={cn('flex flex-col gap-1.5', boolFullWidth && 'sm:col-span-2')}>
    <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
      {strLabel}
      {boolRequired && <span className="ml-0.5 text-rose-500">*</span>}
    </span>
    {children}
    {strError ? (
      <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
        <CircleAlert className="size-3 shrink-0" />
        {strError}
      </span>
    ) : strHint ? (
      <span className="text-[11px] text-slate-400">{strHint}</span>
    ) : null}
  </label>
);

const FormSection = ({
  strTitle,
  strHint,
  objIcon: Icon,
  children,
}: {
  strTitle: string;
  strHint?: string;
  objIcon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40 md:p-5">
    <div className="mb-4 flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-soft dark:bg-zinc-900 dark:text-blue-400">
        <Icon className="size-4" />
      </span>
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{strTitle}</h2>
        {strHint && <p className="mt-0.5 text-[11px] text-slate-500">{strHint}</p>}
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
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
  const { objCatalog, boolReady } = useMasters();

  const arrCityOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.CITY),
    [objCatalog],
  );
  const arrRoomTypeOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.ROOM_TYPE),
    [objCatalog],
  );
  const arrAvailableForOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.AVAILABLE_FOR),
    [objCatalog],
  );
  const arrFoodTypeOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.FOOD_TYPE),
    [objCatalog],
  );
  const arrMealTypeOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.MEAL_TYPE),
    [objCatalog],
  );
  const arrPreferredTenantOptions = useMemo(
    () => getMasterOptions(objCatalog, MASTER_GROUPS.PREFERRED_TENANT),
    [objCatalog],
  );

  const objDefaultValues = useMemo((): ListingFormValues => {
    if (initialRaw) {
      const objBase = getDefaultListingValues(category, {
        strCity: initialRaw.city ?? '',
      });
      return {
        ...objBase,
        ...initialRaw,
        amenities: Array.isArray(initialRaw.amenities)
          ? initialRaw.amenities.join(', ')
          : '',
        ownerEmail: initialRaw.ownerEmail ?? '',
        googleMap: initialRaw.googleMap ?? '',
        area: initialRaw.area ?? '',
        ownerContact: initialRaw.ownerContact ?? '',
        contactNumber: initialRaw.contactNumber ?? '',
      } as ListingFormValues;
    }
    return getDefaultListingValues(category);
  }, [category, initialRaw]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(objSchema) as never,
    defaultValues: objDefaultValues as DefaultValues<ListingFormValues>,
  });

  const strSelectedCity = String(watch('city' as Path<ListingFormValues>) ?? '');
  const arrAreaOptions = useMemo(
    () =>
      strSelectedCity
        ? getAreaOptionsForCity(objCatalog, strSelectedCity)
        : [],
    [objCatalog, strSelectedCity],
  );

  useEffect(() => {
    if (boolReady) {
      reset(objDefaultValues);
    }
  }, [boolReady, objDefaultValues, reset]);

  useEffect(() => {
    const strArea = String(getValues('area' as Path<ListingFormValues>) ?? '');
    if (!strArea) {
      return;
    }
    const boolValid = arrAreaOptions.some((objOption) => objOption.value === strArea);
    if (!boolValid) {
      setValue('area' as Path<ListingFormValues>, '' as never, { shouldValidate: false });
    }
  }, [arrAreaOptions, getValues, setValue]);

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
    boolRequired = false,
    boolFullWidth = false,
  ) => (
    <Field
      strLabel={strLabel}
      boolRequired={boolRequired}
      strError={getError(strName)}
      boolFullWidth={boolFullWidth}
    >
      <Input
        type={strType}
        placeholder={strPlaceholder}
        className={STR_CONTROL_CLASS}
        aria-invalid={Boolean(getError(strName))}
        {...register(strName)}
      />
    </Field>
  );

  const renderCheckbox = (strName: Path<ListingFormValues>, strLabel: string) => (
    <label className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300">
      <Controller
        name={strName}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
        )}
      />
      {strLabel}
    </label>
  );

  const renderSelect = (
    strName: Path<ListingFormValues>,
    strLabel: string,
    arrOptions: FilterOption[],
    strPlaceholder: string,
    boolRequired = false,
    boolDisabled = false,
  ) => (
    <Field strLabel={strLabel} boolRequired={boolRequired} strError={getError(strName)}>
      <select
        className={STR_CONTROL_CLASS}
        disabled={boolDisabled}
        aria-invalid={Boolean(getError(strName))}
        {...register(strName)}
      >
        <option value="">{strPlaceholder}</option>
        {arrOptions.map((objOption) => (
          <option key={`${strName}-${objOption.value}`} value={objOption.value}>
            {objOption.label}
          </option>
        ))}
      </select>
    </Field>
  );

  const boolPending = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const boolHasOwnerEmail = category !== 'food' && category !== 'study';
  const strContactName =
    category === 'food' ? 'contactNumber' : ('ownerContact' as Path<ListingFormValues>);

  if (!boolReady) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-8 text-sm text-slate-500 shadow-card dark:border-zinc-800 dark:bg-zinc-900">
        Loading form options...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as (data: FieldValues) => Promise<void>)}
      className="mx-auto flex w-full max-w-4xl flex-col gap-5"
    >
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              {mode === 'create' ? 'New listing' : 'Edit listing'}
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100 md:text-2xl">
              {mode === 'create' ? `Post ${strLabel}` : `Edit ${strLabel}`}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Fields marked with <span className="text-rose-500">*</span> are required. Images are
              optional.
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {strLabel}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <FormSection
            strTitle="Listing details"
            strHint="Core information buyers will see first."
            objIcon={ClipboardList}
          >
            {category === 'rooms' && (
              <>
                {renderTextInput('title', 'Title', 'Spacious 1BHK Room', 'text', true, true)}
                {renderSelect('roomType', 'Room Type', arrRoomTypeOptions, 'Select room type', true)}
                {renderSelect(
                  'availableFor',
                  'Available For',
                  arrAvailableForOptions,
                  'Select availability',
                  true,
                )}
                {renderTextInput('rent', 'Rent (₹)', '15000', 'number', true)}
                {renderTextInput('deposit', 'Deposit (₹)', '30000', 'number')}
                {renderTextInput('maintenance', 'Maintenance (₹)', '1500', 'number')}
                {renderTextInput('brokerage', 'Brokerage (₹)', '0', 'number')}
                {renderTextInput(
                  'amenities',
                  'Amenities (comma separated)',
                  'WiFi, Parking',
                  'text',
                  false,
                  true,
                )}
              </>
            )}

            {(category === 'roommates' || category === 'vacancies') && (
              <>
                {renderTextInput('title', 'Title', '1 sharing vacancy', 'text', true, true)}
                {renderSelect('roomType', 'Room Type', arrRoomTypeOptions, 'Select room type', true)}
                {renderSelect(
                  'preferredTenant',
                  'Preferred Tenant',
                  arrPreferredTenantOptions,
                  'Select preferred tenant',
                  true,
                )}
                {renderTextInput('totalVacancies', 'Total Vacancies', '1', 'number')}
                {renderTextInput('rent', 'Rent (₹)', '8000', 'number', true)}
                {renderTextInput('deposit', 'Deposit (₹)', '16000', 'number')}
                {renderTextInput('availableFrom', 'Available From', '', 'date')}
                {renderTextInput(
                  'amenities',
                  'Amenities (comma separated)',
                  'WiFi, Parking',
                  'text',
                  false,
                  true,
                )}
              </>
            )}

            {category === 'mess' && (
              <>
                {renderTextInput('messName', 'Mess Name', 'Shree Veg Mess', 'text', true, true)}
                {renderSelect('foodType', 'Food Type', arrFoodTypeOptions, 'Select food type', true)}
                {renderSelect('mealType', 'Meal Type', arrMealTypeOptions, 'Select meal type', true)}
                {renderTextInput('monthlyFee', 'Monthly Fee (₹)', '3500', 'number', true)}
                {renderTextInput('perMealFee', 'Per Meal Fee (₹)', '80', 'number')}
                <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                  {renderCheckbox('homeDelivery', 'Home Delivery')}
                  {renderCheckbox('diningArea', 'Dining Area')}
                </div>
              </>
            )}

            {category === 'food' && (
              <>
                {renderTextInput('stallName', 'Stall Name', 'Campus Maggi Point', 'text', true, true)}
                {renderSelect('foodType', 'Food Type', arrFoodTypeOptions, 'Select food type', true)}
                {renderTextInput('location', 'Landmark', 'Near Gate 2')}
                {renderTextInput('rating', 'Rating', '4.5', 'number')}
                {renderCheckbox('isOpen', 'Open Now')}
              </>
            )}

            {category === 'study' && (
              <>
                {renderTextInput('roomName', 'Room Name', 'Silent Study Room A', 'text', true, true)}
                {renderTextInput('location', 'Landmark', '2nd Floor, Building B')}
                {renderTextInput('capacity', 'Capacity', '40', 'number')}
                {renderTextInput('availableSeats', 'Available Seats', '12', 'number')}
                {renderTextInput('rules', 'Rules', 'No talking, no calls', 'text', false, true)}
                {renderTextInput('rating', 'Rating', '4.6', 'number')}
                <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
                  {renderCheckbox('isAvailable', 'Available')}
                  {renderCheckbox('hasWifi', 'WiFi')}
                  {renderCheckbox('hasChargingPoints', 'Charging Points')}
                  {renderCheckbox('hasAC', 'AC')}
                </div>
              </>
            )}
          </FormSection>

          <FormSection
            strTitle="Location"
            strHint="Area options update when you choose a city."
            objIcon={MapPin}
          >
            {renderSelect('city', 'City', arrCityOptions, 'Select city', true)}
            {renderSelect(
              'area',
              'Area',
              arrAreaOptions,
              strSelectedCity ? 'Select area' : 'Select city first',
              true,
              !strSelectedCity,
            )}
            {renderTextInput(
              'googleMap',
              'Google Map URL',
              'https://maps.google.com/?q=18.5590,73.7868',
              'url',
              true,
              true,
            )}
            {category !== 'food' &&
              category !== 'study' &&
              renderTextInput('address', 'Address', 'Street, landmark', 'text', false, true)}
          </FormSection>

          <FormSection
            strTitle="Owner / contact"
            strHint="This is shown to interested users."
            objIcon={UserRound}
          >
            {renderTextInput('ownerName', 'Owner Name', 'Rahul Sharma', 'text', true)}
            {renderTextInput(
              strContactName,
              'Contact Number',
              '9876543210',
              'tel',
              true,
            )}
            {boolHasOwnerEmail &&
              renderTextInput('ownerEmail', 'Owner Email', 'owner@example.com', 'email')}
          </FormSection>

          <FormSection
            strTitle="Description & photos"
            strHint="Add extra context and optional images."
            objIcon={ImageIcon}
          >
            <Field
              strLabel="Description"
              strError={getError('description')}
              boolFullWidth
            >
              <textarea
                className={cn(STR_CONTROL_CLASS, 'min-h-28 py-3')}
                placeholder="Describe the listing..."
                {...register('description' as Path<ListingFormValues>)}
              />
            </Field>
            <Field
              strLabel="Images"
              strHint={
                arrImages.length > 0
                  ? `${arrImages.length} file(s) selected`
                  : 'JPG or PNG. You can add more later.'
              }
              boolFullWidth
            >
              <Input
                type="file"
                accept="image/*"
                multiple
                className={cn(STR_CONTROL_CLASS, 'py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:text-xs file:font-semibold file:text-blue-700')}
                onChange={(event) => {
                  const arrFiles = event.target.files
                    ? Array.from(event.target.files)
                    : [];
                  setArrImages(arrFiles);
                }}
              />
            </Field>
          </FormSection>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-zinc-800 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={boolPending}
            className="h-11 rounded-xl bg-[var(--primary)] px-6 text-white"
          >
            {boolPending
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Listing'
                : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
