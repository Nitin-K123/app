import React from "react";
import { Link } from "react-router-dom";
import { mainCategories, subCategoriesByMain } from "../mock/mock";
import { ChevronRight } from "lucide-react";

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Browse by Category</h2>
          <p className="text-sm text-slate-600 mt-1">Explore 50+ industry verticals and 60 Lakh+ products</p>
        </div>
        <Link to="/search" className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#1a3a8e] hover:text-[#f58220] btn-transition">
          View All Categories <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainCategories.map((cat) => (
          <div key={cat.name} className="group bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover cursor-pointer">
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 border-t-2 border-[#f58220]/60">
              <div className="font-semibold text-slate-900 text-sm">{cat.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{cat.count}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(subCategoriesByMain[cat.name] || []).slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#1a3a8e]/10 group-hover:text-[#1a3a8e] btn-transition">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
