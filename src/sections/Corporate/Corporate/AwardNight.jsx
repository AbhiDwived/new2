"use client"

import React from 'react';
import { FiArrowLeft, FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import Link from 'next/link';

const AwardNight = () => {
  const rooms = [
    {
      id: 1,
      name: "Executive Conference Center",
      location: "Downtown Business District",
      capacity: "12-50 people",
      priceRange: "Rs 200 - Rs 500 per hour",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["4K Projector", "Video Conferencing", "Whiteboard", "+3 more"]
    },
    {
      id: 2,
      name: "Tech Hub Meeting Space",
      location: "Innovation District",
      capacity: "8-30 people",
      priceRange: "Rs 150 - Rs 400 per hour",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["Smart Board", "360° Camera", "Wireless Presentation", "+3 more"]
    },
    {
      id: 3,
      name: "Skyline Conference Room",
      location: "Financial District",
      capacity: "15-60 people",
      priceRange: "Rs 300 - Rs 700 per hour",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["City Views", "Premium Audio System", "Climate Control", "+1 more"]
    },
    {
      id: 4,
      name: "Creative Workshop Space",
      location: "Arts Quarter",
      capacity: "10-25 people",
      priceRange: "Rs 120 - Rs 350 per hour",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["Flexible Seating", "Art Supplies", "Natural Light", "+2 more"]
    },
    {
      id: 5,
      name: "Green Conference Center",
      location: "Eco Business Park",
      capacity: "20-40 people",
      priceRange: "Rs 180 - Rs 450 per hour",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["Eco-Friendly", "Garden Views", "Solar Power", "+2 more"]
    },
    {
      id: 6,
      name: "Heritage Meeting Hall",
      location: "Historic Center",
      capacity: "25-80 people",
      priceRange: "Rs 250 - Rs 600 per hour",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: ["Historic Architecture", "Grand Piano", "Catering Kitchen", "+1 more"]
    }
  ];

  window.scrollTo({ top: 0, category: "top" })
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium text-gray-700">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="lg:mx-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/corporate" style={{ textDecoration: "none", width: '250px' }} className="flex items-center  hover:text-gray-800 transition-colors mb-6 border py-2 text-black rounded-md">
            <FiArrowLeft className="w-4 h-4 mx-3" />
            Back to Corporate Services
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Award Nights
          </h1>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Room Image */}
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-sm">
                  {renderStars(room.rating)}
                </div>
              </div>

              {/* Room Details */}
              <div className="p-3">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  {room.name}
                </h5>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {room.location}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <FiUsers className="w-4 h-4 mr-1" />
                  {room.capacity}
                </div>

                <div className="text-lg font-semibold text-gray-900 mb-4">
                  {room.priceRange}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.features.map((feature, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-md ${feature.includes('+')
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button variant="outline" style={{ borderRadius: "5px" }} className="flex-1 text-sm hover:bg-gray-50">
                    View Details
                  </button>
                  <button style={{ borderRadius: "5px" }} className="flex-1 py-2 text-sm text-white bg-[#0F4C81] hover:bg-[#0F4C81]">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardNight;
