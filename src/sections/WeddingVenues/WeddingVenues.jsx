"use client"

import React, { useState, useEffect } from "react";
import BrowseVenues from "./BrowserVenues"; // corrected the filename (your previous was BrowserVenues, check your actual file)
import WeddingVenuesCity from "./WeddingVenuesCity";

export default function WeddingVenues({ params }) {
  const [searchTerm, setSearchTerm] = useState("");
  const cityFromParams = params?.city ? params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "All India";
  const [selectedCity, setSelectedCity] = useState(cityFromParams);
  
  // Only update from params on initial load or when params actually change
  useEffect(() => {
    if (params?.city) {
      const newCity = params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      setSelectedCity(newCity);
    }
  }, [params?.city]);
  
  // Debug log when selectedCity changes
  useEffect(() => {

  }, [selectedCity]);

  return (
    <div className="relative">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
              Find Your Perfect Venues
            </h1>
            <p className="mb-8 text-sm sm:text-base md:text-lg text-white">
              Discover beautiful venues for weddings, corporate events, and special
              occasions
            </p>
            <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                style={{ borderRadius: "5px" }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
              // You can add an onClick here if needed
              >
                Search 
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browse Venues Section */}
      <div>
        <BrowseVenues
          currentLocation={selectedCity}
          onLocationSelect={(city) => {

            setSelectedCity(city);
          }}
          searchTerm={searchTerm}
        />
        {/* <LocationVendors selectedCity={selectedCity} /> */}
      </div>

      {/* City Venues Section */}
      <div>
        <WeddingVenuesCity searchTerm={searchTerm} location={selectedCity} />
      </div>
    </div>
  );
}
