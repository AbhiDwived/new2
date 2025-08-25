"use client"

import React, { useState } from 'react';
import {
  FaCamera, FaGift, FaMusic, FaPen, FaTruck, FaEnvelope, FaUtensils,
  FaFilm, FaLeaf, FaBirthdayCake, FaDoorOpen, FaPlane, FaSmile, FaBullhorn
} from 'react-icons/fa';

const primaryVendors = [
  { label: 'Wedding Photographers', icon: <FaCamera /> },
  { label: 'Wedding Videography', icon: <FaFilm /> },
  { label: 'Wedding Music', icon: <FaMusic /> },
  { label: 'Caterers', icon: <FaUtensils /> },
  { label: 'Wedding Transportation', icon: <FaTruck /> },
  { label: 'Wedding Invitations', icon: <FaEnvelope /> },
  { label: 'Wedding Gifts', icon: <FaGift /> },
  { label: 'Florists', icon: <FaLeaf /> },
  { label: 'Wedding Planners', icon: <FaPen /> },
];

const additionalVendors = [
  { label: 'Wedding Choreographers', icon: <FaGift /> },
  { label: 'Photobooth', icon: <FaCamera /> },
  { label: 'Wedding DJ', icon: <FaMusic /> },
  { label: 'Wedding Cakes', icon: <FaBirthdayCake /> },
  { label: 'Wedding Decorators', icon: <FaGift /> },
  { label: 'Party Places', icon: <FaGift /> },
  { label: 'Honeymoon', icon: <FaPlane /> },
  { label: 'Wedding Entertainment', icon: <FaSmile /> },
  { label: 'Tent House', icon: <FaDoorOpen /> },
  { label: 'Promotions', icon: <FaBullhorn /> },
];

const HiringVendors = () => {
  // const [activeTab, setActiveTab] = useState<'Primary Vendors' | 'Additional Services'>('Primary Vendors');
  const [activeTab, setActiveTab] = useState('Primary Vendors');


  const vendors = activeTab === 'Primary Vendors' ? primaryVendors : additionalVendors;

  return (
    <section className="py-20 bg-gray-50 text-center font-serif px-4">
      <h2 className="text-3xl font-bold mb-6">Start hiring your vendors</h2>

      {/* Tabs */}
      <div className="inline-flex mb-10 border rounded-md overflow-hidden bg-white shadow-sm">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Primary Vendors' ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
          }`}
          onClick={() => setActiveTab('Primary Vendors')}
        >
          Primary Vendors
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Additional Services' ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
          }`}
          onClick={() => setActiveTab('Additional Services')}
        >
          Additional Services
        </button>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {vendors.map((vendor, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white rounded-md shadow-sm hover:shadow-md transition"
          >
            <div className="w-10 h-10 bg-gray-100 text-blue-900 flex items-center justify-center rounded-full text-lg">
              {vendor.icon}
            </div>
            <span className="text-gray-800 text-sm font-medium text-left">{vendor.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HiringVendors;
