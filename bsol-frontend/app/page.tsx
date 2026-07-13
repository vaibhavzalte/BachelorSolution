import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import CategoryFilters from '@/components/listing/CategoryFilters';
import ListingFeed from '@/components/listing/ListingFeed';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--feed-bg)] dark:bg-zinc-950 font-sans">
      {/* ── Top Navbar ─────────────────────────────────────── */}
      <Navbar />

      {/* ── Full-width body: [Left Sidebar] + [Right portion] */}
      <div className="flex w-full flex-1 items-stretch">

        {/* Left Sidebar — resizable */}
        <Sidebar />

        {/* Right portion: sticky filter bar on top, feed + right sidebar below */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* ── Sticky filter bar — spans above feed AND Browse Categories */}
          <div className="sticky top-[69px] z-30 bg-[var(--feed-bg)]/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 px-3 md:px-5 py-2.5">
            <CategoryFilters />
          </div>

          {/* ── Feed + Right sidebar */}
          <div className="flex flex-1 items-stretch min-w-0">
            <main className="flex-1 px-3 md:px-5 py-4 flex flex-col gap-4 min-w-0">
              <ListingFeed />
            </main>
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
