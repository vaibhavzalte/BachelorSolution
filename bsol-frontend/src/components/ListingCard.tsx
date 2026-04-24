"use client";

import { House, CookingPot, Utensils, MapPin, Phone, Wifi, Car, Wind, UtensilsCrossed, Bath, Star, CheckCircle, Users } from "lucide-react";
import { Room, Mess, FoodStall, RoomVacancy, ListingType } from "@/lib/api";

type AnyListing = Room | Mess | FoodStall | RoomVacancy;

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

// ─── Room Vacancy Card ────────────────────────────────────────────────────────

function RoomVacancyCard({ vacancy }: { vacancy: RoomVacancy }) {
  const primaryColor = "bg-emerald-500";
  const bgColor = "bg-emerald-50";
  
  const hasAmenity = (name: string) => vacancy.amenities?.includes(name);

  return (
    <>
      <div className={`h-2 ${primaryColor} rounded-t-2xl`} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center shrink-0`}>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            <Badge label="Vacancy" color="bg-emerald-500 text-white" />
            {vacancy.roomType && <Badge label={vacancy.roomType} color="bg-emerald-100 text-emerald-700" />}
            {vacancy.preferredTenant && <Badge label={vacancy.preferredTenant} color="bg-gray-100 text-gray-600" />}
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">
          {vacancy.description || "Room Vacancy Available"}
        </h3>

        {vacancy.location && (
          <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span className="line-clamp-1">{vacancy.location}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-600">
                ₹{vacancy.rent?.toLocaleString() || 0}
                <span className="text-xs text-gray-400 font-bold">/bed</span>
            </p>
            {vacancy.availableBeds !== undefined && (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {vacancy.availableBeds} Seats Left
                </span>
            )}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100">
          {hasAmenity("WiFi") && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <Wifi className="w-3 h-3" /> WiFi
            </span>
          )}
          {hasAmenity("AC") && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <Wind className="w-3 h-3" /> AC
            </span>
          )}
          {vacancy.attachedBathroom && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <Bath className="w-3 h-3" /> Bath
            </span>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Room Card (Full) ─────────────────────────────────────────────────────────

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

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">{room.title}</h3>

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

        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100">
          {amenicons.map(({ key, Icon, label }) =>
            room[key as keyof Room] ? (
              <span key={key} className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                <Icon className="w-3 h-3" /> {label}
              </span>
            ) : null
          )}
        </div>
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
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">{mess.title}</h3>

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
        </div>
      </div>
    </>
  );
}

// ─── Food Stall Card ─────────────────────────────────────────────────────────

function FoodStallCard({ stall }: { stall: FoodStall }) {
  return (
    <>
      <div className="h-2 bg-pink-500 rounded-t-2xl" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5 text-pink-500" />
          </div>
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">{stall.stallName}</h3>

        {stall.location && (
          <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <MapPin className="w-3 h-3 text-pink-400" />
            {stall.location}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ListingCard({ type, data }: ListingCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
      {type === "room"          && <RoomCard        room={data as Room}         />}
      {type === "room-vacancy"  && <RoomVacancyCard vacancy={data as RoomVacancy} />}
      {type === "Mess"          && <MessCard        mess={data as Mess}         />}
      {type === "food-stall"    && <FoodStallCard   stall={data as FoodStall}    />}
    </div>
  );
}
