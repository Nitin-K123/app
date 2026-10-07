import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Separator } from "../components/ui/separator";
import { featuredProducts, mainCategories, cities } from "../mock/mock";
import { ShieldCheck, Star, MapPin, MessageCircle, Phone, SlidersHorizontal, Grid3x3, List, ChevronRight } from "lucide-react";

const SearchResults = () => {
  const [sp] = useSearchParams();
  const q = sp.get("q") || "";
  const cityParam = sp.get("city") || "";
  const [view, setView] = useState("grid");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCities, setSelectedCities] = useState(cityParam ? [cityParam] : []);
  const [selectedCats, setSelectedCats] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sort, setSort] = useState("relevance");

  const results = useMemo(() => {
    const term = q.toLowerCase();
    let arr = featuredProducts.filter((p) => {
      const matchesQ = !term || p.name.toLowerCase().includes(term) || p.company.toLowerCase().includes(term);
      const matchesCity = selectedCities.length === 0 || selectedCities.some((c) => p.city.toLowerCase().includes(c.toLowerCase()));
      const matchesVerified = !verifiedOnly || p.verified;
      const priceNum = parseInt(p.price.replace(/[^\d]/g, ""), 10) || 0;
      const minOk = !priceRange.min || priceNum >= parseInt(priceRange.min);
      const maxOk = !priceRange.max || priceNum <= parseInt(priceRange.max);
      return matchesQ && matchesCity && matchesVerified && minOk && maxOk;
    });
    if (sort === "price_low") arr = [...arr].sort((a, b) => (parseInt(a.price.replace(/[^\d]/g, "")) || 0) - (parseInt(b.price.replace(/[^\d]/g, "")) || 0));
    if (sort === "price_high") arr = [...arr].sort((a, b) => (parseInt(b.price.replace(/[^\d]/g, "")) || 0) - (parseInt(a.price.replace(/[^\d]/g, "")) || 0));
    return arr;
  }, [q, selectedCities, verifiedOnly, priceRange, sort]);

  const toggle = (arr, setter, value) => setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-600">
          <Link to="/" className="hover:text-[#1a3a8e]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Search Results</span>
          {q && (<><ChevronRight className="h-3 w-3" /><span className="text-slate-900 font-medium">“{q}”</span></>)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <aside className="lg:col-span-1 bg-white rounded-lg border border-slate-200 psi-shadow p-5 h-fit lg:sticky lg:top-32">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <SlidersHorizontal className="h-4 w-4 text-[#1a3a8e]" />
            <h3 className="font-bold text-slate-900">Filters</h3>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
              <span className="text-sm text-slate-700 flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-[#1a3a8e]" /> Verified suppliers only</span>
            </label>
          </div>

          <Separator className="my-4" />
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Category</div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {mainCategories.slice(0, 6).map((c) => (
                <label key={c.name} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedCats.includes(c.name)} onCheckedChange={() => toggle(selectedCats, setSelectedCats, c.name)} />
                  <span className="text-sm text-slate-700">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-4" />
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-2">Price Range (₹)</div>
            <div className="flex gap-2">
              <Input placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} className="h-9 text-sm" />
              <Input placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} className="h-9 text-sm" />
            </div>
          </div>

          <Separator className="my-4" />
          <div>
            <div className="font-semibold text-sm text-slate-900 mb-2">City</div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cities.slice(0, 10).map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedCities.includes(c)} onCheckedChange={() => toggle(selectedCities, setSelectedCities, c)} />
                  <span className="text-sm text-slate-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4 border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition" onClick={() => { setVerifiedOnly(false); setSelectedCities([]); setSelectedCats([]); setPriceRange({ min: "", max: "" }); }}>Clear all filters</Button>
        </aside>

        {/* Results */}
        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{q ? `Results for “${q}”` : "All Industrial Products"}</h1>
              <p className="text-sm text-slate-600">{results.length} products found from verified suppliers</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border border-slate-300 rounded-md px-2 py-1.5 outline-none focus:border-[#1a3a8e]">
                <option value="relevance">Sort: Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <div className="flex border border-slate-300 rounded-md overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-1.5 ${view === "grid" ? "bg-[#1a3a8e] text-white" : "text-slate-500 hover:bg-slate-100"} btn-transition`}><Grid3x3 className="h-4 w-4" /></button>
                <button onClick={() => setView("list")} className={`p-1.5 ${view === "list" ? "bg-[#1a3a8e] text-white" : "text-slate-500 hover:bg-slate-100"} btn-transition`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center">
              <div className="text-slate-500">No products match your filters.</div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover flex flex-col">
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    {p.verified && (<div className="absolute top-2 left-2 flex items-center gap-1 bg-[#1a3a8e] text-white text-[10px] font-semibold px-2 py-0.5 rounded"><ShieldCheck className="h-3 w-3" /> Verified</div>)}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px]">{p.name}</h3>
                    <div className="mt-2 text-lg font-bold text-[#1a3a8e]">{p.price}</div>
                    <div className="text-xs text-slate-500">{p.unit} • MOQ: {p.moq}</div>
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="font-medium text-slate-800 truncate">{p.company}</div>
                      <div className="flex items-center gap-1 text-slate-500 mt-0.5"><MapPin className="h-3 w-3" /> {p.city}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg border border-slate-200 psi-card-hover flex gap-4 p-4">
                  <div className="h-32 w-32 rounded-md overflow-hidden bg-slate-50 shrink-0">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      {p.verified && (<span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap"><ShieldCheck className="h-3 w-3" /> Verified</span>)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3 fill-current" /> <span className="text-slate-700 font-medium">4.6</span><span className="text-slate-400"> (284 reviews)</span></div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="text-xl font-bold text-[#1a3a8e]">{p.price}</div>
                      <div className="text-xs text-slate-500">{p.unit} • MOQ: {p.moq}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{p.company} • <span className="text-slate-500">{p.city}</span></div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition h-8 text-xs" onClick={(e) => e.preventDefault()}><MessageCircle className="h-3.5 w-3.5 mr-1" /> Send Enquiry</Button>
                      <Button size="sm" variant="outline" className="border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition h-8 text-xs" onClick={(e) => e.preventDefault()}><Phone className="h-3.5 w-3.5 mr-1" /> Call Supplier</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
