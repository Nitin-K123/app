import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";
import { ShieldCheck, Star, MapPin, MessageCircle, Phone, Building2, Award, Clock, TrendingUp, ChevronRight, Share2, Heart, Minus, Plus, CheckCircle2, Truck, FileText, BadgeCheck, Loader2 } from "lucide-react";

const placeholder = "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85";
const inr = (n) => "₹ " + Number(n || 0).toLocaleString("en-IN");

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sending, setSending] = useState(false);
  const [enquiry, setEnquiry] = useState({ buyer_name: "", buyer_email: "", buyer_phone: "", qty: "", message: "" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getProduct(id)
      .then(async (d) => {
        if (cancelled) return;
        setData(d);
        setQty(parseInt(d.product?.moq) || 1);
        setEnquiry((prev) => ({ ...prev, message: `Dear Sir/Madam,\n\nI am interested in "${d.product.name}". Please share your best price, availability and delivery timeline.\n\nRegards,` }));
        try {
          const list = await api.listProducts({ category: d.product.category, limit: 8 });
          if (!cancelled) setRelated((list || []).filter((p) => p.id !== d.product.id).slice(0, 4));
        } catch { /* ignore */ }
      })
      .catch(() => setData(null))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const gallery = useMemo(() => {
    const imgs = data?.product?.images || [];
    return imgs.length ? imgs : [placeholder];
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50"><Navbar /><div className="flex items-center justify-center py-32 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading product...</div><Footer /></div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><h2 className="text-xl font-bold text-slate-900">Product not found</h2><Link to="/search" className="mt-3 inline-block text-[#1a3a8e] font-semibold">Back to products</Link></div><Footer /></div>
    );
  }

  const { product, supplier } = data;

  const submitEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiry.buyer_name || !enquiry.buyer_phone) {
      toast({ title: "Required fields", description: "Name and phone are required." });
      return;
    }
    setSending(true);
    try {
      await api.postEnquiry({ ...enquiry, qty: enquiry.qty || String(qty), product_id: product.id });
      toast({ title: "Enquiry sent ✔", description: `Your enquiry has been sent to ${product.seller_company}.` });
      setEnquiry({ ...enquiry, buyer_name: "", buyer_email: "", buyer_phone: "" });
    } catch (err) {
      toast({ title: "Could not send", description: err?.response?.data?.detail || "Please try again." });
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
          <Link to="/" className="hover:text-[#1a3a8e]">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/search" className="hover:text-[#1a3a8e]">Industrial Products</Link><ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 psi-shadow overflow-hidden">
            <div className="aspect-square bg-slate-50"><img src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" /></div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square overflow-hidden rounded border-2 btn-transition ${i === activeImg ? "border-[#f58220]" : "border-slate-200 hover:border-[#1a3a8e]"}`}><img src={g} alt="" className="h-full w-full object-cover" /></button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-slate-300 btn-transition"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button variant="outline" className="border-slate-300 btn-transition"><Heart className="h-4 w-4 mr-2" /> Save</Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{product.name}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-current" /><span className="font-semibold text-slate-800">{supplier?.rating || 4.5}</span><span className="text-slate-500">({supplier?.reviews || 100} reviews)</span></div>
                  {product.verified && <span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-[11px] font-semibold px-2 py-0.5 rounded"><ShieldCheck className="h-3.5 w-3.5" /> Verified Supplier</span>}
                </div>
              </div>
            </div>

            <div className="mt-5 bg-slate-50 rounded-md p-4 flex flex-wrap items-end gap-6 border border-slate-200">
              <div><div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Price</div><div className="text-3xl font-extrabold text-[#1a3a8e]">{inr(product.price)}</div><div className="text-xs text-slate-500">per {product.unit}</div></div>
              <div><div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Min. Order</div><div className="text-lg font-bold text-slate-900">{product.moq}</div></div>
              <div><div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Quantity</div>
                <div className="flex items-center border border-slate-300 rounded-md overflow-hidden mt-1 bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 py-1.5 hover:bg-slate-100 btn-transition"><Minus className="h-3.5 w-3.5" /></button>
                  <input value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-14 text-center outline-none text-sm" />
                  <button onClick={() => setQty(qty + 1)} className="px-2 py-1.5 hover:bg-slate-100 btn-transition"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { Icon: Truck, label: "Delivery", value: "7-10 Days" },
                { Icon: BadgeCheck, label: "Warranty", value: "12 Months" },
                { Icon: FileText, label: "GST Invoice", value: "Provided" },
                { Icon: Award, label: "HSN", value: product.hsn || "N/A" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200">
                  <Icon className="h-4 w-4 text-[#f58220]" />
                  <div><div className="text-slate-500">{label}</div><div className="font-semibold text-slate-900">{value}</div></div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition"><MessageCircle className="h-4 w-4 mr-2" /> Send Enquiry</Button>
              <Button variant="outline" className="border-[#1a3a8e] text-[#1a3a8e] hover:bg-[#1a3a8e] hover:text-white btn-transition"><Phone className="h-4 w-4 mr-2" /> Call Supplier</Button>
              {supplier && <Button variant="outline" className="border-slate-300 btn-transition" onClick={() => navigate(`/supplier/${supplier.user_id}`)}><Building2 className="h-4 w-4 mr-2" /> View Storefront</Button>}
            </div>
          </div>

          <div className="mt-5 bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 w-full md:w-fit">
                <TabsTrigger value="description" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Description</TabsTrigger>
                <TabsTrigger value="specs" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Specifications</TabsTrigger>
                <TabsTrigger value="seller" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Seller Info</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{product.description || "Premium industrial-grade product manufactured in India under strict quality standards."}</p>
                <div className="mt-4">
                  <div className="font-semibold text-slate-900 mb-2">Key Highlights</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                    {["ISO 9001:2015 certified manufacturing","12-month warranty with on-site support","Pan-India delivery in 7-10 business days","Custom specifications & bulk pricing available","GST invoice & export documentation provided"].map((h) => (
                      <li key={h} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#1a3a8e] mt-0.5 shrink-0" /> {h}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 text-sm">
                  {[
                    { k: "Brand", v: product.brand || "Generic" },
                    { k: "Category", v: product.category },
                    { k: "Sub-Category", v: product.subcategory || "-" },
                    { k: "HSN Code", v: product.hsn || "-" },
                    { k: "GST Rate", v: product.gst ? `${product.gst}%` : "18%" },
                    { k: "Unit", v: product.unit },
                    { k: "MOQ", v: product.moq },
                    { k: "Ships From", v: `${product.city}${product.state ? ", " + product.state : ""}` },
                  ].map((s) => (
                    <div key={s.k} className="flex justify-between py-2.5 border-b border-slate-100"><span className="text-slate-500">{s.k}</span><span className="text-slate-900 font-medium text-right">{s.v}</span></div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="seller" className="mt-4">
                {supplier ? (
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-[#1a3a8e] text-white flex items-center justify-center text-xl font-bold shrink-0">{supplier.company.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-lg">{supplier.company}</h3>
                        {supplier.verified && <span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-[11px] font-semibold px-2 py-0.5 rounded"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600 mt-1"><MapPin className="h-3.5 w-3.5" /> {supplier.city}, {supplier.state}</div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        {[
                          { Icon: Building2, label: "Established", value: supplier.year_established },
                          { Icon: TrendingUp, label: "Turnover", value: supplier.annual_turnover },
                          { Icon: Award, label: "GST", value: supplier.gst || "-" },
                          { Icon: Clock, label: "Response", value: supplier.response_time },
                          { Icon: MessageCircle, label: "Rate", value: supplier.response_rate },
                          { Icon: ShieldCheck, label: "Employees", value: supplier.employees },
                        ].map(({ Icon, label, value }) => (
                          <div key={label} className="p-2 bg-slate-50 border border-slate-200 rounded-md"><div className="flex items-center gap-1 text-slate-500"><Icon className="h-3.5 w-3.5" /> {label}</div><div className="font-semibold text-slate-900 mt-0.5">{value}</div></div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-slate-500 mb-1">Certifications</div>
                        <div className="flex flex-wrap gap-2">{(supplier.certifications || []).map((c) => (<span key={c} className="text-xs bg-[#1a3a8e]/10 text-[#1a3a8e] px-2 py-1 rounded-full font-semibold">{c}</span>))}</div>
                      </div>
                      <div className="mt-3"><Link to={`/supplier/${supplier.user_id}`} className="text-sm font-semibold text-[#1a3a8e] hover:text-[#f58220] btn-transition">View full storefront →</Link></div>
                    </div>
                  </div>
                ) : <div className="text-sm text-slate-500">Seller info not available.</div>}
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-5 bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <h3 className="font-bold text-slate-900 text-lg">Send enquiry to supplier</h3>
            <p className="text-xs text-slate-500 mt-0.5">Avg. response: {supplier?.response_time || "within 3 hours"}</p>
            <form onSubmit={submitEnquiry} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Your Name *</Label><Input value={enquiry.buyer_name} onChange={(e) => setEnquiry({ ...enquiry, buyer_name: e.target.value })} placeholder="Full name" /></div>
              <div className="space-y-1.5"><Label>Mobile *</Label><Input value={enquiry.buyer_phone} onChange={(e) => setEnquiry({ ...enquiry, buyer_phone: e.target.value })} placeholder="+91 98xxx xxxxx" /></div>
              <div className="space-y-1.5 md:col-span-2"><Label>Email</Label><Input value={enquiry.buyer_email} onChange={(e) => setEnquiry({ ...enquiry, buyer_email: e.target.value })} placeholder="you@company.com" /></div>
              <div className="space-y-1.5 md:col-span-2"><Label>Message</Label><Textarea rows={5} value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} /></div>
              <div className="md:col-span-2"><Button type="submit" disabled={sending} className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition">{sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending</> : <><MessageCircle className="h-4 w-4 mr-2" /> Send Enquiry</>}</Button></div>
            </form>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover">
                <div className="aspect-square bg-slate-50"><img src={(p.images && p.images[0]) || placeholder} alt={p.name} className="h-full w-full object-cover" /></div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px]">{p.name}</div>
                  <div className="mt-1 text-base font-bold text-[#1a3a8e]">{inr(p.price)}</div>
                  <div className="text-xs text-slate-500 truncate">{p.seller_company}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetail;
