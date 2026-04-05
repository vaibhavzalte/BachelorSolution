import Image from "next/image";
import CategoryCard from "@/components/CategoryCard";
import SearchFilter from "@/components/SearchFilter";
import { Building2, Utensils, Zap, MapPin, ShieldCheck, Star } from "lucide-react";

export default function Home() {
  const categories = [
    {
      title: "Find Rooms",
      description: "Search for affordable rooms, shared apartments, and bachelor-friendly flats in your desired area.",
      icon: <Building2 className="w-8 h-8" />,
      count: "500+ Listed",
      color: "bg-blue-500/10",
      href: "#rooms"
    },
    {
      title: "Room Vacancy",
      description: "Check real-time availability in nearby rooms or find a replacement roommate for your current spot.",
      icon: <Zap className="w-8 h-8" />,
      count: "80 New Today",
      color: "bg-amber-500/10",
      href: "#vacancies"
    },
    {
      title: "Food Stalls",
      description: "Discover the best tiffin services, street food, and affordable mess centers near your location.",
      icon: <Utensils className="w-8 h-8" />,
      count: "120+ Stalls",
      color: "bg-emerald-500/10",
      href: "#food"
    }
  ];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider self-center">
              <Star className="w-3 h-3 fill-primary" /> Simplified Bachelor Living
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              The Ultimate Solution for <span className="text-primary italic">Bachelors.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto leading-relaxed">
              Find rooms, vacancies, and delicious food stalls around you without the hassle. We take care of the details so you can focus on your journey.
            </p>

            <div className="flex items-center justify-center gap-8 mt-4 text-xs text-foreground/30 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Listings</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Near You</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section (Separated and Overlapping) */}
      <SearchFilter />

      {/* Categories / Dashboard Section */}
      <section className="container mx-auto px-6" id="rooms">
        <div className="flex flex-col gap-4 mb-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-primary rounded-full opacity-30" />
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px]">Categories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">Explore Our Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* Decorative Branding Section */}
      <section className="container mx-auto px-6 overflow-hidden">
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 md:p-24 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                Stop <span className="text-primary italic">Searching</span>, Start <span className="text-primary italic">Living.</span>
              </h2>
              <p className="text-lg text-foreground/40 leading-relaxed max-w-md">
                Join thousands of bachelors who have found their second home through BatchelorSolution. We verify every listing for your peace of mind.
              </p>
              <div className="flex gap-4">
                <button className="bg-foreground text-background px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/10">
                  Get Started Free
                </button>
                <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50 active:scale-95">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg">
              <div className="relative aspect-video bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl rotate-2 transition-transform group-hover:rotate-0 duration-700">
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-primary opacity-10" />
                </div>
                {/* Simulated UI Content */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl shadow-inner border border-slate-100 overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/vercel.svg" 
                        alt="Demo" 
                        width={24} 
                        height={24}
                        className="opacity-20 grayscale"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-black text-foreground">Premium PG in Pune</div>
                      <div className="text-[10px] text-foreground/40 flex items-center gap-1 font-bold">
                        <MapPin className="w-3 h-3 text-primary" /> Hiver Town, Pune
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

