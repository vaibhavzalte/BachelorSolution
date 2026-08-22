import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingEditClient from '@/components/listing/ListingEditClient';
import CategorySync from '@/components/listing/CategorySync';
import {
  getRouteBySlug,
  isValidListingSlug,
} from '@/constants/listing-routes';

interface EditListingPageProps {
  params: Promise<{ type: string; id: string }>;
}

export async function generateMetadata({
  params,
}: EditListingPageProps): Promise<Metadata> {
  const { type, id } = await params;
  const objRoute = getRouteBySlug(type);
  return {
    title: `Edit ${objRoute?.label ?? 'Listing'} #${id} | BachelorSolution`,
  };
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { type, id } = await params;

  if (!isValidListingSlug(type)) {
    notFound();
  }

  const objRoute = getRouteBySlug(type);
  if (!objRoute) {
    notFound();
  }

  return (
    <>
      <CategorySync category={objRoute.category} />
      <ListingEditClient category={objRoute.category} id={id} />
    </>
  );
}
