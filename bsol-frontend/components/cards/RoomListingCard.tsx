'use client';

import React from 'react';
import {
  MapPin,
  Share2,
  MoreVertical,
  CheckCheck,
  Home,
  IndianRupee,
  Sofa,
  Sparkles,
} from 'lucide-react';
import { Listing } from '@/types/listing.types';
import { Badge } from '@/components/ui/badge';
import OwnerAvatar from '@/components/common/OwnerAvatar';
import ListingMediaStack from '@/components/common/ListingMediaStack';
import { formatDisplayName } from '@/lib/avatar.utils';

interface RoomListingCardProps {
  listing: Listing;
}

export default function RoomListingCard({ listing }: RoomListingCardProps) {
  const {
    title,
    location,
    price,
    pricePeriod,
    negotiable,
    userName,
    imageUrl,
    media,
    verified,
    details,
    amenities,
    tags,
    timePosted,
    checkmarks,
    description,
  } = listing;

  const strDisplayName = formatDisplayName(userName);
  const strDetailsLine = details.join(' • ');
  const strAmenitiesLine = amenities.join(' • ');

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 md:gap-6 w-full group">
      {/* Owner column with initials avatar */}
      <div className="flex flex-row sm:flex-col items-center gap-3 sm:w-24 shrink-0 sm:text-center px-2 py-1">
        <OwnerAvatar name={userName} size="md" />
        <div className="flex flex-col sm:items-center">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {strDisplayName}
          </span>
          {verified && (
            <span className="flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 mt-0.5">
              <Sparkles className="h-2 w-2 fill-emerald-600" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Main card */}
      <div className="relative flex-1 rounded-3xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col md:flex-row justify-between gap-4">
        <button
          className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm hover:text-slate-600 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 dark:hover:text-slate-200"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 flex flex-col justify-between gap-3 max-w-lg">
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold leading-snug pr-6 text-[var(--tag-rooms-text)]">
              {title}
            </h2>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
              <span>{location}</span>
            </div>

            {strDetailsLine && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                <Home className="h-3 w-3 shrink-0 text-slate-400" />
                <span>{strDetailsLine}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap">
              <IndianRupee className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">
                {price}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                / {pricePeriod}
              </span>
              {negotiable && (
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-zinc-800">
                  (Negotiable)
                </span>
              )}
            </div>

            {strAmenitiesLine && (
              <div className="flex items-start gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <Sofa className="h-3 w-3 shrink-0 text-slate-400 mt-0.5" />
                <span>{strAmenitiesLine}</span>
              </div>
            )}

            {description && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 pl-0">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map((strTag) => (
              <Badge
                key={strTag}
                variant="secondary"
                className="rounded-full px-3 py-1 text-[9px] font-bold tracking-wide border border-transparent shadow-none bg-[var(--tag-rooms-bg)] text-[var(--tag-rooms-text)]"
              >
                {strTag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Image + timestamp — inset so menu button stays visible */}
        <div className="w-full md:w-44 lg:w-48 shrink-0 flex flex-col justify-between items-end gap-2 pt-8 pr-3 md:pt-9 md:pr-4">
          <ListingMediaStack
            media={media}
            fallbackUrl={imageUrl}
            title={title}
          />
          <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <span>{timePosted}</span>
            {checkmarks && <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />}
          </div>
        </div>
      </div>

      {/* Share button */}
      <div className="hidden sm:flex items-center shrink-0">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-soft transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          aria-label="Share listing"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex sm:hidden justify-end px-4 -mt-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-soft"
          aria-label="Share listing"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
