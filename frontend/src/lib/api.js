import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

client.interceptors.request.use((cfg) => {
  try {
    const raw = localStorage.getItem("psi_auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return cfg;
});

export const api = {
  // auth
  register: (data) => client.post("/auth/register", data).then((r) => r.data),
  login: (data) => client.post("/auth/login", data).then((r) => r.data),
  me: () => client.get("/auth/me").then((r) => r.data),

  // products
  featured: () => client.get("/products/featured").then((r) => r.data),
  listProducts: (params = {}) => client.get("/products", { params }).then((r) => r.data),
  getProduct: (id) => client.get(`/products/${id}`).then((r) => r.data),
  createProduct: (data) => client.post("/products", data).then((r) => r.data),
  deleteProduct: (id) => client.delete(`/products/${id}`).then((r) => r.data),
  myProducts: () => client.get("/products/mine").then((r) => r.data),

  // suppliers
  getSupplier: (id) => client.get(`/suppliers/${id}`).then((r) => r.data),

  // enquiries
  postEnquiry: (data) => client.post("/enquiries", data).then((r) => r.data),
  myEnquiries: () => client.get("/enquiries/mine").then((r) => r.data),

  // upload (multipart)
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await client.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return r.data;
  },
};

export default client;
