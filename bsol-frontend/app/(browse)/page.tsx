import { redirect } from 'next/navigation';
import { DEFAULT_LISTING_ROUTE } from '@/constants/listing-routes';

export default function BrowseHomePage() {
  redirect(DEFAULT_LISTING_ROUTE.path);
}
