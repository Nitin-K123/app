import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { api } from "../lib/api";
import { ShieldCheck, Star, MapPin, MessageCircle, Phone, Building2, Award, Clock, TrendingUp, Globe2, Users, Calendar, ChevronRight, Loader2, Mail } from "lucide-react";

const placeholder = "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85";
const inr = (n) => "₹ " + Number(n || 0).toLocaleString("en-IN");

const factoryImages = [
  "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1697698532634-ea59b636ccea?crop=entropy&cs=srgb&fm=jpg&q=85",
  "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?crop=entropy&cs=srgb&fm=jpg&q=85",
];

const reviewsMock = [
  { name: "Mahesh Kumar", city: "Pune", rating: 5, date: "3 days ago", text: "Excellent build quality and prompt delivery. Supplier was responsive throughout. Highly recommended for large orders." },
  { name: "Preeti Sharma", city: "Bangalore", rating: 4, date: "2 weeks ago", text: "Good product and reasonable pricing. Documentation support was very helpful for our GST filing." },
  { name: "Arvind Nair", city: "Kochi", rating: 5, date: "1 month ago", text: "Have been sourcing from them for the past 2 years  consistent quality, timely despatch and great communication." },
];

const SupplierProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSupplier(id).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="flex items-center justify-center py-32 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading storefront...</div><Footer /></div>;
  if (!data) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><h2 className="text-xl font-bold text-slate-900">Supplier not found</h2></div><Footer /></div>;

  const { supplier, user, products, stats } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-600">
          <Link to="/" className="hover:text-[#1a3a8e]">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/search" className="hover:text-[#1a3a8e]">Suppliers</Link><ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-medium truncate">{supplier.company}</span>
        </div>
      </div>

      {/* Cover + header */}
      <div className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3a8e 0%, #2b4fb3 100%)" }}>
          {supplier.cover_image && <img src={supplier.cover_image} alt="" className="h-full w-full object-cover opacity-30" />}
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-slate-200 psi-shadow -mt-16 relative p-5 md:p-6 flex flex-col md:flex-row gap-5">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-xl bg-gradient-to-br from-[#1a3a8e] to-[#2b4fb3] text-white flex items-center justify-center text-4xl font-extrabold shrink-0 psi-shadow-md">
              {supplier.company.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{supplier.company}</h1>
                    {supplier.verified && <span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-xs font-semibold px-2 py-1 rounded"><ShieldCheck className="h-3.5 w-3.5" /> Verified Supplier</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {supplier.city}, {supplier.state}</span>
                    <span className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-current" /><span className="font-semibold text-slate-800">{supplier.rating}</span><span className="text-slate-500">({supplier.reviews} reviews)</span></span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Est. {supplier.year_established}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition"><MessageCircle className="h-4 w-4 mr-2" /> Contact Supplier</Button>
                  <Button variant="outline" className="border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition"><Phone className="h-4 w-4 mr-2" /> Call Now</Button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                {[
                  { Icon: TrendingUp, k: "Turnover", v: supplier.annual_turnover },
                  { Icon: Users, k: "Employees", v: supplier.employees },
                  { Icon: Clock, k: "Response", v: supplier.response_time },
                  { Icon: Award, k: "GST", v: supplier.gst || "-" },
                  { Icon: Globe2, k: "Products", v: stats.product_count },
                ].map(({ Icon, k, v }) => (
                  <div key={k} className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1 text-slate-500"><Icon className="h-3.5 w-3.5" /> {k}</div>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="grid grid-cols-4 w-full md:w-fit">
            <TabsTrigger value="products" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Catalog</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">About</TabsTrigger>
            <TabsTrigger value="factory" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Factory</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-5">
            {products.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-500">No products listed yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover">
                    <div className="aspect-square bg-slate-50"><img src={(p.images && p.images[0]) || placeholder} alt={p.name} className="h-full w-full object-cover" /></div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px]">{p.name}</h3>
                      <div className="mt-1 text-lg font-bold text-[#1a3a8e]">{inr(p.price)}</div>
                      <div className="text-xs text-slate-500">per {p.unit}  MOQ: {p.moq}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-5">
            <div className="bg-white rounded-lg border border-slate-200 psi-shadow p-6 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-bold text-slate-900">About {supplier.company}</h2>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{supplier.about || "Leading Indian manufacturer and exporter with ISO-certified processes."}</p>
                <div className="mt-5">
                  <div className="font-semibold text-slate-900 mb-2">Certifications</div>
                  <div className="flex flex-wrap gap-2">
                    {(supplier.certifications || []).map((c) => (
                      <span key={c} className="text-xs bg-[#1a3a8e]/10 text-[#1a3a8e] px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {c}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="font-semibold text-slate-900 mb-2">Product Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.categories.map((c) => (<span key={c} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium">{c}</span>))}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                <div className="font-semibold text-slate-900">Primary Contact</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#1a3a8e]" /> {user?.name || "Sales Team"}</div>
                  {user?.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#1a3a8e]" /> {user.phone}</div>}
                  {user?.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#1a3a8e]" /> {user.email}</div>}
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1a3a8e]" /> {supplier.city}, {supplier.state}</div>
                </div>
                <Button className="w-full mt-4 bg-[#f58220] hover:bg-[#e07010] text-white btn-transition"><MessageCircle className="h-4 w-4 mr-2" /> Message Supplier</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="factory" className="mt-5">
            <div className="bg-white rounded-lg border border-slate-200 psi-shadow p-6">
              <h2 className="text-lg font-bold text-slate-900">Factory & Facility Photos</h2>
              <p className="text-sm text-slate-600 mt-1">A look inside our manufacturing unit, QC lab and warehouse.</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {factoryImages.map((src, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={src} alt={`Facility ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-5">
            <div className="bg-white rounded-lg border border-slate-200 psi-shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Buyer Reviews</h2>
                <div className="flex items-center gap-1 text-amber-500"><Star className="h-5 w-5 fill-current" /><span className="text-slate-900 font-bold">{supplier.rating}</span><span className="text-slate-500 text-sm">({supplier.reviews})</span></div>
              </div>
              <div className="mt-4 space-y-4">
                {reviewsMock.map((r, i) => (
                  <div key={i} className="border border-slate-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#1a3a8e]/10 text-[#1a3a8e] flex items-center justify-center font-bold">{r.name.charAt(0)}</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{r.name}</div>
                          <div className="text-xs text-slate-500">{r.city}  {r.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">{[...Array(r.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default SupplierProfile;
