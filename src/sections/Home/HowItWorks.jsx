"use client"

import React from 'react';
import Link from 'next/link';

const steps = [
  {
    number: 1,
    title: 'Search Venues',
    description:
      'Browse through our extensive list of verified venues across India for any type of event.',
  },
  {
    number: 2,
    title: 'Compare & Contact',
    description:
      'Read reviews, compare prices, and send inquiries to your favorite venues and vendors.',
  },
  {
    number: 3,
    title: 'Book with Confidence',
    description:
      'Finalize details and book your perfect venue and vendors with our secure platform.',
  },
];

const HowItWorks = () => {
  return (
    <div className="font-serif">
      {/* How It Works Section */}
      <div className="py-14 sm:py-16 px-4 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto text-sm sm:text-base">
          Planning your event is easy with MyBestVenue. Find and book the perfect venue in just a few steps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:mx-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-lg hover:shadow-lg p-6 border transition duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                {step.number}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/venue"
            style={{textDecoration:'none'}}
            className="inline-block bg-[#0f4c81] text-white px-4 py-2 rounded-md hover:bg-[#0f4c81e7] transition text-md sm:text-base"
          >
            Find Venues & Vendors
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-14 sm:py-16 px-4 bg-[#1A5080] text-white text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to Start Planning Your Event?
        </h1>
        <p className="mb-8 max-w-2xl mx-auto text-white/90 text-sm sm:text-base">
          Join thousands of clients who found their perfect venues and vendors through MyBestVenue.
        </p>
        <div className="flex flex-row sm:flex-row justify-center items-center gap-2 mt-4">
          <Link
            href="/signup"
             style={{textDecoration:'none'}}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition text-md sm:text-base"
          >
            Sign Up Now
          </Link>
          <Link
            href="/login"
             style={{textDecoration:'none'}}
            className="border border-white text-white px-4 py-2 rounded-md hover:bg-white/10 transition text-md sm:text-base"
          >
            SignIn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
