import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { LOGO_URL, footerColumns } from "../mock/mock";

const Footer = () => {
  return (
    <footer className="bg-[#0e1f4d] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <img src={LOGO_URL} alt="PSI" className="h-14 bg-white rounded-md p-2 inline-block" />
          <p className="mt-4 text-sm leading-relaxed">
            Product Search India (PSI) is a leading B2B industrial marketplace connecting verified Indian manufacturers, suppliers and exporters with buyers across India and the world.
          </p>
          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#f58220]" /> +91 1800-123-456</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#f58220]" /> support@productsearchindia.com</div>
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-[#f58220] mt-0.5" /> Industrial Area Phase-II, New Delhi  110020, India</div>
          </div>
        </div>
        {Object.entries(footerColumns).map(([title, items]) => (
          <div key={title}>
            <div className="text-white font-semibold mb-3 text-sm">{title}</div>
            <ul className="space-y-2 text-sm">
              {items.map((i) => (
                <li key={i}><Link to="#" className="hover:text-[#f58220] btn-transition">{i}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div> {new Date().getFullYear()} Product Search India Pvt Ltd. All rights reserved.</div>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, idx) => (
              <a key={idx} href="#" className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#f58220] flex items-center justify-center btn-transition">
                <Icon className="h-4 w-4 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
