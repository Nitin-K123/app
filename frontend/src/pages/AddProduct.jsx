import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { mainCategories, subCategoriesByMain } from "../mock/mock";
import { Package, IndianRupee, Boxes, Image as ImageIcon, Trash2, CheckCircle2 } from "lucide-react";

const empty = {
  name: "",
  category: "",
  subcategory: "",
  price: "",
  unit: "Piece",
  moq: "1",
  brand: "",
  gst: "",
  hsn: "",
  city: "",
  state: "",
  description: "",
  imageUrl: "",
};

const AddProduct = () => {
  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("psi_demo_products") || "[]");
      setList(existing);
    } catch {
      setList([]);
    }
  }, []);

  const persist = (arr) => {
    setList(arr);
    localStorage.setItem("psi_demo_products", JSON.stringify(arr));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast({ title: "Required fields missing", description: "Product name, category and price are required." });
      return;
    }
    const item = { ...form, id: Date.now(), createdAt: new Date().toLocaleString() };
    const next = [item, ...list];
    persist(next);
    setForm(empty);
    toast({ title: "Product added ", description: `${item.name} is now listed in your demo catalog.` });
  };

  const removeItem = (id) => persist(list.filter((p) => p.id !== id));

  const subcats = subCategoriesByMain[form.category] || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="psi-stripe text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-white/15 border border-white/25 flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Add Product  Demo Data Entry</h1>
              <p className="text-white/85 text-sm">List your industrial products in your PSI seller catalog. Data is stored in your browser for this demo.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-lg border border-slate-200 psi-shadow p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Product Details</h2>
            <span className="text-xs text-slate-500">* Required fields</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Heavy Duty CNC Lathe Machine" />
            </div>

            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v, subcategory: "" })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {mainCategories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sub-Category</Label>
              <Select value={form.subcategory} onValueChange={(v) => setForm({ ...form, subcategory: v })} disabled={!form.category}>
                <SelectTrigger><SelectValue placeholder={form.category ? "Select sub-category" : "Select category first"} /></SelectTrigger>
                <SelectContent>
                  {subcats.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Price *</Label>
              <div className="relative">
                <IndianRupee className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="pl-9" placeholder="e.g. 850000" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Piece", "Kg", "Meter", "Ton", "Box", "Set", "Unit", "Liter"].map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Minimum Order Qty</Label>
              <div className="relative">
                <Boxes className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} className="pl-9" placeholder="e.g. 10" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Shakti" />
            </div>

            <div className="space-y-1.5">
              <Label>HSN Code</Label>
              <Input value={form.hsn} onChange={(e) => setForm({ ...form, hsn: e.target.value })} placeholder="e.g. 8458" />
            </div>
            <div className="space-y-1.5">
              <Label>GST Rate (%)</Label>
              <Input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} placeholder="e.g. 18" />
            </div>

            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Rajkot" />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. Gujarat" />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>Product Image URL</Label>
              <div className="relative">
                <ImageIcon className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="pl-9" placeholder="https://..." />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>Product Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Specifications, features, materials, certifications..." />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <Button type="submit" className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Save Product
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(empty)} className="border-slate-300 btn-transition">Reset</Button>
            <span className="text-xs text-slate-500 ml-auto">{list.length} product(s) in your demo catalog</span>
          </div>
        </form>

        {/* Live list */}
        <aside className="bg-white rounded-lg border border-slate-200 psi-shadow p-5">
          <h3 className="text-base font-bold text-slate-900">My Demo Catalog</h3>
          <p className="text-xs text-slate-500 mt-1">Products you add here are saved locally in your browser.</p>

          <div className="mt-4 space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {list.length === 0 && (
              <div className="border border-dashed border-slate-300 rounded-md p-6 text-center text-sm text-slate-500">
                No products yet. Fill the form to add your first listing.
              </div>
            )}
            {list.map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-md p-3 flex gap-3 items-start">
                <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{p.category}{p.subcategory ? ` / ${p.subcategory}` : ""}</div>
                  <div className="text-xs mt-1">
                    <span className="font-bold text-[#1a3a8e]">₹ {p.price}</span>
                    <span className="text-slate-500"> /{p.unit}  MOQ: {p.moq}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.createdAt}</div>
                </div>
                <button onClick={() => removeItem(p.id)} className="text-slate-400 hover:text-red-600 btn-transition" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
