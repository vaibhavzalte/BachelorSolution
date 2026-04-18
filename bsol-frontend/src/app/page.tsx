"use client";

import { useState, useEffect, useCallback } from "react";
import SearchFilter from "@/components/SearchFilter";
import ListingCard from "@/components/ListingCard";
import CreateListingModal from "@/components/CreateListingModal";
import { getListings, AnyListing, ListingType } from "@/lib/api";
import { Plus, House, CookingPot, Utensils, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCategory } from "@/contexts/CategoryContext";

// Mapping from category context IDs ➜ backend ListingType
const CATEGORY_TO_TYPE: Record<string, ListingType | null> = {
  all:          null,        // fetch all types
  rooms:        "room",
  mess:         "Mess",
  food:         "food-stall",
  vacancies:    null,
  roommate:     null,
  "study-rooms": null,
};

const ALL_TYPES: ListingType[] = ["room", "Mess", "food-stall"];

interface TypedListing {
  type: ListingType;
  data: AnyListing;
}

// ────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { activeCategory } = useCategory();
  const [listings, setListings] = useState<TypedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const mappedType = CATEGORY_TO_TYPE[activeCategory];

      if (mappedType !== null && mappedType !== undefined) {
        // Fetch only the selected type
        const items = await getListings(mappedType);
        setListings(items.map((d) => ({ type: mappedType, data: d })));
      } else if (activeCategory === "all") {
        // Fetch all types in parallel
        const results = await Promise.allSettled(
          ALL_TYPES.map((t) => getListings(t))
        );
        const merged: TypedListing[] = [];
        ALL_TYPES.forEach((t, i) => {
          const r = results[i];
          if (r.status === "fulfilled") {
            r.value.forEach((d) => merged.push({ type: t, data: d }));
          }
        });
        setListings(merged);
      } else {
        // Category has no backend type yet (vacancies, roommate, study-rooms)
        setListings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const mappedType = CATEGORY_TO_TYPE[activeCategory];
  const hasBackendType = mappedType !== null && mappedType !== undefined;
  const isAllCategory = activeCategory === "all";

  // Default modal type based on active category
  const defaultModalType: ListingType =
    hasBackendType ? (mappedType as ListingType) : "room";

  return (
    <>
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchListings}
      />

      <div className="flex flex-col pb-24">
        <SearchFilter />

        {/* ── Section Header ─────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 mt-4 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {loading ? "Loading listings…" : listings.length > 0 ? `${listings.length} listing${listings.length !== 1 ? "s" : ""} found` : "No listings yet"}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {isAllCategory ? "All categories" : `Showing: ${activeCategory}`}
              </p>
            </div>

            {/* Post Listing CTA */}
            <button
              id="post-listing-btn"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Post Listing
            </button>
          </div>

          {/* ── States ───────────────────────────────────────────────── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <p className="text-gray-400 font-semibold text-sm">Fetching listings from database…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-black text-base">Could not connect to backend</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={fetchListings}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="flex gap-3">
                {[House, CookingPot, Utensils].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-black text-lg">No listings here yet</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                  Be the first to post a room, mess, or food stall in this category.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Post First Listing
              </button>
            </div>
          )}

          {/* ── Listings Grid ─────────────────────────────────────────── */}
          {!loading && !error && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((item, idx) => (
                <ListingCard key={idx} type={item.type} data={item.data} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
