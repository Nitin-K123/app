import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle, Phone, MapPin, Star } from "lucide-react";
import { featuredProducts } from "../mock/mock";
import { Button } from "./ui/button";

const FeaturedProducts = () => {
  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-sm text-slate-600 mt-1">Handpicked offerings from verified suppliers</p>
          </div>
          <Link to="/search" className="text-sm font-semibold text-[#1a3a8e] hover:text-[#f58220] btn-transition hidden md:inline">View all </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((p) => (
            <article key={p.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover flex flex-col">
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                {p.verified && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#1a3a8e] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </div>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/95 text-[11px] px-1.5 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-[#f58220] text-[#f58220]" />
                  <span className="font-semibold">4.{Math.floor(Math.random() * 5) + 3}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px]">{p.name}</h3>
                <div className="mt-2">
                  <div className="text-lg font-bold text-[#1a3a8e]">{p.price}</div>
                  <div className="text-xs text-slate-500">{p.unit}  MOQ: {p.moq}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="font-medium text-slate-800 truncate">{p.company}</div>
                  <div className="flex items-center gap-1 text-slate-500"><MapPin className="h-3 w-3" /> {p.city}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#f58220] hover:bg-[#e07010] text-white btn-transition text-xs h-8">
                    <MessageCircle className="h-3.5 w-3.5 mr-1" /> Enquire
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition text-xs h-8 px-2">
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
