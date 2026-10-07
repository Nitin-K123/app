import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, ShieldCheck, Globe2 } from "lucide-react";
import { Button } from "./ui/button";

const popular = ["CNC Machine", "MS Pipe", "LED Light", "Safety Helmet", "SS Sheet", "Cotton Fabric", "Hydraulic Press"];

const Hero = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const go = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q || "industrial")}`);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3a8e 0%, #2b4fb3 55%, #1a3a8e 100%)" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(245,130,32,0.6), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3), transparent 45%)" }} />
      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-xs text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#f58220]" />
            Trusted by 5.2 Lakh+ Verified Suppliers across India
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            India&apos;s #1 B2B Marketplace for <span className="text-[#f58220]">Industrial Products</span>
          </h1>
          <p className="mt-3 text-white/85 text-base md:text-lg max-w-2xl">
            Connect with verified manufacturers, wholesalers & exporters. Source quality products at the best prices  from Machinery to Materials.
          </p>

          <form onSubmit={go} className="mt-6 flex flex-col sm:flex-row bg-white rounded-md overflow-hidden psi-shadow-md max-w-3xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for? e.g. CNC Lathe, MS Pipe, LED Panel"
              className="flex-1 px-4 py-3.5 text-slate-800 outline-none text-sm md:text-base"
            />
            <Button type="submit" className="rounded-none bg-[#f58220] hover:bg-[#e07010] text-white px-6 py-3.5 h-auto text-base font-semibold btn-transition flex items-center gap-2">
              <Search className="h-5 w-5" /> Search
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-white/90 text-xs md:text-sm">
            <span className="font-medium">Trending:</span>
            {popular.map((p) => (
              <button key={p} onClick={() => navigate(`/search?q=${encodeURIComponent(p)}`)} className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 btn-transition">
                {p}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              { icon: ShieldCheck, title: "Verified Suppliers", sub: "Trust-tagged companies" },
              { icon: TrendingUp, title: "Live Trade Leads", sub: "18,500+ posted daily" },
              { icon: Globe2, title: "Pan-India Reach", sub: "Buyers from 180+ cities" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-md p-3 backdrop-blur">
                <div className="h-10 w-10 rounded-md bg-[#f58220] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-white/80 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
