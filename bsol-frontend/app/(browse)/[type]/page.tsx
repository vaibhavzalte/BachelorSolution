import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingFeed from '@/components/listing/ListingFeed';
import {
  getRouteBySlug,
  isValidListingSlug,
  LISTING_ROUTES,
} from '@/constants/listing-routes';
import CategorySync from '@/components/listing/CategorySync';

interface ListingTypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return LISTING_ROUTES.map((objRoute) => ({ type: objRoute.slug }));
}

export async function generateMetadata({
  params,
}: ListingTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const objRoute = getRouteBySlug(type);

  if (!objRoute) {
    return { title: 'Listings | BachelorSolution' };
  }

  return {
    title: `${objRoute.label} in Pune | BachelorSolution`,
    description: `Browse verified ${objRoute.label.toLowerCase()} listings on BachelorSolution.`,
  };
}

export default async function ListingTypePage({ params }: ListingTypePageProps) {
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
      <ListingFeed />
    </>
  );
}
