"use client";

import { useState } from "react";
import { Search, MapPin, Building2, Zap, Utensils, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { id: "rooms", label: "Find Rooms", icon: Building2 },
  { id: "vacancies", label: "Room Vacancy", icon: Zap },
  { id: "food", label: "Food Stalls", icon: Utensils },
];

export default function SearchFilter() {
  const [selectedCategory, setSelectedCategory] = useState("vacancies");
  const [location, setLocation] = useState("");

  return (
    <div className="w-full max-w-5xl mx-auto -mt-10 relative z-20 px-6">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-3 md:p-4 flex flex-col items-stretch gap-4 md:gap-2">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl w-fit">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isSelected 
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                    : "text-foreground/50 hover:text-foreground hover:bg-white/50"}
                `}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-foreground/40"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Location Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
              <MapPin className="w-5 h-5 text-foreground/30 group-focus-within:text-primary" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you looking? (e.g. Pune, Mumbai...)"
              className="w-full h-16 pl-14 pr-6 bg-slate-50/50 border border-slate-200/60 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-base font-medium placeholder:text-foreground/30 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.05)]"
            />
          </div>

          {/* Quick Filters (Simplified representation) */}
          <div className="hidden lg:flex items-center gap-2 px-4 border-l border-slate-100">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-foreground/60 whitespace-nowrap">
              Price Range <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-foreground/60 whitespace-nowrap">
              Property Type <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Search Button */}
          <button className="h-16 px-10 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center justify-center gap-2 group">
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Suggested Locations/Labels */}
      <div className="flex flex-wrap items-center justify-center mt-6 gap-6 text-sm">
        <span className="text-foreground/40 font-medium uppercase tracking-wider text-[10px]">Popular Searches:</span>
        {["Kothrud", "Aundh", "Hinjewadi", "Viman Nagar"].map((loc) => (
          <button key={loc} className="text-foreground/60 hover:text-primary font-medium transition-colors">
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}
