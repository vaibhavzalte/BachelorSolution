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
  defaultCity: string;
  defaultTime: string;
  applyMasterDefaults: (strCity: string, strTime: string) => void;
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
  activeSidebarItem: 'home',
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
  activeCategory: 'rooms',
  setActiveCategory: (category) => set({ activeCategory: category }),
  selectedLocation: '',
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  selectedTime: '',
  setSelectedTime: (time) => set({ selectedTime: time }),
  defaultCity: '',
  defaultTime: '',
  applyMasterDefaults: (strCity, strTime) =>
    set((state) => ({
      defaultCity: strCity,
      defaultTime: strTime,
      selectedLocation: state.selectedLocation || strCity,
      selectedTime: state.selectedTime || strTime,
    })),
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
    set((state) => ({
      selectedLocation: state.defaultCity,
      selectedTime: state.defaultTime,
      searchQuery: '',
      categoryFilters: {},
    })),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
}));

