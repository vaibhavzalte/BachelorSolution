import { create } from 'zustand';
import { ListingCategory } from '@/types/listing.types';
import { CategoryFiltersState, CategoryFilterValues } from '@/types/filter.types';

interface LayoutState {
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
  activeCategory: ListingCategory | 'all';
  setActiveCategory: (category: ListingCategory | 'all') => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilters: CategoryFiltersState;
  setCategoryFilters: (category: ListingCategory, filters: CategoryFilterValues) => void;
  clearCategoryFilters: (category: ListingCategory) => void;
  clearAllFilters: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeSidebarItem: 'Home',
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
  activeCategory: 'rooms',
  setActiveCategory: (category) => set({ activeCategory: category }),
  selectedLocation: 'Pune',
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  selectedTime: 'Any Time',
  setSelectedTime: (time) => set({ selectedTime: time }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  categoryFilters: {},
  setCategoryFilters: (category, filters) =>
    set((state) => ({
      categoryFilters: { ...state.categoryFilters, [category]: filters },
    })),
  clearCategoryFilters: (category) =>
    set((state) => {
      const objUpdated = { ...state.categoryFilters };
      delete objUpdated[category];
      return { categoryFilters: objUpdated };
    }),
  clearAllFilters: () =>
    set({
      selectedLocation: 'Pune',
      selectedTime: 'Any Time',
      searchQuery: '',
      categoryFilters: {},
    }),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
}));
