"use client"

import React, { useState, useEffect } from 'react';
import { FaUserTie } from "react-icons/fa"
import { FaArrowTrendUp, FaAngleLeft, FaChevronRight } from "react-icons/fa6";
import SubDashboard from './SubDashboard';
import UserManagement from './UserManagement';
import VendorManagement from './VendorManagement';
import PendingApprovals from './PendingApprovals';
import ReviewModeration from './ReviewModeration';
import ContentManagement from './ContentManagement';
import Contact from './Contact';
import SubscriberManagement from './SubscriberManagement';
import BookingManagement from './BookingManagement';

import {
  useGetAllUsersQuery,
  useGetAllVendorsQuery,
  useGetPendingVendorsQuery,
} from '@/features/admin/adminAPI';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab') || 'Dashboard';
    setActiveTab(savedTab);
    setIsInitialized(true);
  }, []);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetAllVendorsQuery();
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingVendorsQuery();

  const tabs = [
    'Dashboard',
    'Booking',
    'User',
    'Vendor',
    'Pending Approvals',
    'Review Moderation',
    'Blogs',
    'Subscribers',
    'Contacts',
  ];

  const cardData = [
    {
      title: "Platform Statistics",
      stats: [
        {
          label: "Total Users",
          value: usersLoading
            ? "Loading..."
            : Array.isArray(usersData)
              ? usersData.length
              : usersData?.users?.length || 0,
        },
        {
          label: "Total Vendors",
          value: vendorsLoading
            ? "Loading..."
            : Array.isArray(vendorsData)
              ? vendorsData.length
              : vendorsData?.vendors?.length || 0,
        },
        {
          label: "Pending Approvals",
          value: pendingLoading
            ? "Loading..."
            : Array.isArray(pendingData)
              ? pendingData.length
              : pendingData?.vendors?.length || 0,
          className: "text-yellow-600 font-semibold"
        },
        {
          label: "Total Reviews",
          value: "8,569"
        }
      ]
    },
    {
      title: "User Activity",
      activity: {
        percent: 35,
        active: "4,325",
        inactive: "8,133",
        today: "+58",
        trend: "+12%",
      }
    },
    {
      title: "Revenue Overview",
      revenue: {
        total: "₹24,58,675",
        change: "+12.5%",
        breakdown: [
          { label: "Premium Vendors", value: "₹8,56,400" },
          { label: "Standard Vendors", value: "₹12,45,600" },
          { label: "Basic Vendors", value: "₹3,56,675" }
        ]
      }
    }
  ];

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-gray-800 space-y-6 font-serif">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 lg:m-5 m-3">
        <div>
          <span className="text-lg  lg:text-2xl font-bold">Admin Dashboard</span>
          <p className="text-gray-500 text-sm">Manage users, vendors, <br /> content, and platform settings</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm  text-white bg-[#0f4c81] hover:bg-[#DEBF78] rounded p-2  inline-flex items-center"
        >
          Preview Profile
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white p-3 rounded shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">{card.title}</h2>

            {/* Platform Statistics */}
            {card.stats && (
              <div>
                <div className="flex justify-between pr-20 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[0].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[0].value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[1].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[1].value}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-2 pr-20">
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[2].label}</p>
                    <p className={`text-base ${card.stats[2].className || "text-gray-800 font-bold"}`}>{card.stats[2].value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[3].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[3].value}</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Activity */}
            {card.activity && (
              <div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Active Users</span>
                  <span>{card.activity.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full my-1">
                  <div className="bg-[#0f4c81] h-4 rounded-full" style={{ width: `${card.activity.percent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{card.activity.active} active</span>
                  <span>{card.activity.inactive} inactive</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">New Registrations Today</span>
                  <span className="text-green-600 bg-[#c8faf4] font-semibold border border-green-600 rounded-full px-2">{card.activity.today}</span>
                </div>
                <span className="inline-flex items-center text-md text-green-500 mt-1">
                  <FaArrowTrendUp size={12} className="mr-1" /> {card.activity.trend} increase from yesterday
                </span>
              </div>
            )}

            {/* Revenue Overview */}
            {card.revenue && (
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-gray-800">{card.revenue.total}</p>
                  <p className="text-xs text-green-600 font-medium">{card.revenue.change}</p>
                </div>
                <div className="mt-2 text-xs text-gray-700 space-y-1">
                  {card.revenue.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="relative bg-[#f5f8fb] p-1 lg:mx-2 sm:p-2 rounded-md mb-6 overflow-hidden">
        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: -tabWidth * 3, behavior: 'smooth' });
            }
          }}
          style={{ borderRadius: "25px" }}
          className="absolute lg:hidden left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600"
        >
          <FaAngleLeft size={14} />
        </button>

        <div
          id="tabs-container"
          className="flex gap-3 lg:gap-1 overflow-x-auto scrollbar-hide "
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(tab);
                localStorage.setItem('adminActiveTab', tab);
              }}
              style={{ borderRadius: "5px" }}
              className={`px-3 py-1 rounded-md font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${tab === activeTab
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: tabWidth * 1, behavior: 'smooth' });
            }
          }}
          style={{ borderRadius: "25px" }}
          className="absolute lg:hidden right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600"
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      {/* Tab Content */}
      <div className=" rounded-lg overflow-hidden">
        {activeTab === 'Dashboard' && <SubDashboard />}
        {activeTab === 'Booking' && <BookingManagement />}
        {activeTab === 'User' && <UserManagement />}
        {activeTab === 'Vendor' && <VendorManagement />}
        {activeTab === 'Pending Approvals' && <PendingApprovals />}
        {activeTab === 'Review Moderation' && <ReviewModeration />}
        {activeTab === 'Blogs' && <ContentManagement />}
        {activeTab === 'Subscribers' && <SubscriberManagement />}
        {activeTab === 'Contacts' && <Contact />}
      </div>

      {/* ✅ Modal (Only addition) */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">

            {/* ❌ Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            >
              ×
            </button>

            {/* 🔵 Title */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Profile</h2>

            {/* 🧑 Profile Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500 font-medium">
                <FaUserTie size={35} /> {/* Can replace with dynamic first letter or FaUserTie */}
              </div>
            </div>

            {/* 🔤 Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <p className="text-gray-500 mb-1">Name</p>
                <p className="font-medium text-black">Nandani Kumari</p>
              </div>
              <div>

                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-black">admin@mybestvenue.com</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-black">9532930940</p>

              </div>
              <div>
                <p className="text-gray-500 mb-1">Access</p>
                <p className="font-medium text-black">Full Access</p>

              </div>
              <div>
                <p className="text-gray-700">Role</p>
                <p className="font-semibold text-black">Super Admin</p>

              </div>

              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>

            {/* 🚪 Close Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-md text-sm font-medium text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;
