import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Crown, CheckCircle2, Smartphone, Apple, Rocket, TrendingUp, Globe2, Headphones } from "lucide-react";

/** Banner 1: Premium seller promo (left-aligned, blue hero style with orange CTA) */
export const PremiumSellerBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl psi-shadow-md" style={{ background: "linear-gradient(115deg, #1a3a8e 0%, #2d57c9 55%, #1a3a8e 100%)" }}>
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#f58220]/25 blur-3xl" />
        <div className="absolute right-10 bottom-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
        <div className="relative grid md:grid-cols-5 gap-6 p-6 md:p-10 items-center">
          <div className="md:col-span-3 text-white">
            <div className="inline-flex items-center gap-2 bg-[#f58220]/20 border border-[#f58220]/50 text-[#ffd3af] text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
              <Crown className="h-3.5 w-3.5" /> PSI Premium Seller
            </div>
            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold leading-tight">
              Unlock <span className="text-[#f58220]">10x more buyers</span> with the Verified Seller plan
            </h3>
            <p className="mt-2 text-white/80 text-sm max-w-xl">
              Top-of-search placement, unlimited catalogs, lead manager, dedicated account manager and a verified trust-tag that buyers trust.
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5 text-sm">
              {[
                { Icon: TrendingUp, t: "10x lead flow guarantee" },
                { Icon: Globe2, t: "Pan-India + export buyers" },
                { Icon: CheckCircle2, t: "Verified Trust badge" },
                { Icon: Headphones, t: "Dedicated account manager" },
              ].map(({ Icon, t }, i) => (
                <li key={i} className="flex items-center gap-2 text-white/90">
                  <Icon className="h-4 w-4 text-[#f58220]" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/login?tab=seller">
                <Button className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition font-semibold">
                  <Rocket className="h-4 w-4 mr-2" /> Upgrade to Premium
                </Button>
              </Link>
              <span className="text-xs text-white/70">Starts at ₹ 1,999 / month  Cancel anytime</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-5 text-slate-900 psi-shadow-md border-t-4 border-[#f58220]">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-md bg-[#1a3a8e] text-white flex items-center justify-center font-bold">PSI</div>
                <div>
                  <div className="font-bold">PSI Trust Index</div>
                  <div className="text-xs text-slate-500">Why buyers trust PSI</div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Verified Suppliers", value: 92 },
                  { label: "Avg. Response Time", value: 78, badge: "< 2 hrs" },
                  { label: "On-time Delivery", value: 88 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">{s.label}</span>
                      <span className="font-semibold text-slate-900">{s.badge || `${s.value}%`}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: "linear-gradient(90deg, #1a3a8e, #f58220)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Banner 2: Mobile app + Trade Alerts dual-card banner */
export const DualPromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-5">
      {/* Card 1  Mobile App */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 psi-shadow-md">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-br from-[#1a3a8e]/5 to-[#f58220]/10 pointer-events-none" />
        <div className="relative p-6 md:p-7 flex items-center gap-5">
          <div className="shrink-0 relative">
            <div className="h-28 w-20 rounded-2xl bg-gradient-to-b from-[#1a3a8e] to-[#15306f] p-1.5 psi-shadow-md">
              <div className="h-full w-full rounded-xl bg-white flex flex-col items-center justify-center text-[9px] font-bold text-[#1a3a8e]">
                <Smartphone className="h-6 w-6 text-[#f58220]" />
                <div className="mt-1">PSI</div>
                <div className="text-slate-400">App</div>
              </div>
            </div>
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-[#f58220] text-white text-[10px] font-bold flex items-center justify-center">NEW</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider font-bold text-[#f58220]">Download the app</div>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">Source on the go. Anywhere, anytime.</h3>
            <p className="text-sm text-slate-600 mt-1">Instant push notifications on buy leads, chat with suppliers and compare quotes  all from your phone.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="#" className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white rounded-md px-3 py-2 text-xs btn-transition">
                <Apple className="h-4 w-4" /> <span><span className="block text-[9px] text-slate-300 leading-none">Download on</span><span className="font-semibold">App Store</span></span>
              </a>
              <a href="#" className="flex items-center gap-2 bg-[#1a3a8e] hover:bg-[#15306f] text-white rounded-md px-3 py-2 text-xs btn-transition">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M3.6 2.3c-.3.3-.6.9-.6 1.6v16.2c0 .7.3 1.3.6 1.6l9.3-9.7L3.6 2.3zm10.8 10.8l2.5 2.6-11 6.1c-.4.2-.9.2-1.4 0l9.9-8.7zM4.5 1.2c.5-.2 1 .1 1.4.3L17 7.6l-2.6 2.6L4.5 1.2zm12.6 7.1l3.6 2c.8.4.8 1.6 0 2l-3.6 2L14.3 12l2.8-2.7z"/></svg>
                <span><span className="block text-[9px] text-slate-300 leading-none">Get it on</span><span className="font-semibold">Google Play</span></span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2  Trade Alerts */}
      <div className="relative overflow-hidden rounded-2xl psi-shadow-md" style={{ background: "linear-gradient(135deg, #fff3e6 0%, #ffffff 60%)" }}>
        <div className="absolute right-0 top-0 w-32 h-full" style={{ background: "repeating-linear-gradient(135deg, rgba(245,130,32,0.08) 0 10px, transparent 10px 20px)" }} />
        <div className="relative p-6 md:p-7">
          <div className="inline-flex items-center gap-2 bg-[#f58220] text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" /> Free Trade Alerts
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-3">Get fresh buy leads delivered to your inbox  daily</h3>
          <p className="text-sm text-slate-600 mt-1">Choose categories, cities and quantity ranges you serve  we send only matching leads. Zero spam, no cost.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="you@company.com" className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#1a3a8e]" />
            <Button type="submit" className="bg-[#1a3a8e] hover:bg-[#15306f] text-white btn-transition font-semibold">
              Subscribe Free
            </Button>
          </form>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#1a3a8e]" /> 18,500+ daily leads</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#1a3a8e]" /> 50+ categories</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#1a3a8e]" /> Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
