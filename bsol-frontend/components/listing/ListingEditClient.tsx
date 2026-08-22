'use client';

import React from 'react';
import { ListingCategory } from '@/types/listing.types';
import { useListing } from '@/hooks/useListings';
import ListingForm from '@/components/forms/ListingForm';
import { Button } from '@/components/ui/button';

interface ListingEditClientProps {
  category: ListingCategory;
  id: string;
}

export default function ListingEditClient({
  category,
  id,
}: ListingEditClientProps) {
  const { data, isLoading, isError, refetch } = useListing(category, id);

  if (isLoading) {
    return (
      <div className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-900" />
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-semibold text-slate-700">Could not load listing</p>
        <Button className="mt-4 rounded-xl" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ListingForm
      category={category}
      mode="edit"
      listingId={id}
      initialRaw={data.raw}
    />
  );
}
