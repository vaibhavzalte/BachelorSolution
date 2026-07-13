'use client';

import React from 'react';
import {
  MapPin,
  Share2,
  MoreVertical,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { Listing } from '@/types/listing.types';
import { Badge } from '@/components/ui/badge';
import OwnerAvatar from '@/components/common/OwnerAvatar';
import ListingImage from '@/components/common/ListingImage';
import ListingMediaPlaceholder from '@/components/common/ListingMediaPlaceholder';
import { formatDisplayName } from '@/lib/avatar.utils';
import { cn } from '@/lib/utils';

interface GenericListingCardProps {
  listing: Listing;
}

const categoryConfigs = {
  roommates: {
    textClass: 'text-[var(--tag-roommates-text)]',
    tagBgClass: 'bg-[var(--tag-roommates-bg)] text-[var(--tag-roommates-text)]',
  },
  food: {
    textClass: 'text-[var(--tag-food-text)]',
    tagBgClass: 'bg-[var(--tag-food-bg)] text-[var(--tag-food-text)]',
  },
  study: {
    textClass: 'text-[var(--tag-study-text)]',
    tagBgClass: 'bg-[var(--tag-study-bg)] text-[var(--tag-study-text)]',
  },
  vacancies: {
    textClass: 'text-[var(--tag-study-text)]',
    tagBgClass: 'bg-[var(--tag-study-bg)] text-[var(--tag-study-text)]',
  },
  mess: {
    textClass: 'text-[var(--tag-mess-text)]',
    tagBgClass: 'bg-[var(--tag-mess-bg)] text-[var(--tag-mess-text)]',
  },
  rooms: {
    textClass: 'text-[var(--tag-rooms-text)]',
    tagBgClass: 'bg-[var(--tag-rooms-bg)] text-[var(--tag-rooms-text)]',
  },
};

export default function GenericListingCard({ listing }: GenericListingCardProps) {
  const {
    title,
    category,
    location,
    price,
    pricePeriod,
    negotiable,
    userName,
    imageUrl,
    verified,
    details,
    amenities,
    tags,
    timePosted,
    checkmarks,
  } = listing;

  const config = categoryConfigs[category as keyof typeof categoryConfigs] || categoryConfigs.rooms;
  const strDisplayName = formatDisplayName(userName);

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 md:gap-6 w-full group">
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

      <div className="relative flex-1 rounded-3xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col md:flex-row justify-between gap-4">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 flex flex-col justify-between gap-3 max-w-lg">
          <div>
            <h2 className={cn('text-sm sm:text-base font-bold leading-snug pr-6', config.textClass)}>
              {title}
            </h2>

            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {details.map((detail, idx) => (
                <span
                  key={detail}
                  className="inline-flex items-center text-[10px] font-bold text-slate-600 dark:text-slate-300"
                >
                  {idx > 0 && <span className="mr-1.5 text-slate-300 dark:text-slate-700">•</span>}
                  {detail}
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {pricePeriod.toLowerCase() === 'starting from' ? 'Starting from' : ''}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100">
                {price}
              </span>
              {pricePeriod.toLowerCase() !== 'starting from' && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  / {pricePeriod}
                </span>
              )}
              {negotiable && (
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 ml-1.5 bg-slate-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-zinc-800">
                  (Negotiable)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {amenities.map((amenity, idx) => (
                <span key={amenity} className="inline-flex items-center">
                  {idx > 0 && <span className="mr-1.5 text-slate-300 dark:text-slate-700">•</span>}
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  'rounded-full px-3 py-1 text-[9px] font-bold tracking-wide uppercase border border-transparent shadow-none',
                  config.tagBgClass,
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-full md:w-44 lg:w-48 shrink-0 flex flex-col justify-between items-end gap-2">
          <div className="relative w-full h-28 md:h-24 lg:h-28 overflow-hidden rounded-2xl border border-slate-100/50 dark:border-zinc-800 shadow-soft">
            {imageUrl ? (
              <ListingImage
                src={imageUrl}
                alt={title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <ListingMediaPlaceholder category={category} />
            )}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <span>{timePosted}</span>
            {checkmarks && <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />}
          </div>
        </div>
      </div>

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
