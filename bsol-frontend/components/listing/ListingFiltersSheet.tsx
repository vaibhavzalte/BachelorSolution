'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { ListingCategory } from '@/types/listing.types';
import { CategoryFilterValues } from '@/types/filter.types';
import {
  CATEGORY_FILTER_CONFIGS,
  getDefaultCategoryFilters,
} from '@/constants/listing-filters.config';
import { countActiveFilters } from '@/lib/filter.utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ListingFiltersSheetProps {
  open: boolean;
  onOpenChange: (boolOpen: boolean) => void;
}

export default function ListingFiltersSheet({ open, onOpenChange }: ListingFiltersSheetProps) {
  const {
    activeCategory,
    categoryFilters,
    setCategoryFilters,
    clearCategoryFilters,
  } = useLayoutStore();

  const strCategory = activeCategory === 'all' ? 'rooms' : activeCategory;
  const arrFieldConfig = CATEGORY_FILTER_CONFIGS[strCategory as ListingCategory];

  const objAppliedFilters = useMemo(
    () => categoryFilters[strCategory as ListingCategory] ?? getDefaultCategoryFilters(strCategory as ListingCategory),
    [categoryFilters, strCategory],
  );

  const [objDraftFilters, setObjDraftFilters] = useState<CategoryFilterValues>(objAppliedFilters);

  useEffect(() => {
    if (open) {
      setObjDraftFilters(objAppliedFilters);
    }
  }, [open, objAppliedFilters]);

  const intActiveCount = countActiveFilters(objAppliedFilters, arrFieldConfig);

  const handleSelectChange = (strFieldId: string, strValue: string) => {
    setObjDraftFilters((objPrev) => ({ ...objPrev, [strFieldId]: strValue }));
  };

  const handleNumberChange = (strFieldId: string, strValue: string) => {
    setObjDraftFilters((objPrev) => ({ ...objPrev, [strFieldId]: strValue }));
  };

  const handleCheckboxToggle = (strFieldId: string, strValue: string) => {
    setObjDraftFilters((objPrev) => {
      const arrCurrent = Array.isArray(objPrev[strFieldId]) ? (objPrev[strFieldId] as string[]) : [];
      const arrUpdated = arrCurrent.includes(strValue)
        ? arrCurrent.filter((strItem) => strItem !== strValue)
        : [...arrCurrent, strValue];
      return { ...objPrev, [strFieldId]: arrUpdated };
    });
  };

  const handleApply = () => {
    setCategoryFilters(strCategory as ListingCategory, objDraftFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const objDefaults = getDefaultCategoryFilters(strCategory as ListingCategory);
    setObjDraftFilters(objDefaults);
    clearCategoryFilters(strCategory as ListingCategory);
    onOpenChange(false);
  };

  const strCategoryLabel = strCategory.charAt(0).toUpperCase() + strCategory.slice(1);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm flex flex-col p-0"
        overlayClassName="bg-transparent backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
      >
        <SheetHeader className="border-b border-slate-100 dark:border-zinc-800">
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            {strCategoryLabel} Filters
          </SheetTitle>
          <SheetDescription>
            Refine results based on {strCategoryLabel.toLowerCase()} listing details.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {arrFieldConfig.map((objField) => (
            <div key={objField.id} className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                {objField.label}
              </label>

              {objField.type === 'select' && (
                <select
                  value={String(objDraftFilters[objField.id] ?? 'Any')}
                  onChange={(objEvent) => handleSelectChange(objField.id, objEvent.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {objField.options?.map((objOption) => (
                    <option key={`${objField.id}-${objOption.value}`} value={objOption.value}>
                      {objOption.label}
                    </option>
                  ))}
                </select>
              )}

              {objField.type === 'number' && (
                <input
                  type="number"
                  min={0}
                  value={String(objDraftFilters[objField.id] ?? '')}
                  onChange={(objEvent) => handleNumberChange(objField.id, objEvent.target.value)}
                  placeholder={objField.placeholder}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}

              {objField.type === 'checkbox-group' && (
                <div className="flex flex-wrap gap-2">
                  {objField.options?.map((objOption) => {
                    const arrSelected = Array.isArray(objDraftFilters[objField.id])
                      ? (objDraftFilters[objField.id] as string[])
                      : [];
                    const boolIsSelected = arrSelected.includes(objOption.value);

                    return (
                      <button
                        key={objOption.value}
                        type="button"
                        onClick={() => handleCheckboxToggle(objField.id, objOption.value)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-[11px] font-bold border transition-colors',
                          boolIsSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:border-blue-300',
                        )}
                      >
                        {objOption.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <SheetFooter className="border-t border-slate-100 dark:border-zinc-800 flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters{intActiveCount > 0 ? ` (${intActiveCount})` : ''}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
