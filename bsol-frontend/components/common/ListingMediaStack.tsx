'use client';

import React, { useMemo, useState } from 'react';
import { Images, Play } from 'lucide-react';
import { ListingMediaItem } from '@/types/listing.types';
import ListingMediaRenderer from '@/components/common/ListingMediaRenderer';
import ListingMediaGallery from '@/components/common/ListingMediaGallery';
import ListingMediaPlaceholder from '@/components/common/ListingMediaPlaceholder';
import { getListingMedia } from '@/lib/media.utils';
import { cn } from '@/lib/utils';

interface ListingMediaStackProps {
  media?: ListingMediaItem[];
  fallbackUrl?: string;
  title: string;
  className?: string;
}

export default function ListingMediaStack({
  media,
  fallbackUrl = '',
  title,
  className,
}: ListingMediaStackProps) {
  const [boolGalleryOpen, setBoolGalleryOpen] = useState(false);
  const [intGalleryStartIndex, setIntGalleryStartIndex] = useState(0);

  const arrMedia = useMemo(
    () => getListingMedia(media, fallbackUrl),
    [media, fallbackUrl],
  );

  const boolHasMedia = arrMedia.length > 0;
  const objPrimary = arrMedia[0];
  const objSecondary = arrMedia[1];
  const intExtraCount = Math.max(0, arrMedia.length - 1);
  const boolHasStack = arrMedia.length > 1;

  const openGallery = (intIndex = 0) => {
    if (!boolHasMedia) return;
    setIntGalleryStartIndex(intIndex);
    setBoolGalleryOpen(true);
  };

  if (!boolHasMedia) {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-100/80 dark:border-zinc-700 shadow-soft">
          <div className="relative w-full h-28 md:h-24 lg:h-28">
            <ListingMediaPlaceholder category="rooms" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('relative w-full', className)}>
        {boolHasStack && objSecondary && (
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-zinc-700/60 shadow-md z-0 origin-bottom-left"
            style={{ transform: 'rotate(6deg) translate(8px, 6px) scale(0.94)' }}
            aria-hidden
          >
            <div className="relative w-full h-full bg-slate-100 dark:bg-zinc-800">
              <ListingMediaRenderer
                item={objSecondary}
                alt={`${title} preview 2`}
                className="opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => openGallery(0)}
          className={cn(
            'relative w-full rounded-2xl overflow-hidden border border-slate-100/80 dark:border-zinc-700 shadow-soft z-10',
            'transition-all duration-300 hover:shadow-hover hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            boolHasStack && 'shadow-lg',
          )}
          aria-label={`View ${arrMedia.length} media item${arrMedia.length > 1 ? 's' : ''}`}
        >
          <div className="relative w-full h-28 md:h-24 lg:h-28 bg-slate-100 dark:bg-zinc-800">
            <ListingMediaRenderer
              item={objPrimary}
              alt={title}
              className="transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {objPrimary.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                  <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}

            {intExtraCount > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/65 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                <Images className="h-3 w-3" />
                <span>+{intExtraCount}</span>
              </div>
            )}

            {arrMedia.some((objItem) => objItem.type === 'video') && objPrimary.type !== 'video' && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-semibold text-white">
                <Play className="h-2.5 w-2.5 fill-white" />
                <span>Video</span>
              </div>
            )}
          </div>
        </button>
      </div>

      <ListingMediaGallery
        open={boolGalleryOpen}
        onClose={() => setBoolGalleryOpen(false)}
        media={arrMedia}
        initialIndex={intGalleryStartIndex}
        title={title}
      />
    </>
  );
}
