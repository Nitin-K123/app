import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, Store, UserCircle2, User, Building2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { LOGO_URL } from "../mock/mock";

const Login = () => {
  const [sp] = useSearchParams();
  const defaultTab = sp.get("tab") === "seller" ? "seller" : "buyer";
  const [mode, setMode] = useState("signin"); // signin | signup
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", company: "" });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Missing details", description: "Please enter email and password." });
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { user } = await login(form.email, form.password);
        toast({ title: `Welcome back, ${user.name || user.email}!`, description: `Signed in as ${user.role}.` });
        setTimeout(() => navigate(user.role === "seller" ? "/add-product" : "/"), 400);
      } else {
        if (!form.name) { toast({ title: "Name required" }); setBusy(false); return; }
        const { user } = await register({
          email: form.email, password: form.password, name: form.name,
          role, company: form.company, phone: form.phone,
        });
        toast({ title: "Account created ", description: `Welcome ${user.name}!` });
        setTimeout(() => navigate(role === "seller" ? "/add-product" : "/"), 400);
      }
    } catch (err) {
      toast({ title: "Sign-in failed", description: err?.response?.data?.detail || "Please check your credentials." });
    } finally { setBusy(false); }
  };

  const demoFill = (role) => {
    const map = {
      seller: { email: "shakti@psi-demo.in", password: "demo1234" },
      buyer: { email: "buyer@psi-demo.in", password: "demo1234" },
    };
    setForm({ ...form, ...map[role] });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 relative text-white p-8 md:p-14 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #1a3a8e 0%, #2b4fb3 70%, #15306f 100%)" }}>
        <div>
          <Link to="/" className="inline-block bg-white rounded-md p-2">
            <img src={LOGO_URL} alt="PSI" className="h-12" />
          </Link>
          <h1 className="mt-10 text-3xl md:text-4xl font-extrabold leading-tight">Welcome to <span className="text-[#f58220]">Product Search India</span></h1>
          <p className="mt-3 text-white/85 max-w-md">India&apos;s trusted B2B marketplace connecting buyers & verified industrial suppliers.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              { Icon: ShieldCheck, t: "5.2 Lakh+ verified suppliers" },
              { Icon: Store, t: "62 Lakh+ industrial products" },
              { Icon: UserCircle2, t: "18,500+ buy requirements posted daily" },
            ].map(({ Icon, t }, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-[#f58220] flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-white/10 border border-white/20 rounded-md backdrop-blur text-xs">
            <div className="font-semibold text-white mb-1">Try the demo seller account</div>
            <div className="text-white/80">Email: shakti@psi-demo.in  Password: demo1234</div>
            <button type="button" onClick={() => demoFill("seller")} className="mt-2 text-[#f58220] font-semibold hover:underline">Autofill demo credentials </button>
          </div>
        </div>
        <div className="mt-8 text-xs text-white/70"> {new Date().getFullYear()} Product Search India Pvt Ltd</div>
      </div>

      <div className="md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{mode === "signin" ? "Sign in to your account" : "Create your free account"}</h2>
          </div>
          <p className="text-sm text-slate-600">Choose your account type to continue</p>

          <Tabs defaultValue={defaultTab} className="mt-5">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="buyer" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Buyer</TabsTrigger>
              <TabsTrigger value="seller" className="data-[state=active]:bg-[#f58220] data-[state=active]:text-white">Seller</TabsTrigger>
            </TabsList>

            {["buyer", "seller"].map((role) => (
              <TabsContent key={role} value={role} className="mt-5">
                <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-3.5">
                  {mode === "signup" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Full Name *</Label>
                        <div className="relative"><User className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-9" placeholder="Your full name" /></div>
                      </div>
                      {role === "seller" && (
                        <div className="space-y-1.5">
                          <Label>Company Name</Label>
                          <div className="relative"><Building2 className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="pl-9" placeholder="e.g. Shakti Industrial Works" /></div>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <Label>Mobile</Label>
                        <div className="relative"><Phone className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-9" placeholder="+91 98xxx xxxxx" /></div>
                      </div>
                    </>
                  )}
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <div className="relative"><Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9" placeholder="you@company.com" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password *</Label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-9 pr-9" placeholder="Your password" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    </div>
                  </div>
                  {mode === "signin" && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="accent-[#1a3a8e]" /> Remember me</label>
                      <a href="#" className="text-[#1a3a8e] hover:text-[#f58220] font-medium btn-transition">Forgot Password?</a>
                    </div>
                  )}
                  <Button type="submit" disabled={busy} className={`w-full btn-transition text-white ${role === "seller" ? "bg-[#f58220] hover:bg-[#e07010]" : "bg-[#1a3a8e] hover:bg-[#15306f]"}`}>
                    {busy ? "Please wait..." : mode === "signin" ? `Sign In as ${role === "seller" ? "Seller" : "Buyer"}` : `Create ${role === "seller" ? "Seller" : "Buyer"} Account`}
                  </Button>
                  <div className="text-center text-sm text-slate-600">
                    {mode === "signin" ? (
                      <>New to PSI? <button type="button" onClick={() => setMode("signup")} className="text-[#1a3a8e] hover:text-[#f58220] font-semibold btn-transition">Create a free account</button></>
                    ) : (
                      <>Already a member? <button type="button" onClick={() => setMode("signin")} className="text-[#1a3a8e] hover:text-[#f58220] font-semibold btn-transition">Sign in instead</button></>
                    )}
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
