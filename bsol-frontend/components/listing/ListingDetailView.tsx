'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Pencil,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Listing } from '@/types/listing.types';
import { useDeleteListing } from '@/hooks/useListings';
import {
  buildListingEditPath,
  getRouteByCategory,
} from '@/constants/listing-routes';
import { Button } from '@/components/ui/button';
import ListingMediaStack from '@/components/common/ListingMediaStack';
import OwnerAvatar from '@/components/common/OwnerAvatar';

interface ListingDetailViewProps {
  listing: Listing;
}

export default function ListingDetailView({ listing }: ListingDetailViewProps) {
  const router = useRouter();
  const deleteMutation = useDeleteListing(listing.category);
  const objRoute = getRouteByCategory(listing.category);

  const handleDelete = async () => {
    const boolConfirmed = window.confirm('Delete this listing?');
    if (!boolConfirmed) return;

    try {
      await deleteMutation.mutateAsync(listing.id);
      toast.success('Listing deleted');
      router.push(objRoute.path);
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={objRoute.path}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {objRoute.label}
        </Link>

        <div className="flex gap-2">
          <Link
            href={buildListingEditPath(listing.category, listing.id)}
            className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Link>
          <Button
            variant="outline"
            className="rounded-xl text-xs text-rose-600 hover:bg-rose-50"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          <div className="min-h-64 bg-slate-50 p-4 dark:bg-zinc-950 md:min-h-[420px]">
            <ListingMediaStack
              media={listing.media}
              fallbackUrl={listing.imageUrl}
              title={listing.title}
            />
          </div>

          <div className="flex flex-col gap-4 p-5 md:p-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {objRoute.label}
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
                {listing.title}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {listing.location}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {listing.price}
              </span>
              <span className="text-sm text-slate-400">/ {listing.pricePeriod}</span>
            </div>

            {listing.description && (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {listing.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {listing.details.map((strDetail) => (
                <span
                  key={strDetail}
                  className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                >
                  {strDetail}
                </span>
              ))}
            </div>

            {listing.amenities.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((strAmenity) => (
                    <span
                      key={strAmenity}
                      className="rounded-xl border border-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-zinc-700"
                    >
                      {strAmenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-zinc-950">
              <OwnerAvatar name={listing.userName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {listing.userName}
                </p>
                <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  {listing.ownerContact && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {listing.ownerContact}
                    </span>
                  )}
                  {listing.ownerEmail && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {listing.ownerEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
