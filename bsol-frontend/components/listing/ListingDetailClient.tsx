'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ListingCategory } from '@/types/listing.types';
import { useListing } from '@/hooks/useListings';
import ListingDetailView from '@/components/listing/ListingDetailView';
import { Button } from '@/components/ui/button';

interface ListingDetailClientProps {
  category: ListingCategory;
  id: string;
}

export default function ListingDetailClient({
  category,
  id,
}: ListingDetailClientProps) {
  const { data, isLoading, isError, refetch } = useListing(category, id);

  if (isLoading) {
    return (
      <div className="h-80 animate-pulse rounded-3xl bg-slate-100 dark:bg-zinc-900" />
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
        <RefreshCw className="mb-4 h-10 w-10 text-rose-500" />
        <h3 className="text-sm font-bold text-slate-800">Listing not found</h3>
        <Button className="mt-4 rounded-xl" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return <ListingDetailView listing={data} />;
}
