import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { mainCategories, subCategoriesByMain } from "../mock/mock";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Package, IndianRupee, Boxes, UploadCloud, Trash2, CheckCircle2, X, Loader2, Image as ImageIcon } from "lucide-react";

const empty = { name: "", category: "", subcategory: "", price: "", unit: "Piece", moq: "1", brand: "", gst: "", hsn: "", city: "", state: "", description: "" };

const AddProduct = () => {
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState([]); // array of data URLs
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [list, setList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const fileRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const canSell = user?.role === "seller";

  const refresh = useCallback(async () => {
    if (!canSell) { setList([]); setListLoading(false); return; }
    setListLoading(true);
    try { setList(await api.myProducts()); } catch { setList([]); }
    finally { setListLoading(false); }
  }, [canSell]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleFiles = async (files) => {
    const arr = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const f of arr) {
        try { const r = await api.uploadImage(f); uploaded.push(r.url); } catch (e) {
          toast({ title: `Upload failed: ${f.name}`, description: e?.response?.data?.detail || "Try a smaller image (<3MB)." });
        }
      }
      setImages((prev) => [...prev, ...uploaded].slice(0, 6));
      if (uploaded.length) toast({ title: `${uploaded.length} image(s) uploaded` });
    } finally { setUploading(false); }
  };

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };

  const removeImg = (i) => setImages(images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSell) { toast({ title: "Seller account required", description: "Please sign in as a seller to list products." }); navigate("/login?tab=seller"); return; }
    if (!form.name || !form.category || !form.price) { toast({ title: "Required fields missing", description: "Product name, category and price are required." }); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0, images };
      const prod = await api.createProduct(payload);
      toast({ title: "Product listed ", description: `${prod.name} is live in your catalog.` });
      setForm(empty); setImages([]);
      refresh();
    } catch (e) {
      toast({ title: "Could not save", description: e?.response?.data?.detail || "Please try again." });
    } finally { setSaving(false); }
  };

  const removeItem = async (id) => {
    try { await api.deleteProduct(id); refresh(); } catch { toast({ title: "Could not remove" }); }
  };

  const subcats = subCategoriesByMain[form.category] || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="psi-stripe text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-white/15 border border-white/25 flex items-center justify-center"><Package className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Add Product to Your Catalog</h1>
              <p className="text-white/85 text-sm">{canSell ? `Signed in as ${user.name}  ${user.company || "PSI Seller"}` : "Sign in as a seller to list products on PSI"}</p>
            </div>
          </div>
        </div>
      </div>

      {!canSell && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-4 text-sm">
            You need a seller account to add products. <button onClick={() => navigate("/login?tab=seller")} className="underline font-semibold">Sign in or register as a seller</button>.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-lg border border-slate-200 psi-shadow p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Product Details</h2>
            <span className="text-xs text-slate-500">* Required</span>
          </div>

          {/* Drag-drop upload */}
          <div className="space-y-2">
            <Label>Product Images (up to 6)</Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed p-5 flex flex-col items-center justify-center text-center btn-transition ${dragOver ? "border-[#f58220] bg-orange-50" : "border-slate-300 hover:border-[#1a3a8e] bg-slate-50"}`}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
              {uploading ? (
                <div className="flex items-center gap-2 text-slate-700"><Loader2 className="h-5 w-5 animate-spin" /> Uploading...</div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-[#1a3a8e]" />
                  <div className="mt-2 text-sm font-semibold text-slate-800">Drag &amp; drop images here, or click to browse</div>
                  <div className="text-xs text-slate-500 mt-0.5">PNG, JPG, WebP up to 3MB each</div>
                </>
              )}
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-slate-200">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImg(i)} className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 btn-transition"><X className="h-3 w-3" /></button>
                    {i === 0 && <div className="absolute bottom-1 left-1 bg-[#1a3a8e] text-white text-[10px] px-1.5 py-0.5 rounded">Cover</div>}
                  </div>
                ))}
              </div>
            )}
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
                <SelectContent>{mainCategories.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sub-Category</Label>
              <Select value={form.subcategory} onValueChange={(v) => setForm({ ...form, subcategory: v })} disabled={!form.category}>
                <SelectTrigger><SelectValue placeholder={form.category ? "Select sub-category" : "Pick a category first"} /></SelectTrigger>
                <SelectContent>{subcats.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price (₹) *</Label>
              <div className="relative"><IndianRupee className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="pl-9" placeholder="e.g. 850000" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Piece","Kg","Meter","Ton","Box","Set","Unit","Liter"].map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Minimum Order Qty</Label>
              <div className="relative"><Boxes className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} className="pl-9" placeholder="e.g. 10" /></div>
            </div>
            <div className="space-y-1.5"><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Shakti" /></div>
            <div className="space-y-1.5"><Label>HSN Code</Label><Input value={form.hsn} onChange={(e) => setForm({ ...form, hsn: e.target.value })} placeholder="e.g. 8458" /></div>
            <div className="space-y-1.5"><Label>GST Rate (%)</Label><Input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} placeholder="e.g. 18" /></div>
            <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Rajkot" /></div>
            <div className="space-y-1.5"><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. Gujarat" /></div>
            <div className="md:col-span-2 space-y-1.5"><Label>Product Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Specifications, features, materials, certifications..." /></div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <Button type="submit" disabled={saving} className="bg-[#f58220] hover:bg-[#e07010] text-white btn-transition">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving</> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Save Product</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setForm(empty); setImages([]); }} className="border-slate-300 btn-transition">Reset</Button>
            <span className="text-xs text-slate-500 ml-auto">{list.length} product(s) in catalog</span>
          </div>
        </form>

        <aside className="bg-white rounded-lg border border-slate-200 psi-shadow p-5">
          <h3 className="text-base font-bold text-slate-900">My Catalog</h3>
          <p className="text-xs text-slate-500 mt-1">Products listed under your seller account.</p>
          <div className="mt-4 space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {listLoading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : list.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-md p-6 text-center text-sm text-slate-500">No products yet.</div>
            ) : list.map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-md p-3 flex gap-3 items-start">
                <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {p.images && p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{p.category}{p.subcategory ? ` / ${p.subcategory}` : ""}</div>
                  <div className="text-xs mt-1"><span className="font-bold text-[#1a3a8e]">₹ {Number(p.price).toLocaleString("en-IN")}</span><span className="text-slate-500"> /{p.unit}  MOQ: {p.moq}</span></div>
                </div>
                <button onClick={() => removeItem(p.id)} className="text-slate-400 hover:text-red-600 btn-transition" title="Remove"><Trash2 className="h-4 w-4" /></button>
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
