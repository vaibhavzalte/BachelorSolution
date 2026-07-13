'use client';

import React from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, Bell, MessageSquare, Menu } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { 
    selectedLocation, 
    setSelectedLocation, 
    searchQuery, 
    setSearchQuery, 
    setMobileSidebarOpen 
  } = useLayoutStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-white px-3 py-3 md:px-5">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Side: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="flex md:hidden text-[var(--foreground)]"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 text-white shadow-soft">
              {/* Custom building graduation cap SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-full w-full"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 15.541A2.286 2.286 0 0 0 3 17.65V19.5h18v-1.85a2.286 2.286 0 0 0-1.263-2.109m-16.474 0a5.216 5.216 0 0 1 1.637-2.316l3.856-3.856a2.286 2.286 0 0 0 0-3.232l-.21-.21a2.286 2.286 0 0 0-3.232 0l-3.856 3.856a5.216 5.216 0 0 1-2.316 1.637m16.474 0a5.216 5.216 0 0 0-1.637-2.316l-3.856-3.856a2.286 2.286 0 0 1 0-3.232l.21-.21a2.286 2.286 0 0 1 3.232 0l3.856 3.856a5.216 5.216 0 0 0 2.316 1.637M12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-none tracking-tight text-slate-800 dark:text-slate-100">
                Batchelor<span className="text-blue-600">Solution</span>
              </span>
              <span className="text-[9px] font-semibold leading-none tracking-wider text-slate-400">
                PREMIUM LIVING
              </span>
            </div>
          </div>
        </div>

        {/* Search & Location Bar (Hidden on Mobile, flex on desktop) */}
        <div className="hidden max-w-xl flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-slate-50 p-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 md:flex">
          {/* Location selector */}
          <div className="flex items-center gap-1.5 px-3 border-r border-[var(--border)] text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{selectedLocation}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          {/* Input field */}
          <input
            type="text"
            placeholder="Search for rooms, flatmates, food, mess..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
          />

          {/* Search Button */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Side: Post Listing & User Icons */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            className="rounded-full bg-[var(--primary)] px-5 text-xs font-semibold text-white hover:bg-blue-600 shadow-soft hidden sm:flex items-center gap-1.5"
            size="sm"
          >
            <span className="text-sm font-bold">+</span> Post Listing
          </Button>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </Button>
          </div>

          {/* User Profile Avatar */}
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--border)] shadow-soft">
            <Image
              src="/images/avatar_rahul.png"
              alt="User Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Mobile search bar (only visible on mobile) */}
      <div className="mt-3 flex items-center gap-2 rounded-full border border-[var(--border)] bg-slate-50 p-1.5 md:hidden">
        <MapPin className="h-4 w-4 ml-2 text-slate-400" />
        <input
          type="text"
          placeholder="Search rooms, flatmates, food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent px-1 text-xs text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-white">
          <Search className="h-3 w-3" />
        </button>
      </div>
    </header>
  );
}
