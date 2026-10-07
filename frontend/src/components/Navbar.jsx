import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Phone, Menu, X, ChevronDown, MapPin, UserCircle2 } from "lucide-react";
import { LOGO_URL, mainCategories } from "../mock/mock";
import { Button } from "./ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showCats, setShowCats] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 psi-shadow">
      {/* Top strip */}
      <div className="psi-stripe text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">India&apos;s Leading B2B Industrial Marketplace</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+911800123456" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" /> 1800-123-456
            </a>
            <Link to="/login" className="hover:underline">Sign In</Link>
            <Link to="/login?tab=seller" className="hover:underline">Join Free</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="shrink-0">
          <img src={LOGO_URL} alt="Product Search India" className="h-12 md:h-14 object-contain" />
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-3xl border-2 border-[#1a3a8e] rounded-md overflow-hidden">
          <div className="flex items-center gap-1 px-3 bg-white border-r border-slate-200 text-sm text-slate-600 cursor-pointer">
            <MapPin className="h-4 w-4 text-[#f58220]" />
            <span>All India</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, suppliers & categories..."
            className="flex-1 px-3 py-2 outline-none text-sm"
          />
          <button type="submit" className="bg-[#1a3a8e] hover:bg-[#15306f] text-white px-5 flex items-center gap-2 btn-transition">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Search</span>
          </button>
        </form>

        <div className="ml-auto hidden lg:flex items-center gap-3">
          <Link to="/add-product">
            <Button className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition rounded-md">
              Post Buy Requirement
            </Button>
          </Link>
          <Link to="/login" className="flex items-center gap-2 text-slate-700 hover:text-[#1a3a8e] btn-transition">
            <UserCircle2 className="h-6 w-6" />
            <span className="text-sm font-medium">Sign In</span>
          </Link>
        </div>

        <button className="md:hidden ml-auto" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Categories bar */}
      <div className="border-t border-slate-200 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-5 overflow-x-auto text-sm">
          <button
            onMouseEnter={() => setShowCats(true)}
            onMouseLeave={() => setShowCats(false)}
            className="flex items-center gap-1 py-2.5 font-semibold text-[#1a3a8e]"
          >
            <Menu className="h-4 w-4" />
            All Categories
            <ChevronDown className="h-4 w-4" />
            {showCats && (
              <div className="absolute left-4 top-full mt-0 w-72 bg-white border border-slate-200 shadow-lg rounded-md z-50 text-left">
                {mainCategories.map((c) => (
                  <div key={c.name} className="px-4 py-2 text-sm text-slate-700 hover:bg-[#1a3a8e] hover:text-white cursor-pointer btn-transition">
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </button>
          {["Machinery", "Electrical", "Construction", "Steel & Metal", "Textiles", "Safety", "Chemicals", "Packaging", "Agriculture", "Automobile"].map((l) => (
            <Link key={l} to="/search" className="py-2.5 whitespace-nowrap text-slate-700 hover:text-[#f58220] btn-transition">
              {l}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile search */}
      {open && (
        <div className="md:hidden border-t p-3 bg-white">
          <form onSubmit={onSearch} className="flex border-2 border-[#1a3a8e] rounded-md overflow-hidden">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="flex-1 px-3 py-2 text-sm outline-none" />
            <button className="bg-[#1a3a8e] text-white px-3"><Search className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
