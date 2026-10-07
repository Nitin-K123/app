import React from "react";
import { Link } from "react-router-dom";
import { Building2, Clock, MapPin, ArrowRight } from "lucide-react";
import { tradeLeads, cities, stats, trustedBrands } from "../mock/mock";
import { Button } from "./ui/button";

export const TradeLeads = () => (
  <section className="max-w-7xl mx-auto px-4 py-10">
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Live Buy Requirements</h2>
        <p className="text-sm text-slate-600 mt-1">Respond to active trade leads and win business today</p>
      </div>
      <Link to="/add-product" className="hidden md:inline">
        <Button className="bg-[#1a3a8e] hover:bg-[#15306f] text-white btn-transition">Post Your Requirement</Button>
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tradeLeads.map((l) => (
        <div key={l.id} className="bg-white border border-slate-200 rounded-lg p-4 psi-card-hover">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{l.title}</h3>
            <span className="text-[11px] bg-[#f58220]/10 text-[#f58220] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">{l.qty}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-[#1a3a8e]" /> {l.buyer}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {l.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {l.posted}</span>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition text-xs h-8">
              Send Quotation <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const CityListings = () => (
  <section className="bg-slate-50 border-y border-slate-200">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Suppliers by City</h2>
      <p className="text-sm text-slate-600 mt-1">Source from manufacturing hubs across India</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {cities.map((c) => (
          <Link key={c} to={`/search?city=${c}`} className="bg-white border border-slate-200 rounded-md px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:border-[#f58220] hover:text-[#1a3a8e] btn-transition psi-shadow">
            {c}
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export const StatsBar = () => (
  <section className="psi-stripe">
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl md:text-3xl font-extrabold">{s.value}</div>
          <div className="text-xs md:text-sm text-white/85 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export const TrustedBrands = () => (
  <section className="bg-white border-y border-slate-200 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Trusted by India&apos;s leading enterprises</div>
      <div className="relative overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...trustedBrands, ...trustedBrands].map((b, i) => (
            <div key={i} className="text-xl md:text-2xl font-bold text-slate-400 tracking-wider">{b}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const JoinCTA = () => (
  <section className="bg-gradient-to-r from-[#1a3a8e] to-[#2b4fb3] text-white">
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Grow your business with Product Search India</h2>
        <p className="mt-2 text-white/85 text-sm md:text-base">Join 5 Lakh+ sellers already reaching millions of buyers across India. List your products, generate leads, and close deals faster.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center gap-2"><span className="h-2 w-2 bg-[#f58220] rounded-full" /> Free product listing with unlimited catalog</li>
          <li className="flex items-center gap-2"><span className="h-2 w-2 bg-[#f58220] rounded-full" /> Direct enquiries from genuine buyers</li>
          <li className="flex items-center gap-2"><span className="h-2 w-2 bg-[#f58220] rounded-full" /> Dedicated account manager for premium members</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg p-6 text-slate-900 psi-shadow-md">
        <div className="font-bold text-lg">Register as Seller / Buyer</div>
        <p className="text-sm text-slate-600 mt-1">Free registration  Get started in 2 minutes</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/login?tab=seller"><Button className="w-full bg-[#f58220] hover:bg-[#e07010] text-white btn-transition">Sell on PSI</Button></Link>
          <Link to="/login?tab=buyer"><Button variant="outline" className="w-full border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition">Buy on PSI</Button></Link>
        </div>
        <div className="mt-4 text-xs text-slate-500">By continuing, you agree to our Terms of Use & Privacy Policy.</div>
      </div>
    </div>
  </section>
);
