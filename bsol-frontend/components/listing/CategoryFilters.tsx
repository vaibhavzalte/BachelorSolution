'use client';

import React, { useMemo, useState } from 'react';
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
  ChevronDown 
} from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';
import { CATEGORY_FILTER_CONFIGS } from '@/constants/listing-filters.config';
import { countActiveFilters, getCategoryFilters } from '@/lib/filter.utils';
import ListingFiltersSheet from '@/components/listing/ListingFiltersSheet';
import { cn } from '@/lib/utils';
const iconMap = {
  rooms:      { icon: Bed,             color: 'text-indigo-500' },
  roommates:  { icon: Users,           color: 'text-emerald-500' },
  vacancies:  { icon: Key,             color: 'text-amber-500' },
  food:       { icon: UtensilsCrossed, color: 'text-sky-500' },
  mess:       { icon: Soup,            color: 'text-orange-500' },
  study:      { icon: BookOpen,        color: 'text-teal-500' },
};

interface FilterTab {
  name: string;
  id: ListingCategory;
  iconName?: keyof typeof iconMap;
}

const filterTabs: FilterTab[] = [
  { name: 'Rooms',        id: 'rooms',      iconName: 'rooms' },
  { name: 'Roommates',    id: 'roommates',  iconName: 'roommates' },
  { name: 'Vacancies',    id: 'vacancies',  iconName: 'vacancies' },
  { name: 'Food Stalls',  id: 'food',       iconName: 'food' },
  { name: 'Mess',         id: 'mess',       iconName: 'mess' },
  { name: 'Study Rooms',  id: 'study',      iconName: 'study' },
];

export default function CategoryFilters() {
  const [boolFiltersOpen, setBoolFiltersOpen] = useState(false);

  const { 
    activeCategory, 
    setActiveCategory,
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

  return (
    <>
    <div className="flex items-center justify-between gap-3 w-full overflow-x-auto scrollbar-none flex-nowrap">      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 flex-nowrap shrink-0">
        {filterTabs.map((tab) => {
          const iconConfig = tab.iconName ? iconMap[tab.iconName] : null;
          const Icon = iconConfig?.icon ?? null;
          const iconColor = iconConfig?.color ?? '';
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold whitespace-nowrap transition-all duration-150 shrink-0',
                isActive
                  ? 'bg-blue-600 text-white shadow-soft'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 dark:bg-zinc-900 dark:text-slate-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
              )}
            >
              {Icon && (
                <Icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-white' : iconColor)} />
              )}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Right-side filter dropdowns */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Location */}
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="appearance-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-full pl-7 pr-7 py-2 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer shadow-soft"
          >
            <option>Pune</option>
            <option>Wakad</option>
            <option>Hinjawadi</option>
            <option>Baner</option>
            <option>Aundh</option>
          </select>
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Any Time */}
        <div className="relative">
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="appearance-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-full pl-7 pr-7 py-2 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer shadow-soft"
          >
            <option>Any Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Filters */}
        <button
          type="button"
          onClick={() => setBoolFiltersOpen(true)}
          className={cn(
            'relative flex items-center gap-1.5 bg-white dark:bg-zinc-900 border text-slate-700 dark:text-slate-300 rounded-full px-3.5 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors shadow-soft whitespace-nowrap',
            intFilterCount > 0
              ? 'border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
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