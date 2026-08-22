import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingForm from '@/components/forms/ListingForm';
import CategorySync from '@/components/listing/CategorySync';
import {
  getRouteBySlug,
  isValidListingSlug,
} from '@/constants/listing-routes';

interface NewListingPageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({
  params,
}: NewListingPageProps): Promise<Metadata> {
  const { type } = await params;
  const objRoute = getRouteBySlug(type);
  return {
    title: `Post ${objRoute?.label ?? 'Listing'} | BachelorSolution`,
    description: `Create a new ${objRoute?.label?.toLowerCase() ?? 'listing'} on BachelorSolution.`,
  };
}

export default async function NewListingPage({ params }: NewListingPageProps) {
  const { type } = await params;

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
      <ListingForm category={objRoute.category} mode="create" />
    </>
  );
}
