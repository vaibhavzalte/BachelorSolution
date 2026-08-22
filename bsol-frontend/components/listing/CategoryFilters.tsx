'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bed,
  Users,
  Key,
  UtensilsCrossed,
  Soup,
  BookOpen,
  SlidersHorizontal,
  Clock,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';
import { CATEGORY_FILTER_CONFIGS } from '@/constants/listing-filters.config';
import { countActiveFilters, getCategoryFilters } from '@/lib/filter.utils';
import ListingFiltersSheet from '@/components/listing/ListingFiltersSheet';
import { LISTING_ROUTES, getRouteByCategory } from '@/constants/listing-routes';
import { cn } from '@/lib/utils';

const iconMap = {
  rooms: { icon: Bed, color: 'text-indigo-500' },
  roommates: { icon: Users, color: 'text-emerald-500' },
  vacancies: { icon: Key, color: 'text-amber-500' },
  food: { icon: UtensilsCrossed, color: 'text-sky-500' },
  mess: { icon: Soup, color: 'text-orange-500' },
  study: { icon: BookOpen, color: 'text-teal-500' },
};

export default function CategoryFilters() {
  const router = useRouter();
  const [boolFiltersOpen, setBoolFiltersOpen] = useState(false);

  const {
    activeCategory,
    selectedLocation,
    setSelectedLocation,
    selectedTime,
    setSelectedTime,
    categoryFilters,
  } = useLayoutStore();

  const strCategory = activeCategory === 'all' ? 'rooms' : activeCategory;
  const objActiveFilters = useMemo(
    () => getCategoryFilters(categoryFilters, strCategory as ListingCategory),
    [categoryFilters, strCategory],
  );
  const intFilterCount = countActiveFilters(
    objActiveFilters,
    CATEGORY_FILTER_CONFIGS[strCategory as ListingCategory],
  );

  const handleCategoryClick = (strNextCategory: ListingCategory) => {
    router.push(getRouteByCategory(strNextCategory).path);
  };

  return (
    <>
      <div className="flex w-full flex-nowrap items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        <div className="flex shrink-0 flex-nowrap items-center gap-2">
          {LISTING_ROUTES.map((objRoute) => {
            const iconConfig = iconMap[objRoute.category];
            const Icon = iconConfig?.icon ?? null;
            const iconColor = iconConfig?.color ?? '';
            const isActive = activeCategory === objRoute.category;

            return (
              <button
                key={objRoute.slug}
                type="button"
                onClick={() => handleCategoryClick(objRoute.category)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold transition-all duration-150',
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-soft'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:bg-zinc-800',
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5 shrink-0',
                      isActive ? 'text-white' : iconColor,
                    )}
                  />
                )}
                <span>{objRoute.label}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-2 pl-7 pr-7 text-[11px] font-bold text-slate-700 shadow-soft focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300"
            >
              <option>Pune</option>
              <option>Wakad</option>
              <option>Hinjawadi</option>
              <option>Baner</option>
              <option>Aundh</option>
            </select>
            <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative hidden sm:block">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-2 pl-7 pr-7 text-[11px] font-bold text-slate-700 shadow-soft focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300"
            >
              <option>Any Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={() => setBoolFiltersOpen(true)}
            className={cn(
              'relative flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-white px-3.5 py-2 text-[11px] font-bold text-slate-700 shadow-soft transition-colors hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300',
              intFilterCount > 0
                ? 'border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300'
                : 'border-slate-200 dark:border-zinc-800',
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Filters</span>
            {intFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {intFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <ListingFiltersSheet open={boolFiltersOpen} onOpenChange={setBoolFiltersOpen} />
    </>
  );
}
