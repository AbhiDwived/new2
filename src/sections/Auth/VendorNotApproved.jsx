"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineMail, HiOutlinePhone, HiOutlineChatAlt2 } from 'react-icons/hi';

const NotApproved = () => {
  const [vendorInfo, setVendorInfo] = useState(null);

  useEffect(() => {
    const storedVendor = "" // localStorage.getItem('vendor');
  

    if (storedVendor) {
      setVendorInfo(JSON.parse(storedVendor));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-xl text-center">
        {/* Icon */}
        <div className="mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5957/5957410.png"
            alt="Access Denied"
            className="mx-auto w-24 h-24"
          />
        </div>

        <h3 className="text-3xl font-extrabold text-gray-600 mb-2">Account Pending Approval</h3>

        {/* Vendor Info Section */}
        {vendorInfo && (
          <div className="text-left bg-gray-50 p-3 rounded-md mb-6 shadow-inner">
            <p className="text-white p-2 rounded   mb-6 text-sm bg-[#6B9AC4]">
              Your vendor account is currently pending approval from our team.
              Please check back later or contact our support team below for help.
            </p>
            <p className="text-sm text-gray-700 mb-2"><strong>Business Name:</strong> {vendorInfo.businessName || 'N/A'}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Email:</strong> {vendorInfo.email || 'N/A'}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Phone:</strong> {vendorInfo.phone || 'N/A'}</p>
            <p className="text-sm text-gray-700"><strong>Vendor Type:</strong> {vendorInfo.vendorType || 'N/A'}</p>
          </div>
        )}



        {/* Contact Info */}
        <div className="space-y-4 mb-6 text-left">
          <h5 className='mb-3'>Reach Out to Our Support Team</h5>
          <div className="flex items-center gap-3">
            <HiOutlineMail className="text-blue-900 text-xl" />
            <span className="text-gray-700 text-sm">Email: <a href="mailto:admin@mybestvenue.com" style={{ textDecoration: 'none' }} className="text-black">admin@mybestvenue.com</a></span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlinePhone className="text-blue-900 text-xl" />
            <span className="text-gray-700 text-sm">Phone: <a href="tel:9990555740" style={{ textDecoration: 'none' }} className="text-black">+91 9990555740</a></span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineChatAlt2 className="text-blue-900 text-xl" />
            <span className="text-gray-700 text-sm">WhatsApp: <a href="https://wa.me/9990555740" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} className="text-black">Chat Now</a></span>
          </div>
        </div>

        {/* Back to Login */}
        <Link
          href="/vendor/login"
          style={{ textDecoration: 'none' }}
          className="inline-block bg-[#0F4C81] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#0f4c81df] transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default NotApproved;
