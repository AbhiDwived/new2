"use client"

import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  CiFlag1, CiLocationOn, CiShoppingTag
} from "react-icons/ci";
import {
  IoIosArrowRoundForward, IoIosArrowRoundBack
} from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { IoFastFoodOutline, IoPeople } from "react-icons/io5";

const BlueDimondVenue = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const images = [
    { src: "/VenueNoida1.jpg" },
    { src: "/VenueNoida2.jpg" },
    { src: "/VenueNoida3.webp" },
    { src: "/Images/GreaterNoida.jpg" },
    
  ];

  const menuOptions = [
    "North Indian / Mughlai", "Italian / European / Continental",
    "Chinese / Thai / Oriental", "South Indian",
    "Garlic Free / Onion Free", "Live Food Counters",
    "Chaat & Indian Street Food", "Seafood", "Drinks (Non-Alcoholic)",
  ];

  return (
    <>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Blue Dimond Venue</h2>

      {/* Gallery */}
      <div className="grid grid-cols-1 p-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
        {images.map((img, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <img
              src={img.src}
              alt={`Venue ${i + 1}`}
              className="w-full h-40 sm:h-48 md:h-56 object-cover"
            />
            <div className="p-2">
              <h4 className="text-sm font-semibold">Venue {i + 1}</h4>
              <p className="text-xs text-gray-500">Click to view more</p>
            </div>
          </div>
        ))}
      </div>



      {/* Lightbox */}
      <Lightbox open={open} close={() => setOpen(false)} slides={images} index={index} />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="w-full lg:w-2/3 p-3">
          <div className="flex flex-wrap gap-2 p-3 font-semibold rounded-2xl text-sm">
            {["About", "FAQ", "Reviews 7", "Promotions 1", "Map"].map((label, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm"
              >
                {label}
              </button>
            ))}
          </div>
          <hr className="border border-gray-200 mt-3" />

          {/* About */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold">About</h2>
            <div className="flex flex-col sm:flex-row p-3 gap-2">
              <p className="flex items-center gap-1 text-sm sm:text-base font-light">
                <CiFlag1 /> On mybestvenue.in since 2024
              </p>
              <p className="text-sm sm:text-base font-light">
                Last update: November 2025
              </p>
            </div>
            <div className="bg-white font-semibold p-3 shadow rounded-md">
              <p className="text-sm sm:text-base">
                Blue Diamond, Perfect venue for every occasion
              </p>
            </div>

            <div className="mt-4 text-sm sm:text-base">
              <p className="font-semibold leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident eos illum
                consequatur fuga pariatur nisi...
              </p>
            </div>

            {/* Expandable */}
            <div className="mt-4 font-semibold p-2">
              <h5 className="text-base">Know your wedding space at VRC Convention</h5>
              {isExpanded && (
                <p className="text-sm font-light mt-2">
                  Opened for bookings in August 2024, VRC Convention is a modern venue
                  with exceptional, well-designed facilities. Situated on the service road
                  at ORR Exit 11...
                </p>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm text-black font-light border-b border-black flex items-center gap-1"
              >
                {isExpanded ? <>Read Less <IoIosArrowRoundBack /></> : <>Read More <IoIosArrowRoundForward /></>}
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10 text-sm sm:text-base">
            <h3 className="text-lg font-bold">Frequently Asked Questions</h3>

            {[["Rental pricing per day?", "₹7,00,000"],
            ["Are you hosting events during COVID19?", "Yes"],
            ["Price of 20-item non-veg menu for 300 PAX?", "₹1,750"]].map(([q, a], i) => (
              <div key={i} className="mt-5">
                <p>{q}</p>
                <p className="mt-2 font-semibold">{a}</p>
                <hr className="border border-black mt-4" />
              </div>
            ))}
          </div>

          {/* Menus */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">Menus & Catering Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuOptions.map((option, i) => (
                <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
                  <FaCheck className="text-green-500" /> {option}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Expansion */}
          <div className="font-semibold mt-10">
            {isExpanded && (
              <p className="text-sm font-light">
                How would you describe your event spaces?
              </p>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-medium flex items-center gap-2"
            >
              {isExpanded ? <>Read Less FAQ <IoIosArrowRoundBack /></> : <>Read More FAQ <IoIosArrowRoundForward /></>}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/2 lg:h-100 p-4 bg-white text-black rounded-md shadow sticky top-24">
          <h3 className="text-lg font-bold">Blue Dimond Convention</h3>
          <p className="mt-2 text-sm text-gray-600">5.0 Fantastic · 7 reviews</p>
          <p className="flex items-center mt-3 text-sm"><CiLocationOn className="mr-1" />Greater Noida - Pari Chowk</p>
          <p className="flex items-center mt-2 text-sm"><CiShoppingTag className="mr-1" />1 Promotion</p>

          <div className="bg-gray-50 shadow p-4 mt-4 rounded-lg space-y-2 text-sm">
            <p className="flex items-center"><IoFastFoodOutline className="mr-2" />Price Per Plate ₹1,000</p>
            <p className="flex items-center"><IoPeople className="mr-2" />100 to 3000 guests</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlueDimondVenue;
