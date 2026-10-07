// Mock data for Product Search India B2B portal

export const LOGO_URL =
  "https://customer-assets-gfyr7b9c.emergentagent.net/job_5f8b2ae1-64e9-4c91-a0a8-96db2f9197de/artifacts/49c82e0f68a1363e_logo.png";

export const topNavLinks = [
  { label: "Post Buy Requirement", to: "/post-requirement", highlight: true },
  { label: "Sell on PSI", to: "/login?tab=seller" },
  { label: "Help", to: "#" },
  { label: "Download App", to: "#" },
];

export const mainCategories = [
  { name: "Industrial Machinery", image: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85", count: "12,450+ Products" },
  { name: "Electrical & Electronics", image: "https://images.unsplash.com/photo-1553873002-785d775854c9?crop=entropy&cs=srgb&fm=jpg&q=85", count: "8,230+ Products" },
  { name: "Construction Materials", image: "https://images.unsplash.com/photo-1533378890784-b2a5b0a59d40?crop=entropy&cs=srgb&fm=jpg&q=85", count: "5,620+ Products" },
  { name: "Pipes, Tubes & Valves", image: "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?crop=entropy&cs=srgb&fm=jpg&q=85", count: "3,180+ Products" },
  { name: "Textiles & Fabrics", image: "https://images.unsplash.com/photo-1542044801-30d3e45ae49a?crop=entropy&cs=srgb&fm=jpg&q=85", count: "9,870+ Products" },
  { name: "Steel & Metal Products", image: "https://images.unsplash.com/photo-1697698532634-ea59b636ccea?crop=entropy&cs=srgb&fm=jpg&q=85", count: "4,560+ Products" },
  { name: "Safety & Protective Gear", image: "https://images.unsplash.com/photo-1552879890-3a06dd3a06c2?crop=entropy&cs=srgb&fm=jpg&q=85", count: "2,340+ Products" },
  { name: "Packaging Materials", image: "https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=srgb&fm=jpg&q=85", count: "6,120+ Products" },
];

export const subCategoriesByMain = {
  "Industrial Machinery": ["CNC Machines", "Lathe Machines", "Hydraulic Press", "Welding Machines", "Compressors", "Generators"],
  "Electrical & Electronics": ["LED Lights", "Switchgears", "Transformers", "Cables & Wires", "Solar Panels", "Inverters"],
  "Construction Materials": ["Cement", "TMT Bars", "Bricks & Blocks", "Tiles & Marbles", "Plywood", "Paints"],
  "Pipes, Tubes & Valves": ["MS Pipes", "GI Pipes", "PVC Pipes", "Ball Valves", "Gate Valves", "Flanges"],
  "Textiles & Fabrics": ["Cotton Fabric", "Polyester", "Silk", "Denim", "Linen", "Wool"],
  "Steel & Metal Products": ["Steel Sheets", "Aluminium Rods", "Copper Wires", "Brass Fittings", "Iron Rods", "Scrap Metal"],
  "Safety & Protective Gear": ["Helmets", "Safety Shoes", "Gloves", "Masks", "Harness", "Goggles"],
  "Packaging Materials": ["Corrugated Boxes", "Bubble Wrap", "PP Bags", "Stretch Film", "Tapes", "Labels"],
};

export const featuredProducts = [
  { id: 1, name: "Heavy Duty CNC Lathe Machine", price: "₹ 8,50,000", unit: "per Piece", moq: "1 Piece", company: "Shakti Industrial Works", city: "Rajkot, Gujarat", verified: true, image: "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 2, name: "MS Seamless Pipe (Industrial Grade)", price: "₹ 95", unit: "per Kg", moq: "500 Kg", company: "Bharat Steel & Tubes", city: "Mumbai, Maharashtra", verified: true, image: "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 3, name: "LED High Bay Light 200W", price: "₹ 2,450", unit: "per Piece", moq: "50 Pieces", company: "Lumina Electricals Pvt Ltd", city: "Delhi, NCR", verified: true, image: "https://images.unsplash.com/photo-1553873002-785d775854c9?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 4, name: "Industrial Safety Helmet (ISI)", price: "₹ 320", unit: "per Piece", moq: "100 Pieces", company: "SafeGuard Workwear", city: "Pune, Maharashtra", verified: false, image: "https://images.unsplash.com/photo-1552879890-3a06dd3a06c2?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 5, name: "Cotton Denim Fabric Roll", price: "₹ 185", unit: "per Meter", moq: "500 Meters", company: "Vijay Textiles Mills", city: "Surat, Gujarat", verified: true, image: "https://images.unsplash.com/photo-1542044801-30d3e45ae49a?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 6, name: "Stainless Steel Sheet 304 Grade", price: "₹ 215", unit: "per Kg", moq: "1000 Kg", company: "Metalex Alloys", city: "Jamnagar, Gujarat", verified: true, image: "https://images.unsplash.com/photo-1697698532634-ea59b636ccea?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 7, name: "Corrugated Shipping Boxes", price: "₹ 42", unit: "per Box", moq: "500 Boxes", company: "Pack & Go Industries", city: "Noida, UP", verified: false, image: "https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 8, name: "Hydraulic Power Press 100 Ton", price: "₹ 4,25,000", unit: "per Unit", moq: "1 Unit", company: "Precision Hydro Works", city: "Ludhiana, Punjab", verified: true, image: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 9, name: "Industrial Ball Valve 2 inch SS304", price: "₹ 1,250", unit: "per Piece", moq: "25 Pieces", company: "Flowtech Valves India", city: "Coimbatore, Tamil Nadu", verified: true, image: "https://images.unsplash.com/photo-1538474705339-e87de81450e8?crop=entropy&cs=srgb&fm=jpg&q=85" },
  { id: 10, name: "Heavy Duty Industrial Compressor 50HP", price: "₹ 2,85,000", unit: "per Unit", moq: "1 Unit", company: "AirMax Engineering Co.", city: "Chennai, Tamil Nadu", verified: true, image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?crop=entropy&cs=srgb&fm=jpg&q=85" },
];

export const productDetails = {
  description:
    "Premium industrial-grade product manufactured in India under strict ISO 9001:2015 quality standards. Suitable for heavy-duty commercial, infrastructure and manufacturing applications. Backed by on-site technical support and a 12-month manufacturer warranty.",
  highlights: [
    "ISO 9001:2015 certified manufacturing",
    "12-month warranty with on-site support",
    "Pan-India delivery in 7-10 business days",
    "Custom specifications & bulk pricing available",
    "GST invoice & export documentation provided",
  ],
  specifications: [
    { key: "Brand", value: "PSI Verified" },
    { key: "Country of Origin", value: "India" },
    { key: "Material", value: "Industrial Grade" },
    { key: "Warranty", value: "12 Months" },
    { key: "Packaging Type", value: "Wooden Crate / Carton" },
    { key: "Delivery Time", value: "7-10 Working Days" },
    { key: "Payment Terms", value: "30% Advance, 70% Before Dispatch" },
    { key: "Supply Ability", value: "500+ units / month" },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1717386255773-1e3037c81788?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1697698532634-ea59b636ccea?crop=entropy&cs=srgb&fm=jpg&q=85",
    "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?crop=entropy&cs=srgb&fm=jpg&q=85",
  ],
  seller: {
    yearEstablished: 2008,
    gst: "24AABCS1429R1Z5",
    annualTurnover: "₹ 25 - 50 Crore",
    employees: "150-200",
    certifications: ["ISO 9001:2015", "CE Certified", "BIS Approved"],
    responseRate: "96%",
    responseTime: "Within 2 hours",
    rating: 4.6,
    reviews: 284,
  },
};

export const cities = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Coimbatore", "Ludhiana",
];

export const tradeLeads = [
  { id: 1, title: "Required: 2000 Kg MS Seamless Pipes (OD 50mm)", buyer: "Reliance Infra Projects", location: "Mumbai, India", posted: "2 hours ago", qty: "2000 Kg" },
  { id: 2, title: "Looking for CNC Vertical Machining Center", buyer: "Mahindra Auto Components", location: "Pune, India", posted: "5 hours ago", qty: "3 Units" },
  { id: 3, title: "Bulk Order: Industrial Safety Helmets with ISI mark", buyer: "L&T Construction", location: "Hyderabad, India", posted: "8 hours ago", qty: "5000 Pieces" },
  { id: 4, title: "Need Cotton Fabric 100% combed for export", buyer: "Arvind Exports Ltd", location: "Ahmedabad, India", posted: "1 day ago", qty: "10000 Meters" },
  { id: 5, title: "Required LED High Bay Lights 150W/200W", buyer: "Adani Logistics Park", location: "Mundra, Gujarat", posted: "1 day ago", qty: "800 Pieces" },
  { id: 6, title: "Procurement: SS 304 Sheets 2mm thickness", buyer: "Godrej Interio", location: "Mohali, Punjab", posted: "2 days ago", qty: "5 Tons" },
];

export const stats = [
  { label: "Verified Suppliers", value: "5.2 Lakh+" },
  { label: "Products Listed", value: "62 Lakh+" },
  { label: "Buyers Worldwide", value: "1.8 Crore+" },
  { label: "Buy Requirements", value: "18,500/day" },
];

export const trustedBrands = [
  "TATA", "RELIANCE", "ADANI", "L&T", "MAHINDRA", "BAJAJ", "GODREJ", "BIRLA",
];

export const footerColumns = {
  "About Product Search India": ["About Us", "Our Services", "Careers", "Press & Media", "Terms of Use", "Privacy Policy"],
  "For Buyers": ["Post Buy Requirement", "Search Products", "Verified Suppliers", "Trade Alerts", "Buyer Protection"],
  "For Sellers": ["Sell on PSI", "Membership Plans", "Lead Manager", "Catalog Builder", "Seller Help"],
  "Support": ["Help Center", "Contact Us", "Report Spam", "Dispute Resolution", "Site Map"],
};

export const demoProducts = JSON.parse(
  typeof window !== "undefined" ? localStorage.getItem("psi_demo_products") || "[]" : "[]"
);
