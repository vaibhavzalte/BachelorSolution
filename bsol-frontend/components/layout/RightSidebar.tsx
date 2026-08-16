'use client';

import React from 'react';
import { ArrowRight, Plus, Heart, MapPin, Clock } from 'lucide-react';
import { SIDEBAR_LOCATIONS } from '@/constants/sidebar.config';
import { useLayoutStore } from '@/store/useLayoutStore';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { name: 'Post a Listing', icon: Plus, bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'Saved Listings', icon: Heart, bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400' },
  { name: 'Popular Areas', icon: MapPin, bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Recently Viewed', icon: Clock, bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' },
] as const;

export default function RightSidebar() {
  const { setSelectedLocation } = useLayoutStore();

  return (
    <aside className="sticky top-[117px] hidden h-[calc(100vh-117px)] w-72 flex-col gap-5 overflow-y-auto mr-10 p-4 dark:bg-zinc-950 xl:flex shrink-0">
      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-soft">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-4">
          Quick Actions
        </h3>
        
        <div className="flex flex-col gap-3.5">
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.name}
                type="button"
                className="flex items-center justify-between text-left group hover:opacity-85 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', action.bg)}>
                    <IconComponent className={cn('h-4 w-4', action.text)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {action.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
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

    </aside>
  );
}
