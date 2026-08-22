'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import CategoryFilters from '@/components/listing/CategoryFilters';

interface AppShellProps {
  children: React.ReactNode;
  showCategoryFilters?: boolean;
}

export default function AppShell({
  children,
  showCategoryFilters = true,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--feed-bg)] dark:bg-zinc-950 font-sans">
      <Navbar />

      <div className="flex w-full flex-1 items-stretch">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          {showCategoryFilters && (
            <div className="sticky top-[69px] z-30 border-b border-slate-100 bg-[var(--feed-bg)]/95 px-3 py-2.5 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/95 md:px-5">
              <CategoryFilters />
            </div>
          )}

          <div className="flex min-w-0 flex-1 items-stretch">
            <main className="flex min-w-0 flex-1 flex-col gap-4 px-3 py-4 md:px-5">
              {children}
            </main>
            {showCategoryFilters && <RightSidebar />}
          </div>
        </div>
      </div>
    </div>
  );
}
