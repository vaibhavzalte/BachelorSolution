'use client';

import React from 'react';
import { getAvatarColors, getInitials, formatDisplayName } from '@/lib/avatar.utils';
import { cn } from '@/lib/utils';

interface OwnerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  verified?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 w-10 text-[10px]',
  md: 'h-12 w-12 sm:h-14 sm:w-14 text-xs sm:text-sm',
  lg: 'h-16 w-16 text-sm',
};

export default function OwnerAvatar({
  name,
  size = 'md',
  showName = false,
  verified = false,
  className,
}: OwnerAvatarProps) {
  const objColors = getAvatarColors(name);
  const strInitials = getInitials(name);
  const strDisplayName = formatDisplayName(name);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 border-white font-bold shadow-soft dark:border-zinc-800 shrink-0',
          sizeClasses[size],
        )}
        style={{ backgroundColor: objColors.bg, color: objColors.text }}
        aria-label={`${strDisplayName} avatar`}
      >
        {strInitials}
      </div>
      {showName && (
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
            {strDisplayName}
          </span>
          {verified && (
            <span className="text-[9px] font-semibold text-emerald-600 mt-0.5">Verified</span>
          )}
        </div>
      )}
    </div>
  );
}
