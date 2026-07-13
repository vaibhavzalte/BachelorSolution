'use client';

import React from 'react';
import { Listing } from '@/types/listing.types';
import RoomListingCard from '@/components/cards/RoomListingCard';
import GenericListingCard from '@/components/cards/GenericListingCard';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  if (listing.category === 'rooms') {
    return <RoomListingCard listing={listing} />;
  }

  return <GenericListingCard listing={listing} />;
}
