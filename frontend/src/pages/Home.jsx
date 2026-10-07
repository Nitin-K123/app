import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import { TradeLeads, CityListings, StatsBar, TrustedBrands, JoinCTA } from "../components/Sections";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <StatsBar />
      <Categories />
      <FeaturedProducts />
      <TradeLeads />
      <CityListings />
      <TrustedBrands />
      <JoinCTA />
      <Footer />
    </div>
  );
};

export default Home;
