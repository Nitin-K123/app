import React, { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { featuredProducts, productDetails } from "../mock/mock";
import { ShieldCheck, Star, MapPin, MessageCircle, Phone, Building2, Award, Clock, TrendingUp, ChevronRight, Share2, Heart, Minus, Plus, CheckCircle2, Truck, FileText, BadgeCheck } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const product = useMemo(
    () => featuredProducts.find((p) => String(p.id) === String(id)) || featuredProducts[0],
    [id]
  );
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(parseInt(product.moq) || 1);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", message: `Dear Sir/Madam,\n\nI am interested in "${product.name}". Please share your best price, availability and delivery timeline.\n\nRegards,` });

  const gallery = [product.image, ...productDetails.gallery.filter((g) => g !== product.image)].slice(0, 4);

  const related = featuredProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const submitEnquiry = (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.phone) {
      toast({ title: "Please fill required fields", description: "Name and phone are required." });
      return;
    }
    toast({ title: "Enquiry sent ✔", description: `Your enquiry has been sent to ${product.company}. They will respond within 2 hours.` });
    setEnquiry({ ...enquiry, name: "", email: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
          <Link to="/" className="hover:text-[#1a3a8e]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/search" className="hover:text-[#1a3a8e]">Industrial Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 psi-shadow overflow-hidden">
            <div className="aspect-square bg-slate-50">
              <img src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2 p-2">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`aspect-square overflow-hidden rounded border-2 btn-transition ${i === activeImg ? "border-[#f58220]" : "border-slate-200 hover:border-[#1a3a8e]"}`}>
                  <img src={g} alt={`view ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-slate-300 btn-transition"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button variant="outline" className="border-slate-300 btn-transition"><Heart className="h-4 w-4 mr-2" /> Save</Button>
          </div>
        </div>

        {/* Main details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{product.name}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-slate-800">{productDetails.seller.rating}</span>
                    <span className="text-slate-500">({productDetails.seller.reviews} reviews)</span>
                  </div>
                  {product.verified && (
                    <span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-[11px] font-semibold px-2 py-0.5 rounded"><ShieldCheck className="h-3.5 w-3.5" /> Verified Supplier</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 bg-slate-50 rounded-md p-4 flex flex-wrap items-end gap-6 border border-slate-200">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Price</div>
                <div className="text-3xl font-extrabold text-[#1a3a8e]">{product.price}</div>
                <div className="text-xs text-slate-500">{product.unit}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Min. Order</div>
                <div className="text-lg font-bold text-slate-900">{product.moq}</div>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Quantity</div>
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden mt-1 bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 py-1.5 hover:bg-slate-100 btn-transition"><Minus className="h-3.5 w-3.5" /></button>
                    <input value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-14 text-center outline-none text-sm" />
                    <button onClick={() => setQty(qty + 1)} className="px-2 py-1.5 hover:bg-slate-100 btn-transition"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { Icon: Truck, label: "Delivery", value: "7-10 Days" },
                { Icon: BadgeCheck, label: "Warranty", value: "12 Months" },
                { Icon: FileText, label: "GST Invoice", value: "Provided" },
                { Icon: Award, label: "Certified", value: "ISO 9001" },
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
              <Button variant="outline" className="border-slate-300 btn-transition" onClick={() => navigate("/add-product")}>Request Best Price</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 w-full md:w-fit">
                <TabsTrigger value="description" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Description</TabsTrigger>
                <TabsTrigger value="specs" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Specifications</TabsTrigger>
                <TabsTrigger value="seller" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Seller Info</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-slate-700 leading-relaxed">{productDetails.description}</p>
                <div className="mt-4">
                  <div className="font-semibold text-slate-900 mb-2">Key Highlights</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                    {productDetails.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#1a3a8e] mt-0.5 shrink-0" /> {h}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 text-sm">
                  {productDetails.specifications.map((s) => (
                    <div key={s.key} className="flex justify-between py-2.5 border-b border-slate-100">
                      <span className="text-slate-500">{s.key}</span>
                      <span className="text-slate-900 font-medium text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="seller" className="mt-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-[#1a3a8e] text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {product.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-lg">{product.company}</h3>
                      {product.verified && (<span className="flex items-center gap-1 bg-[#1a3a8e] text-white text-[11px] font-semibold px-2 py-0.5 rounded"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span>)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mt-1"><MapPin className="h-3.5 w-3.5" /> {product.city}</div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      {[
                        { Icon: Building2, label: "Established", value: productDetails.seller.yearEstablished },
                        { Icon: TrendingUp, label: "Annual Turnover", value: productDetails.seller.annualTurnover },
                        { Icon: Award, label: "GST", value: productDetails.seller.gst },
                        { Icon: Clock, label: "Response Time", value: productDetails.seller.responseTime },
                        { Icon: MessageCircle, label: "Response Rate", value: productDetails.seller.responseRate },
                        { Icon: ShieldCheck, label: "Employees", value: productDetails.seller.employees },
                      ].map(({ Icon, label, value }) => (
                        <div key={label} className="p-2 bg-slate-50 border border-slate-200 rounded-md">
                          <div className="flex items-center gap-1 text-slate-500"><Icon className="h-3.5 w-3.5" /> {label}</div>
                          <div className="font-semibold text-slate-900 mt-0.5">{value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-500 mb-1">Certifications</div>
                      <div className="flex flex-wrap gap-2">
                        {productDetails.seller.certifications.map((c) => (
                          <span key={c} className="text-xs bg-[#1a3a8e]/10 text-[#1a3a8e] px-2 py-1 rounded-full font-semibold">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enquiry form */}
          <div className="mt-5 bg-white rounded-lg border border-slate-200 psi-shadow p-6">
            <h3 className="font-bold text-slate-900 text-lg">Send enquiry to supplier</h3>
            <p className="text-xs text-slate-500 mt-0.5">Avg. response time: {productDetails.seller.responseTime}</p>
            <form onSubmit={submitEnquiry} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Your Name *</Label>
                <Input value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Mobile *</Label>
                <Input value={enquiry.phone} onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })} placeholder="+91 98xxx xxxxx" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Email</Label>
                <Input value={enquiry.email} onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })} placeholder="you@company.com" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Message</Label>
                <Textarea rows={5} value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition"><MessageCircle className="h-4 w-4 mr-2" /> Send Enquiry</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-lg border border-slate-200 overflow-hidden psi-card-hover">
              <div className="aspect-square bg-slate-50">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px]">{p.name}</div>
                <div className="mt-1 text-base font-bold text-[#1a3a8e]">{p.price}</div>
                <div className="text-xs text-slate-500 truncate">{p.company}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
