'use client';

import React from 'react';
import {
  Bed,
  House,
  Users,
  UtensilsCrossed,
  Soup,
  BookOpen,
  Key,
  ImageIcon,
  LucideIcon,
} from 'lucide-react';
import { ListingCategory } from '@/types/listing.types';
import { cn } from '@/lib/utils';

interface ListingMediaPlaceholderProps {
  category?: ListingCategory;
  className?: string;
}

const categoryPlaceholderConfig: Record<
  ListingCategory,
  {
    icon: LucideIcon;
    gradient: string;
    iconWrap: string;
    iconColor: string;
    ring: string;
    decor: string;
  }
> = {
  rooms: {
    icon: House,
    gradient: 'from-indigo-50 via-blue-50/90 to-indigo-100/70 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-indigo-900/20',
    iconWrap: 'bg-indigo-500 dark:bg-indigo-600',
    iconColor: 'text-white',
    ring: 'ring-indigo-200/60 dark:ring-indigo-500/30',
    decor: 'bg-indigo-300/25 dark:bg-indigo-400/10',
  },
  roommates: {
    icon: Users,
    gradient: 'from-emerald-50 via-teal-50/90 to-emerald-100/70 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-900/20',
    iconWrap: 'bg-emerald-500 dark:bg-emerald-600',
    iconColor: 'text-white',
    ring: 'ring-emerald-200/60 dark:ring-emerald-500/30',
    decor: 'bg-emerald-300/25 dark:bg-emerald-400/10',
  },
  food: {
    icon: UtensilsCrossed,
    gradient: 'from-pink-50 via-rose-50/90 to-pink-100/70 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-pink-900/20',
    iconWrap: 'bg-pink-500 dark:bg-pink-600',
    iconColor: 'text-white',
    ring: 'ring-pink-200/60 dark:ring-pink-500/30',
    decor: 'bg-pink-300/25 dark:bg-pink-400/10',
  },
  mess: {
    icon: Soup,
    gradient: 'from-amber-50 via-orange-50/90 to-amber-100/70 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20',
    iconWrap: 'bg-amber-500 dark:bg-amber-600',
    iconColor: 'text-white',
    ring: 'ring-amber-200/60 dark:ring-amber-500/30',
    decor: 'bg-amber-300/25 dark:bg-amber-400/10',
  },
  study: {
    icon: BookOpen,
    gradient: 'from-sky-50 via-cyan-50/90 to-sky-100/70 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-sky-900/20',
    iconWrap: 'bg-sky-500 dark:bg-sky-600',
    iconColor: 'text-white',
    ring: 'ring-sky-200/60 dark:ring-sky-500/30',
    decor: 'bg-sky-300/25 dark:bg-sky-400/10',
  },
  vacancies: {
    icon: Key,
    gradient: 'from-violet-50 via-purple-50/90 to-violet-100/70 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-violet-900/20',
    iconWrap: 'bg-violet-500 dark:bg-violet-600',
    iconColor: 'text-white',
    ring: 'ring-violet-200/60 dark:ring-violet-500/30',
    decor: 'bg-violet-300/25 dark:bg-violet-400/10',
  },
};

export default function ListingMediaPlaceholder({
  category = 'rooms',
  className,
}: ListingMediaPlaceholderProps) {
  const objConfig = categoryPlaceholderConfig[category] ?? categoryPlaceholderConfig.rooms;
  const Icon = objConfig.icon;

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br',
        objConfig.gradient,
        className,
      )}
      aria-label="No image available"
    >
      <div className={cn('absolute -top-3 -right-3 h-14 w-14 rounded-full blur-2xl', objConfig.decor)} />
      <div className={cn('absolute -bottom-4 -left-4 h-16 w-16 rounded-full blur-2xl', objConfig.decor)} />

      <div className="relative flex flex-col items-center gap-1.5">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ring-4',
            objConfig.iconWrap,
            objConfig.ring,
          )}
        >
          <Icon className={cn('h-7 w-7', objConfig.iconColor)} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/70 dark:bg-zinc-900/60 px-2 py-0.5 backdrop-blur-sm">
          <ImageIcon className="h-2.5 w-2.5 text-slate-400" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            No photo
          </span>
        </div>
      </div>
    </div>
  );
}
