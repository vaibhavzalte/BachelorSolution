'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Home, 
  Bed, 
  Users, 
  Key, 
  UtensilsCrossed, 
  Soup, 
  BookOpen, 
  Bookmark, 
  List, 
  MessageCircle, 
  User, 
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SIDEBAR_MIN_WIDTH = 60;
const SIDEBAR_MAX_WIDTH = 320;
const SIDEBAR_DEFAULT_WIDTH = 240;

const iconMap = {
  Home: Home,
  Bed: Bed,
  Users: Users,
  Key: Key,
  UtensilsCrossed: UtensilsCrossed,
  Soup: Soup,
  BookOpen: BookOpen,
  Bookmark: Bookmark,
  List: List,
  MessageCircle: MessageCircle,
  User: User,
  LogOut: LogOut,
};

interface MenuItem {
  name: string;
  iconName: keyof typeof iconMap;
  category?: ListingCategory | 'all';
}

const primaryMenuItems: MenuItem[] = [
  { name: 'Home',        iconName: 'Home',          category: 'all' },
  { name: 'Rooms',       iconName: 'Bed',            category: 'rooms' },
  { name: 'Roommates',   iconName: 'Users',          category: 'roommates' },
  { name: 'Vacancies',   iconName: 'Key',            category: 'study' },
  { name: 'Food Stalls', iconName: 'UtensilsCrossed', category: 'food' },
  { name: 'Mess',        iconName: 'Soup',           category: 'mess' },
  { name: 'Study Rooms', iconName: 'BookOpen',       category: 'study' },
];

const secondaryMenuItems: MenuItem[] = [
  { name: 'Saved',       iconName: 'Bookmark' },
  { name: 'My Listings', iconName: 'List' },
  { name: 'Messages',    iconName: 'MessageCircle' },
  { name: 'Profile',     iconName: 'User' },
  { name: 'Logout',      iconName: 'LogOut' },
];

interface SidebarInnerProps {
  isCollapsed: boolean;
  activeSidebarItem: string;
  onItemClick: (item: MenuItem) => void;
}

function SidebarInner({ isCollapsed, activeSidebarItem, onItemClick }: SidebarInnerProps) {
  return (
    <div className="flex h-full flex-col justify-between bg-white py-5 dark:bg-zinc-950 overflow-y-auto">
      <div className="flex flex-col gap-6 px-3">
        {/* Primary Navigation */}
        <nav className="flex flex-col gap-0.5">
          {primaryMenuItems.map((item) => {
            const Icon = iconMap[item.iconName];
            const isActive = activeSidebarItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onItemClick(item)}
                className={cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all duration-150',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-slate-100'
                )}
                title={item.name}
              >
                <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-[var(--sidebar-active-text)]' : 'text-slate-400')} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-zinc-800" />

        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-0.5">
          {secondaryMenuItems.map((item) => {
            const Icon = iconMap[item.iconName];
            const isActive = activeSidebarItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onItemClick(item)}
                className={cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all duration-150',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-slate-100'
                )}
                title={item.name}
              >
                <Icon className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-[var(--sidebar-active-text)]' : 'text-slate-400')} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card */}
      {!isCollapsed && (
        <div className="mx-3 mt-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 border border-blue-100/50 dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800">
          <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
            Find your perfect living space
          </h4>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            Connect with verified bachelors in Pune
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700">
            Explore Now <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { 
    activeSidebarItem, 
    setActiveSidebarItem,
    setActiveCategory,
    mobileSidebarOpen, 
    setMobileSidebarOpen 
  } = useLayoutStore();

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(SIDEBAR_DEFAULT_WIDTH);

  const isCollapsed = sidebarWidth <= SIDEBAR_MIN_WIDTH + 20;

  const handleItemClick = useCallback((item: MenuItem) => {
    setActiveSidebarItem(item.name);
    if (item.category) setActiveCategory(item.category);
    setMobileSidebarOpen(false);
  }, [setActiveSidebarItem, setActiveCategory, setMobileSidebarOpen]);

  // Mouse resize handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, startWidth.current + delta));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Desktop + Tablet: Resizable Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className="relative sticky top-[69px] hidden h-[calc(100vh-69px)] border-r border-[var(--border)] bg-white dark:bg-zinc-950 md:block shrink-0 transition-none"
      >
        <SidebarInner
          isCollapsed={isCollapsed}
          activeSidebarItem={activeSidebarItem}
          onItemClick={handleItemClick}
        />

        {/* Drag Handle */}
        <div
          onMouseDown={onMouseDown}
          className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize group z-10 flex items-center justify-center"
          title="Drag to resize"
        >
          {/* Visible resize indicator line */}
          <div className="w-0.5 h-full group-hover:bg-blue-400 transition-colors duration-150 bg-transparent" />
          {/* Drag pill */}
          <div className="absolute h-10 w-1 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors duration-150 opacity-0 group-hover:opacity-100" />
        </div>
      </aside>

      {/* Mobile: Drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0" showCloseButton={true}>
          <div className="flex h-full flex-col">
            {/* Drawer Header */}
            <div className="flex items-center gap-2 px-5 pt-5 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-full w-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 15.541A2.286 2.286 0 003 17.65V19.5h18v-1.85a2.286 2.286 0 00-1.263-2.109M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Batchelor<span className="text-blue-600">Solution</span>
                </p>
                <p className="text-[8px] font-semibold tracking-wider text-slate-400">PREMIUM LIVING</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarInner
                isCollapsed={false}
                activeSidebarItem={activeSidebarItem}
                onItemClick={handleItemClick}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
