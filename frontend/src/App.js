import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail";
import SupplierProfile from "./pages/SupplierProfile";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";

function App() {
  useEffect(() => {
    document.title = "Product Search India  B2B Industrial Marketplace";
  }, []);
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/post-requirement" element={<AddProduct />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/supplier/:id" element={<SupplierProfile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
