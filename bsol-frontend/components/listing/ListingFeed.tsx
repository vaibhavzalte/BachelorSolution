'use client';

import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { useListings } from '@/hooks/useListings';
import ListingCard from '@/components/cards/ListingCard';

export default function ListingFeed() {
  const {
    activeCategory,
    searchQuery,
    selectedLocation,
    selectedTime,
    categoryFilters,
    clearAllFilters,
  } = useLayoutStore();

  const { data: listings, isLoading, isError, refetch } = useListings(
    activeCategory,
    searchQuery,
    selectedLocation,
    selectedTime,
    categoryFilters,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full mt-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex gap-6 w-full animate-pulse">
            <div className="hidden sm:flex flex-col items-center gap-2 sm:w-24 shrink-0">
              <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 h-44 flex gap-4">
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded-full w-16" />
                  <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded-full w-16" />
                </div>
              </div>
              <div className="w-44 h-full bg-slate-200 dark:bg-zinc-800 rounded-2xl shrink-0" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-soft mt-4">
        <RefreshCw className="h-10 w-10 text-rose-500 mb-4 animate-spin" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Failed to load listings</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Something went wrong while retrieving data. Please try again.
        </p>
        <button 
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-soft"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-soft mt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 mb-4">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No listings found</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs">
          We couldn't find any accommodation or service listings matching "{searchQuery}" in this category.
        </p>
        <button 
          onClick={() => clearAllFilters()}
          className="mt-5 rounded-xl bg-blue-600 px-4.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-soft"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full mt-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
