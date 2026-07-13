'use client';

import React from 'react';
import { ArrowRight, Bed, Users, Key, UtensilsCrossed, Soup, BookOpen, Plus } from 'lucide-react';
import { SIDEBAR_CATEGORIES, SIDEBAR_LOCATIONS } from '@/constants/sidebar.config';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';
import { cn } from '@/lib/utils';

const iconMap = {
  Bed: Bed,
  Users: Users,
  Key: Key,
  UtensilsCrossed: UtensilsCrossed,
  Soup: Soup,
  BookOpen: BookOpen,
};

// Colors matching categories exactly
const categoryColors = {
  rooms: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400' },
  roommates: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
  food: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400' },
  mess: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' },
  study: { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-600 dark:text-sky-400' },
  vacancies: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' },
};

export default function RightSidebar() {
  const { setActiveCategory, setSelectedLocation } = useLayoutStore();

  const handleCategoryClick = (categoryId: ListingCategory | 'all') => {
    setActiveCategory(categoryId);
  };

  return (
    <aside className="sticky top-[117px] hidden h-[calc(100vh-117px)] w-72 flex-col gap-5 overflow-y-auto bg-white p-4 dark:bg-zinc-950 xl:flex border-l border-[var(--border)] shrink-0">
      {/* Browse Categories Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-soft">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-4">
          Browse Categories
        </h3>
        
        <div className="flex flex-col gap-3.5">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.iconName as keyof typeof iconMap] || Bed;
            const colors = categoryColors[cat.id as keyof typeof categoryColors] || categoryColors.rooms;
            
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex items-center justify-between text-left group hover:opacity-85 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", colors.bg)}>
                    <IconComponent className={cn("h-4 w-4", colors.text)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => handleCategoryClick('rooms')}
          className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all categories <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Popular Locations Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-soft">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-4">
          Popular Locations
        </h3>
        
        <div className="flex flex-col gap-3.5">
          {SIDEBAR_LOCATIONS.map((strLocation) => (
            <button
              key={strLocation}
              type="button"
              onClick={() => setSelectedLocation(strLocation)}
              className="flex items-center justify-between text-left hover:opacity-85 transition-opacity"
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {strLocation}
              </span>
            </button>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
          View all locations <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Post Your Listing Card */}
      <div className="rounded-2xl bg-indigo-50/50 p-5 dark:bg-zinc-900 border border-indigo-100/50 dark:border-zinc-800 shadow-soft">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
          Post your listing
        </h3>
        <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Reach thousands of bachelors looking for accommodations and services.
        </p>
        <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:text-blue-400 dark:hover:bg-zinc-700">
          Post Now <Plus className="h-4.5 w-4.5" />
        </button>
      </div>
    </aside>
  );
}
