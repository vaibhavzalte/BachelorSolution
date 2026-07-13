'use client';

import React from 'react';
import { ListingMediaItem } from '@/types/listing.types';
import ListingImage from '@/components/common/ListingImage';
import { cn } from '@/lib/utils';

interface ListingMediaRendererProps {
  item: ListingMediaItem;
  alt: string;
  className?: string;
  fill?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
}

export default function ListingMediaRenderer({
  item,
  alt,
  className,
  fill = true,
  controls = false,
  autoPlay = false,
}: ListingMediaRendererProps) {
  if (item.type === 'video') {
    return (
      <video
        src={item.url}
        controls={controls}
        autoPlay={autoPlay}
        playsInline
        muted={autoPlay}
        loop={autoPlay}
        className={cn(
          fill ? 'absolute inset-0 h-full w-full object-cover' : 'h-full w-full object-cover',
          className,
        )}
      />
    );
  }

  return (
    <ListingImage
      src={item.url}
      alt={alt}
      fill={fill}
      className={className}
    />
  );
}
