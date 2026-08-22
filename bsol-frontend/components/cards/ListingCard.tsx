'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types/listing.types';
import RoomListingCard from '@/components/cards/RoomListingCard';
import GenericListingCard from '@/components/cards/GenericListingCard';
import { buildListingDetailPath } from '@/constants/listing-routes';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const strHref = buildListingDetailPath(listing.category, listing.id);

  return (
    <Link
      href={strHref}
      className="block w-full transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-3xl"
    >
      {listing.category === 'rooms' ? (
        <RoomListingCard listing={listing} />
      ) : (
        <GenericListingCard listing={listing} />
      )}
    </Link>
  );
}
