"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

import { useGetAllVendorsQuery } from '@/features/admin/adminAPI';
import { useRouter } from 'next/navigation';
import { useSaveVendorMutation, useGetSavedVendorsQuery, useUnsaveVendorMutation } from '@/features/savedVendors/savedVendorAPI';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetVendorsReviewStatsQuery } from '@/features/reviews/reviewAPI';


export default function Music() {
  const router = useRouter();
  const [sortType, setSortType] = useState('popular');
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const { data, isLoading, isError, error } = useGetAllVendorsQuery();
  const [favorites, setFavorites] = useState([]);
  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  //  console.log("vendorsList", data);
  // const music = data?.vendors?.filter(v => v.vendorType === "Musics");
  // console.log("music", music);

  const music = useMemo(() => {
    return data?.vendors?.filter(v => v.vendorType === "Musics") || [];
  }, [data]);

  const vendorIds = useMemo(() => filteredVendors.map(v => v._id), [filteredVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });
  const stats = statsData?.stats || {};

  useEffect(() => {
    if (!music) return;

    let sorted = [...music];

    if (sortType === "popular") {
      sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (sortType === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredVendors(sorted);
  }, [sortType, music]);

  const handleVendorClick = (vendorId) => {
    router.push(`/preview-profile/${vendorId}`);
  };

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save vendors.');
      return;
    }
    if (favorites.includes(id)) {
      try {
        await unsaveVendor(id).unwrap();
        setFavorites((prev) => prev.filter((fid) => fid !== id));
        toast.success('Vendor removed from favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to unsave vendor');
      }
    } else {
      try {
        await saveVendor(id).unwrap();
        setFavorites((prev) => [...prev, id]);
        toast.success('Vendor saved to favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to save vendor');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading vendors...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error?.data?.message || 'Failed to fetch vendors.'}
      </div>
    );
  }
  return (
    <>


      {/* Vendor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {filteredVendors?.length === 0 ? (
          <p className="text-center col-span-full">No vendors available for this category.</p>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => handleVendorClick(vendor._id)}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Image + Tag */}
              <div className="relative">
                <img
                  src={vendor.profilePicture || vendor.coverImage}
                  alt={vendor.businessName || vendor.name}
                  className="w-full h-[220px] object-cover"
                />
                <button
                  onClick={(e) => toggleFavorite(e, vendor._id)}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
                >
                  {favorites.includes(vendor._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between flex-grow p-2">
                <div>


                  <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.vendorType || "Vendor"}</p>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <h5 className="text-md font-semibold truncate max-w-[65%]">
                      {vendor.businessName || vendor.name || "Vendor Name"}
                    </h5>

                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                      <FaStar size={18} className="text-yellow-500" />
                      <span>{isLoadingStats ? '--' : (stats[vendor._id]?.avgRating ?? 0)}</span>
                    </div>

                  </div>


                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                    <MapPin size={14} />
                    <span className="truncate">{vendor.serviceAreas?.join(", ") || "Location not specified"}</span>
                    {/* <span className="before:content-['•'] before:mx-1">{vendor.vendorType || "Category"}</span> */}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1">

                  </div>
                </div>

                {/* Price / Rooms / Pax */}



                <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                  {/* Pricing */}
                  <div className="flex items-center gap-5 text-sm text-gray-600 mb-3 border-amber-300">
                    {vendor?.pricing?.filter(item => item?.type && item?.price)?.length > 0 ? (
                      vendor.pricing
                        .filter(item => item?.type && item?.price)
                        .slice(0, 2)
                        .map((item, index) => (
                          <div key={item._id || index}>
                            <div className="text-sm text-gray-500">{item.type}</div>
                            <div className="flex items-center text-md font-bold text-gray-800">
                              ₹ {item.price.toLocaleString('en-IN')}
                              <span className="text-xs font-normal text-gray-500 ml-1">
                                {item.unit || 'per person'}
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-sm text-gray-500">No Pricing Available</div>
                    )}
                  </div>

                  {/* Capacity, Rooms, and More */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">


                    <span className="text-gray-600 hover:underline  p-1 rounded"
                      onClick={() => handleVendorClick(vendor._id)}
                    >

                      {(() => {
                        let raw = vendor.services || [];
                        let vendorServices = Array.isArray(raw)
                          ? raw.length === 1 && typeof raw[0] === "string"
                            ? raw[0].split(',').map(s => s.trim())
                            : raw
                          : [];

                        return vendorServices.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {vendorServices.slice(0, 2).map((service, index) => (
                              <span
                                key={index}
                                className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                              >
                                {service}
                              </span>
                            ))}
                            {vendorServices.length > 2 && (
                              <span className="text-sm text-gray-600">
                                +{vendorServices.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No services available</span>
                        );
                      })()}


                    </span>
                  </div>
                </div>



              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
