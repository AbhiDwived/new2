"use client";

import React from "react";
import { useParams } from "next/navigation"; 
import {
  Building2,
  Hotel,
  MapPin,
  Crown,
  Building,
  Home,
  Camera,
  Users,
  Gift,
  Pencil,
  Sparkles,
  Calendar,
} from "lucide-react";

import CategorySelector from "./CategorySelector";

// Vendor category list
const categories = [
  { id: "banquet-halls", title: "Banquet Halls", subtitle: "Venues", icon: Building2 },
  { id: "hotels", title: "Hotels", subtitle: "Venues", icon: Hotel },
  { id: "marriage-garden", title: "Marriage Garden", subtitle: "Venues", icon: MapPin },
  { id: "kalyana-mandapams", title: "Kalyana Mandapams", subtitle: "Venues", icon: Crown },
  { id: "wedding-resorts", title: "Wedding Resorts", subtitle: "Venues", icon: Building },
  { id: "wedding-lawns", title: "Wedding Lawns & Farmhouses", subtitle: "Venues", icon: Home },
  { id: "wedding-photographers", title: "Wedding Photographers", subtitle: "Vendors", icon: Camera },
  { id: "party-places", title: "Party Places", subtitle: "Vendors", icon: Users },
  { id: "caterers", title: "Caterers", subtitle: "Vendors", icon: Gift },
  { id: "wedding-decorators", title: "Wedding Decorators", subtitle: "Vendors", icon: Pencil },
  { id: "wedding-makeup", title: "Wedding Makeup", subtitle: "Vendors", icon: Sparkles },
  { id: "wedding-planners", title: "Wedding Planners", subtitle: "Vendors", icon: Calendar },
];

const LocationVendors = ({ selectedCity }) => {
  const params = useParams();
  const cityFromUrl = params?.city;

  // Priority: selectedCity prop > URL param > fallback
  const rawCity = selectedCity || cityFromUrl || "All India";

  // Format city name for display (e.g., new-delhi → New Delhi)
  const formattedCity = rawCity
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-20 text-black">
        <div className="mx-auto text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-playfair text-white">
            Find Vendors by Category in {formattedCity}
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Choose from venues and vendor categories below
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <CategorySelector categories={categories} formattedCity={formattedCity} />
    </>
  );
};

export default LocationVendors;
