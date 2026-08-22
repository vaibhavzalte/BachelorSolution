import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingDetailClient from '@/components/listing/ListingDetailClient';
import CategorySync from '@/components/listing/CategorySync';
import {
  getRouteBySlug,
  isValidListingSlug,
} from '@/constants/listing-routes';

interface ListingDetailPageProps {
  params: Promise<{ type: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { type, id } = await params;
  const objRoute = getRouteBySlug(type);
  return {
    title: `${objRoute?.label ?? 'Listing'} #${id} | BachelorSolution`,
    description: `View ${objRoute?.label?.toLowerCase() ?? 'listing'} details on BachelorSolution.`,
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { type, id } = await params;

  if (!isValidListingSlug(type) || id === 'new') {
    notFound();
  }

  const objRoute = getRouteBySlug(type);
  if (!objRoute) {
    notFound();
  }

  return (
    <>
      <CategorySync category={objRoute.category} />
      <ListingDetailClient category={objRoute.category} id={id} />
    </>
  );
}
