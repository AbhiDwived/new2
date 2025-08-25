"use client"

import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { MdOutlineWifiCalling3 } from "react-icons/md";

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 mb-5">


        {/* Call */}
      <a
        href="tel:+919990555740"
        className="bg-[#0F4C81] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
        title="Call Now"
      >
        <MdOutlineWifiCalling3 size={24} />
      </a>
      {/* WhatsApp */}
      <a
        href="https://wa.me/+919990555740"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-200"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>

      
    </div>
  );
};

export default FloatingContactButtons;
