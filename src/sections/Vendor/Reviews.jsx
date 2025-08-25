"use client"

import React from "react";

import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Rahul & Anjali Sharma",
    rating: 5,
    comment:
      "Absolutely amazing photography service! The team was professional, creative and captured all our special moments beautifully. Highly recommended!",
    date: "11/20/2023",
    avatar: "/Images/priya.png",
  },
  {
    name: "Aditya & Sneha Gupta",
    rating: 4,
    comment:
      "Great photos and good service. They were a bit late to arrive but made up for it with their excellent work. Would recommend with that small caveat.",
    date: "11/15/2023",
    avatar: "/Images/priya.png",
  },
  {
    name: "Nikhil & Pooja Verma",
    rating: 5,
    comment:
      "Wonderful experience working with them! They were patient, attentive to our needs, and delivered stunning photos that exceeded our expectations.",
    date: "11/10/2023",
    avatar: "/Images/priya.png",
  },
];

const ReviewSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2 font-serif">
      <div className="md:col-span-1 space-y-6">
        {/* Review Summary */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2 font-serif">Review Summary</h2>

          <div className="text-4xl font-bold flex flex-col items-center justify-center">
            <p className="mb-0">4.8</p>
            <div className="flex space-x-1 ">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" size={16} />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-4 font flex items-center justify-center">Based on 124 reviews</div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="inline-flex items-center">
                  {star} <FaStar className="ml-1 text-yellow-500" />
                </span>
                <div className="flex-1 bg-gray-200 h-2 rounded">
                  <div className=" h-2 rounded w-[60%]" />
                </div>
                <span className="text-sm">{star === 5 ? 2 : star === 4 ? 1 : 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Get More Reviews */}
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Get More Reviews</h2>
          <p className="text-sm text-gray-600 mb-4">
            Encourage your past clients to leave reviews by sending them a review request.
          </p>
          <button className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-blue-700 transition">
            Send Review Request
          </button>
        </div>
      </div>

      {/* Client Reviews */}
      <div className="border rounded-lg p-6 shadow md:col-span-2 font-serif">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Client Reviews</h2>
          <div className="relative inline-block">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Most Recent</option>
              <option>Highest Rating</option>
              <option>Lowest  Rating</option>
            </select>
            <MdOutlineArrowDropDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-t pt-4">
              <div className="flex items-center gap-4">
                
                <div className="bg-gray-100 rounded-full h-10 w-10 overflow-hidden">
                  <img
                    src={review.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="font-medium">{review.name}</div>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <div className="ml-auto text-sm text-gray-500">{review.date}</div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
              <div className="text-sm text-gray-800 mt-1 cursor-pointer hover:underline ml-auto flex justify-end">Reply to Review</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
