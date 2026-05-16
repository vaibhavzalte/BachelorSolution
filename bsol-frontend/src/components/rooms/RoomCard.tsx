"use client";

import { useState } from "react";
import { 
  House, MapPin, Phone, Wifi, Car, Wind, 
  UtensilsCrossed, Bath, CheckCircle, IndianRupee, 
  MessageCircle, ExternalLink, User, Users, 
  Check, Copy, Wallet, ShieldCheck, Receipt, Mail
} from "lucide-react";
import { Room } from "@/lib/api";
import { normalizeUrl } from "@/components/shared/utils";
import MediaGallery from "@/components/shared/MediaGallery";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);


  const images = room.images || [];
  const videos = room.videos || [];
  const displayImages = images.slice(0, 2);

  const allMedia = [
    ...images.map((url: string) => ({ url: normalizeUrl(url), type: "image" as const })),
    ...videos.map((url: string) => ({ url: normalizeUrl(url), type: "video" as const }))
  ];

  const handleMediaClick = (index: number) => {
    setInitialMediaIndex(index);
    setGalleryOpen(true);
  };

  const [copiedMap, setCopiedMap] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  const copyToClipboard = (text: string, type: 'map' | 'contact') => {
    navigator.clipboard.writeText(text);
    if (type === 'map') {
      setCopiedMap(true);
      setTimeout(() => setCopiedMap(false), 2000);
    } else {
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2000);
    }
  };

  const mapUrl = room.googleMap || room.location;

  return (
    <>
      <MediaGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        media={allMedia} 
        initialIndex={initialMediaIndex} 
      />

      <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-56 bg-gray-400 flex gap-0.5 rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleMediaClick(0)}>
          {displayImages.length > 0 ? (
            displayImages.map((img, i) => (
              <img
                key={i}
                src={normalizeUrl(img)}
                alt={`Image ${i + 1}`}
                className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-1000 hover:scale-110`}
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
              <House className="w-14 h-14 opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Photos</span>
            </div>
          )}
        </div>

        <div className="p-6 flex border-1 border-gray-200 rounded-3xl flex-col gap-6 mt-5 flex-1">
          <div>
            <h3 className="font-black text-indigo-600 text-xl leading-tight">
              {room.title}
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <House className="w-4 h-4 text-indigo-500" />
                </div>
                {room.roomType || "1 BHK"}
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Users className="w-4 h-4 text-indigo-500" />
                </div>
                For {room.availableFor || "Any"}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-yellow-500 tracking-widest mb-4 flex items-center gap-2">
              Facilities
            </h4>
            <div className="max-h-32 overflow-y-auto pr-2 flex flex-col gap-2.5 custom-scrollbar">
              {room.amenities && room.amenities.map((am, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-white shadow-sm w-full"
                >
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                  <span className="capitalize">{am}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-200/50 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-80">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Rent</span>
                </div>
                <p className="text-xl font-black tracking-tight">
                  ₹{room.rent?.toLocaleString() || 0}
                  <span className="text-[10px] font-black opacity-70 ml-1 uppercase tracking-widest">/ Mo</span>
                </p>
              </div>
            </div>

            {((room.deposit || 0) > 0 || (room.maintenance || 0) > 0 || (room.brokerage || 0) > 0) && (
              <div className="flex flex-wrap gap-2">
                {(room.deposit || 0) > 0 && (
                  <div className="flex-1 min-w-[80px] p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex flex-col gap-0.5 transition-all hover:bg-indigo-50">
                    <div className="flex items-center gap-1.5 text-indigo-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="text-[7px] font-black uppercase tracking-widest">Deposit</span>
                    </div>
                    <p className="text-[11px] font-black text-indigo-900">₹{room.deposit?.toLocaleString()}</p>
                  </div>
                )}
                {(room.maintenance || 0) > 0 && (
                  <div className="flex-1 min-w-[80px] p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/50 flex flex-col gap-0.5 transition-all hover:bg-amber-50">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Wallet className="w-3 h-3" />
                      <span className="text-[7px] font-black uppercase tracking-widest">Maintenance</span>
                    </div>
                    <p className="text-[11px] font-black text-amber-900">₹{room.maintenance?.toLocaleString()}</p>
                  </div>
                )}
                {(room.brokerage || 0) > 0 && (
                  <div className="flex-1 min-w-[80px] p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex flex-col gap-0.5 transition-all hover:bg-emerald-50">
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <Receipt className="w-3 h-3" />
                      <span className="text-[7px] font-black uppercase tracking-widest">Brokerage</span>
                    </div>
                    <p className="text-[11px] font-black text-emerald-900">₹{room.brokerage?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Location
              </h4>
              <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
                {[room.address, room.area, room.city].filter(Boolean).join(", ")}
              </p>
            </div>

            {mapUrl && mapUrl.startsWith("http") && (
              <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Maps Link:</span>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors truncate"
                  >
                    {mapUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(mapUrl, 'map')}
                    className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm group"
                    title="Copy Link"
                  >
                    {copiedMap ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  <User className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 tracking-widest">Contact</p>
                  <p className="text-base font-black text-gray-900">{room.ownerContact}</p>
                  {room.ownerEmail && (
                    <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="text-[12px] font-medium break-all">{room.ownerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(room.ownerContact || "", 'contact')}
                className="p-3 bg-gray-50 hover:bg-white rounded-xl transition-all border-2 border-transparent hover:border-gray-100 shadow-sm group active:scale-95"
                title="Copy Number"
              >
                {copiedContact ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={`tel:${room.ownerContact}`}
                className="flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-gray-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a
                href={`https://wa.me/${room.ownerContact?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 border-2 border-emerald-500 text-emerald-500 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-emerald-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-emerald-200"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


