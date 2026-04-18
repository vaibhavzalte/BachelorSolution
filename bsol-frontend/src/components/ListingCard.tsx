"use client";

import { House, CookingPot, Utensils, MapPin, Phone, Wifi, Car, Wind, UtensilsCrossed, Bath, Star, CheckCircle } from "lucide-react";
import { Room, Mess, FoodStall, ListingType } from "@/lib/api";

type AnyListing = Room | Mess | FoodStall;

interface ListingCardProps {
  type: ListingType;
  data: AnyListing;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

// ─── Room Card ──────────────────────────────────────────────────────────────

function RoomCard({ room }: { room: Room }) {
  const amenicons = [
    { key: "wifi",             Icon: Wifi,             label: "WiFi" },
    { key: "parking",          Icon: Car,              label: "Parking" },
    { key: "ac",               Icon: Wind,             label: "AC" },
    { key: "foodIncluded",     Icon: UtensilsCrossed,  label: "Food" },
    { key: "attachedBathroom", Icon: Bath,             label: "Bath" },
  ] as const;

  return (
    <>
      {/* Header strip */}
      <div className="h-2 bg-indigo-500 rounded-t-2xl" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <House className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {room.roomType && <Badge label={room.roomType} color="bg-indigo-100 text-indigo-700" />}
            {room.availableFor && <Badge label={room.availableFor} color="bg-gray-100 text-gray-600" />}
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">
          {room.title || "Room Listing"}
        </h3>

        {(room.area || room.city) && (
          <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-indigo-400" />
            {[room.area, room.city].filter(Boolean).join(", ")}
          </div>
        )}

        {room.rent && (
          <p className="text-2xl font-black text-indigo-600">
            ₹{room.rent.toLocaleString()}
            <span className="text-xs text-gray-400 font-bold">/mo</span>
          </p>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100">
          {amenicons.map(({ key, Icon, label }) =>
            room[key] ? (
              <span key={key} className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                <Icon className="w-3 h-3" /> {label}
              </span>
            ) : null
          )}
        </div>

        {room.ownerContact && (
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Phone className="w-3 h-3" /> {room.ownerContact}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Mess Card ──────────────────────────────────────────────────────────────

function MessCard({ mess }: { mess: Mess }) {
  const foodColors: Record<string, string> = {
    VEG: "bg-green-100 text-green-700",
    "NON-VEG": "bg-red-100 text-red-700",
    BOTH: "bg-amber-100 text-amber-700",
  };

  return (
    <>
      <div className="h-2 bg-amber-500 rounded-t-2xl" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <CookingPot className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {mess.foodType && <Badge label={mess.foodType} color={foodColors[mess.foodType] || "bg-gray-100 text-gray-600"} />}
            {mess.mealType && <Badge label={mess.mealType} color="bg-amber-100 text-amber-700" />}
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">
          {mess.title || "Mess Listing"}
        </h3>

        {(mess.area || mess.city) && (
          <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-amber-400" />
            {[mess.area, mess.city].filter(Boolean).join(", ")}
          </div>
        )}

        <div className="flex gap-4">
          {mess.monthlyFee && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly</p>
              <p className="text-xl font-black text-amber-600">₹{mess.monthlyFee.toLocaleString()}</p>
            </div>
          )}
          {mess.perMealFee && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per Meal</p>
              <p className="text-xl font-black text-amber-600">₹{mess.perMealFee}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100">
          {mess.homeDelivery && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
              <CheckCircle className="w-3 h-3" /> Home Delivery
            </span>
          )}
          {mess.diningArea && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
              <CheckCircle className="w-3 h-3" /> Dining Area
            </span>
          )}
        </div>

        {mess.ownerContact && (
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Phone className="w-3 h-3" /> {mess.ownerContact}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Food Stall Card ─────────────────────────────────────────────────────────

function FoodStallCard({ stall }: { stall: FoodStall }) {
  const foodColors: Record<string, string> = {
    Veg: "bg-green-100 text-green-700",
    "Non-Veg": "bg-red-100 text-red-700",
    Both: "bg-pink-100 text-pink-700",
  };

  return (
    <>
      <div className="h-2 bg-pink-500 rounded-t-2xl" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5 text-pink-500" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {stall.foodType && <Badge label={stall.foodType} color={foodColors[stall.foodType] || "bg-gray-100 text-gray-600"} />}
            {stall.isOpen !== undefined && (
              <Badge
                label={stall.isOpen ? "Open" : "Closed"}
                color={stall.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
              />
            )}
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">
          {stall.stallName || "Food Stall"}
        </h3>

        {stall.location && (
          <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-pink-400" />
            {stall.location}
          </div>
        )}

        {stall.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-lg font-black text-gray-800">{stall.rating}</span>
            <span className="text-xs text-gray-400 font-semibold">/ 5</span>
          </div>
        )}

        {stall.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto pt-2 border-t border-gray-100">
            {stall.description}
          </p>
        )}

        {stall.contactNumber && (
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Phone className="w-3 h-3" /> {stall.contactNumber}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ListingCard({ type, data }: ListingCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {type === "room"       && <RoomCard      room={data as Room}      />}
      {type === "Mess"       && <MessCard      mess={data as Mess}      />}
      {type === "food-stall" && <FoodStallCard stall={data as FoodStall} />}
    </div>
  );
}
