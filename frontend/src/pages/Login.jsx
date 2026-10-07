import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, Store, UserCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { LOGO_URL } from "../mock/mock";

const Login = () => {
  const [sp] = useSearchParams();
  const defaultTab = sp.get("tab") === "seller" ? "seller" : "buyer";
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", phone: "", company: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e, role) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Missing details", description: "Please enter email and password." });
      return;
    }
    localStorage.setItem("psi_user", JSON.stringify({ email: form.email, role, loggedAt: Date.now() }));
    toast({ title: `Welcome ${role === "seller" ? "Seller" : "Buyer"}!`, description: "You are now signed in." });
    setTimeout(() => navigate(role === "seller" ? "/add-product" : "/"), 500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
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
        </div>
        <div className="mt-8 text-xs text-white/70"> {new Date().getFullYear()} Product Search India Pvt Ltd</div>
      </div>

      {/* Right panel  form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-600 mt-1">Choose your account type to continue</p>

          <Tabs defaultValue={defaultTab} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="buyer" className="data-[state=active]:bg-[#1a3a8e] data-[state=active]:text-white">Buyer Login</TabsTrigger>
              <TabsTrigger value="seller" className="data-[state=active]:bg-[#f58220] data-[state=active]:text-white">Seller Login</TabsTrigger>
            </TabsList>

            {["buyer", "seller"].map((role) => (
              <TabsContent key={role} value={role} className="mt-5">
                <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Email / Mobile</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9" placeholder="you@company.com or +91 98xxx xxxxx" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-9 pr-9" placeholder="Your password" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {role === "seller" && (
                    <div className="space-y-1.5">
                      <Label>Company Name</Label>
                      <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Shakti Industrial Works" />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="accent-[#1a3a8e]" /> Remember me</label>
                    <a href="#" className="text-[#1a3a8e] hover:text-[#f58220] font-medium btn-transition">Forgot Password?</a>
                  </div>
                  <Button type="submit" className={`w-full btn-transition text-white ${role === "seller" ? "bg-[#f58220] hover:bg-[#e07010]" : "bg-[#1a3a8e] hover:bg-[#15306f]"}`}>
                    Sign In as {role === "seller" ? "Seller" : "Buyer"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full border-slate-300 hover:border-[#1a3a8e] btn-transition" onClick={() => navigate("/add-product")}>
                    <Phone className="h-4 w-4 mr-2" /> Post Buy Requirement
                  </Button>
                  <div className="text-center text-sm text-slate-600">
                    New to PSI?{" "}
                    <Link to="/login?tab=seller" className="text-[#1a3a8e] hover:text-[#f58220] font-semibold btn-transition">Create a free account</Link>
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
