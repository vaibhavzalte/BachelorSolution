'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ListingImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export default function ListingImage({ src, alt, className, fill = true }: ListingImageProps) {
  const boolIsDataUri = src.startsWith('data:');

  if (boolIsDataUri) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill ? 'absolute inset-0 h-full w-full object-cover' : '', className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={cn('object-cover', className)}
      unoptimized={src.startsWith('http://localhost')}
    />
  );
}
