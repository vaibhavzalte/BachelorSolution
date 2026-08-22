'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';

interface CategorySyncProps {
  category: ListingCategory;
}

export default function CategorySync({ category }: CategorySyncProps) {
  const setActiveCategory = useLayoutStore((state) => state.setActiveCategory);
  const setActiveSidebarItem = useLayoutStore((state) => state.setActiveSidebarItem);

  useEffect(() => {
    setActiveCategory(category);
    setActiveSidebarItem('Home');
  }, [category, setActiveCategory, setActiveSidebarItem]);

  return null;
}
