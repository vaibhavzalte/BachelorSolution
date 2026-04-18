"use client";

import { useState, useEffect } from "react";
import {
  X,
  House,
  CookingPot,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createListing, ListingType } from "@/lib/api";

// ─── Type Tabs ─────────────────────────────────────────────────────────────

const TYPES: { id: ListingType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "room",       label: "Room",       icon: <House className="w-5 h-5" />,       color: "bg-indigo-500" },
  { id: "Mess",       label: "Mess",       icon: <CookingPot className="w-5 h-5" />,  color: "bg-amber-500" },
  { id: "food-stall", label: "Food Stall", icon: <Utensils className="w-5 h-5" />,    color: "bg-pink-500" },
];

// ─── Reusable input primitives ──────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300";

const selectCls = inputCls + " cursor-pointer";

// ─── Sub-forms ──────────────────────────────────────────────────────────────

function RoomForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <Field label="Title *">
          <input className={inputCls} placeholder='e.g. "Cozy 1BHK near College"' value={(data.title as string) || ""} onChange={e => set("title", e.target.value)} />
        </Field>
      </div>
      <Field label="Room Type">
        <select className={selectCls} value={(data.roomType as string) || ""} onChange={e => set("roomType", e.target.value)}>
          <option value="">Select type</option>
          {["1RK", "1BHK", "2BHK", "3BHK"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Available For">
        <select className={selectCls} value={(data.availableFor as string) || ""} onChange={e => set("availableFor", e.target.value)}>
          <option value="">Select</option>
          {["BOYS", "GIRLS", "FAMILY", "ANY"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Rent (₹/month)">
        <input type="number" className={inputCls} placeholder="e.g. 8000" value={(data.rent as string) || ""} onChange={e => set("rent", Number(e.target.value))} />
      </Field>
      <Field label="Deposit (₹)">
        <input type="number" className={inputCls} placeholder="e.g. 15000" value={(data.deposit as string) || ""} onChange={e => set("deposit", Number(e.target.value))} />
      </Field>
      <Field label="Area / Locality">
        <input className={inputCls} placeholder="e.g. Kothrud" value={(data.area as string) || ""} onChange={e => set("area", e.target.value)} />
      </Field>
      <Field label="City">
        <input className={inputCls} placeholder="e.g. Pune" value={(data.city as string) || ""} onChange={e => set("city", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Full Address">
          <input className={inputCls} placeholder="e.g. Flat 3B, Shree Apartments, FC Road" value={(data.address as string) || ""} onChange={e => set("address", e.target.value)} />
        </Field>
      </div>
      <Field label="Owner Name">
        <input className={inputCls} placeholder="Your name" value={(data.ownerName as string) || ""} onChange={e => set("ownerName", e.target.value)} />
      </Field>
      <Field label="Contact Number">
        <input className={inputCls} placeholder="+91 98765 43210" value={(data.ownerContact as string) || ""} onChange={e => set("ownerContact", e.target.value)} />
      </Field>
      {/* Amenities */}
      <div className="sm:col-span-2">
        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Amenities</label>
        <div className="flex flex-wrap gap-3">
          {(["wifi", "parking", "ac", "foodIncluded", "attachedBathroom", "furnished"] as const).map(k => (
            <button
              key={k}
              type="button"
              onClick={() => set(k, !data[k])}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all ${data[k] ? "bg-primary text-white border-primary shadow-lg" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-primary/30"}`}
            >
              {k.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea className={inputCls + " resize-none"} rows={3} placeholder="Brief description..." value={(data.description as string) || ""} onChange={e => set("description", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function MessForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <Field label="Mess Name *">
          <input className={inputCls} placeholder='e.g. "Shree Ganesh Mess"' value={(data.title as string) || ""} onChange={e => set("title", e.target.value)} />
        </Field>
      </div>
      <Field label="Food Type">
        <select className={selectCls} value={(data.foodType as string) || ""} onChange={e => set("foodType", e.target.value)}>
          <option value="">Select</option>
          {["VEG", "NON-VEG", "BOTH"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Meal Type">
        <select className={selectCls} value={(data.mealType as string) || ""} onChange={e => set("mealType", e.target.value)}>
          <option value="">Select</option>
          {["BREAKFAST", "LUNCH", "DINNER", "ALL"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Monthly Fee (₹)">
        <input type="number" className={inputCls} placeholder="3000" value={(data.monthlyFee as string) || ""} onChange={e => set("monthlyFee", Number(e.target.value))} />
      </Field>
      <Field label="Per Meal Fee (₹)">
        <input type="number" className={inputCls} placeholder="60" value={(data.perMealFee as string) || ""} onChange={e => set("perMealFee", Number(e.target.value))} />
      </Field>
      <Field label="Area">
        <input className={inputCls} placeholder="Kothrud" value={(data.area as string) || ""} onChange={e => set("area", e.target.value)} />
      </Field>
      <Field label="City">
        <input className={inputCls} placeholder="Pune" value={(data.city as string) || ""} onChange={e => set("city", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address">
          <input className={inputCls} placeholder="Full address" value={(data.address as string) || ""} onChange={e => set("address", e.target.value)} />
        </Field>
      </div>
      <Field label="Owner Name">
        <input className={inputCls} placeholder="Your name" value={(data.ownerName as string) || ""} onChange={e => set("ownerName", e.target.value)} />
      </Field>
      <Field label="Contact">
        <input className={inputCls} placeholder="+91 98765 43210" value={(data.ownerContact as string) || ""} onChange={e => set("ownerContact", e.target.value)} />
      </Field>
      <div className="sm:col-span-2 flex gap-4">
        {(["homeDelivery", "diningArea"] as const).map(k => (
          <button key={k} type="button" onClick={() => set(k, !data[k])}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all ${data[k] ? "bg-amber-500 text-white border-amber-500 shadow-lg" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-amber-500/30"}`}
          >{k.replace(/([A-Z])/g, " $1")}</button>
        ))}
      </div>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea className={inputCls + " resize-none"} rows={3} placeholder="Tell people what's special..." value={(data.description as string) || ""} onChange={e => set("description", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function FoodStallForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <Field label="Stall Name *">
          <input className={inputCls} placeholder='e.g. "Raj Vada Pav"' value={(data.stallName as string) || ""} onChange={e => set("stallName", e.target.value)} />
        </Field>
      </div>
      <Field label="Food Type">
        <select className={selectCls} value={(data.foodType as string) || ""} onChange={e => set("foodType", e.target.value)}>
          <option value="">Select</option>
          {["Veg", "Non-Veg", "Both"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Location / Area">
        <input className={inputCls} placeholder="Near Gate 2 / full address" value={(data.location as string) || ""} onChange={e => set("location", e.target.value)} />
      </Field>
      <Field label="Owner Name">
        <input className={inputCls} placeholder="Your name" value={(data.ownerName as string) || ""} onChange={e => set("ownerName", e.target.value)} />
      </Field>
      <Field label="Contact Number">
        <input className={inputCls} placeholder="+91 98765 43210" value={(data.contactNumber as string) || ""} onChange={e => set("contactNumber", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea className={inputCls + " resize-none"} rows={3} placeholder="Describe menu highlights, timings, etc." value={(data.description as string) || ""} onChange={e => set("description", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateListingModalProps) {
  const [activeType, setActiveType] = useState<ListingType>("room");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset when switching tab
  useEffect(() => {
    setFormData({});
    setStatus("idle");
    setErrorMsg("");
  }, [activeType]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await createListing(activeType, formData as never);
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
        setFormData({});
      }, 1500);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const activeTabData = TYPES.find(t => t.id === activeType)!;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`${activeTabData.color} px-8 py-6 text-white flex items-center justify-between shrink-0`}>
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Post a New Listing</p>
            <h2 className="text-2xl font-black">Create {activeTabData.label}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 px-8 pt-5 shrink-0">
          {TYPES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveType(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all border-2 ${
                activeType === t.id
                  ? `${t.color} text-white border-transparent shadow-lg`
                  : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-8 py-6 overflow-y-auto flex-1">
            {activeType === "room" && <RoomForm data={formData} onChange={setFormData} />}
            {activeType === "Mess" && <MessForm data={formData} onChange={setFormData} />}
            {activeType === "food-stall" && <FoodStallForm data={formData} onChange={setFormData} />}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{errorMsg}</span>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Listing saved successfully!
              </div>
            )}
            {status === "idle" && <span className="text-xs text-gray-400">* Required fields</span>}
            {status === "loading" && <span className="text-xs text-gray-400">Saving to database...</span>}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`px-8 py-3 rounded-xl text-sm font-black text-white shadow-lg transition-all flex items-center gap-2 ${activeTabData.color} hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "success" && <CheckCircle2 className="w-4 h-4" />}
                {status === "loading" ? "Saving..." : status === "success" ? "Saved!" : "Save Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
