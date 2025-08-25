"use client"

import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { useGetVendorBookingsListQuery, useUserInquiryListQuery } from "@/features/vendors/vendorAPI";
// import { useUserInquiryListQuery } from "@/features/vendors/vendorAPI";
import { useSelector } from 'react-redux';
const iconMap = {
  views: <FiTrendingUp size={30} className="text-bold text-[#00478F]" />,
  inquiries: <FiMessageSquare size={30} className="text-xl text-[#00478F]" />,
  bookings: <FiCalendar size={30} className="text-xl text-[#00478F]" />,
  rating: <FaRegStar size={30} className="text-xl text-[#00478F]" />,
};

const barWidthMap = {
  views: "w-[60%]",
  inquiries: "w-[50%]",
  bookings: "w-[40%]",
  rating: "w-[95%]",
};
const Analytics = () => {
  const [stats, setStats] = useState([]);
  const vendor = useSelector((state) => state.vendor.vendor);
  // console.log("vendor", vendor);
  const vendorId = vendor?.id;
 const { data: bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useGetVendorBookingsListQuery(vendorId, { skip: !vendorId });
  const { data: inquiries, isLoading, isError, error, refetch: refetchInquiries } = useUserInquiryListQuery(vendorId, {
    skip: !vendorId,
    // The query will use the auth token from the state, so we don't need to pass vendorId
    refetchOnMountOrArgChange: true
  });


  // console.log("bookings", bookings?.data);
  // console.log("inquiries", inquiries);


  useEffect(() => {
    if (!bookings || !inquiries) return;
    const avgRating = 4.8;
    const totalBookings = bookings?.data?.totalBookingsCount ?? 0;


    const currentYear = new Date().getFullYear();
    const totalInquiriesYearly = inquiries?.modifiedList?.filter((inq) => {
      const inqYear = new Date(inq.createdAt).getFullYear();
      return inqYear === currentYear;
    }).length || 0;

    // Bookings: Assuming bookings.data.bookings is the array of bookings
    const totalBookingsYearly = bookings?.data?.bookings?.filter((bk) => {
      const bookingYear = new Date(bk.createdAt).getFullYear();
      return bookingYear === currentYear;
    }).length || 0;

    const data = [
      {
        title: "Total Views",
        value: "12,450", // static or fetch if available
        change: "+12% from last month",
        type: "views",
      },
      {
        title: "Inquiries",
        value: inquiries?.modifiedList?.length || 10,
        change: "+8% from last month",
        type: "inquiries",
        percent: Math.min((totalInquiriesYearly / 100) * 100, 100),
      },
      // {
      //   title: "Bookings",
      //   value: totalBookings ,
      //   change: "+15% from last month",
      //   type: "bookings",
      //   percent: Math.min((totalBookingsYearly / 100) * 100, 100),
      // },

      {
        title: "Bookings",
        value: totalBookings,
        change: totalBookings > 0 ? "+15% from last month" : "No bookings yet",
        type: "bookings",
        percent: totalBookings > 0
          ? Math.min((totalBookings / 100) * 100, 100)
          : 5,
      },
      {
        title: "Avg Rating",
        value: "4.8", // static or dynamic
        change: "+0.2 from last month",
        type: "rating",
        percent: (avgRating / 5) * 100,
      },
    ];

    setStats(data);

  }, [bookings, inquiries]);

  return (
    <div className="p-2 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Analytics & Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className=" border border-gray-200 rounded-md p-2 shadow-sm  "
          >
            <div className="flex items-start justify-between mb-1 ">
              <div className="text-xl font-medium text-gray-600">
                {stat.title}
              </div>
              <div>{iconMap[stat.type]}</div>
            </div>
            <div className="text-[22px] font-semibold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-green-600 mb-2">{stat.change}</div>
            <div className="w-full h-4 bg-gray-300 rounded-full">
              {/* <div
                className={`h-full bg-[#00478F] rounded-full ${barWidthMap[stat.type] || "w-[50%]"
                  }`}
              ></div> */}
              <div
                className="h-full bg-[#00478F] rounded-full transition-all duration-500"
                style={{ width: `${stat.percent}%` }}
              ></div>

            </div>
          </div>
        ))}
      </div>
    </div>



  );
};

export default Analytics;
