 "use client"

import { useEffect, useState, useMemo } from "react";
import { FaStar, FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";

import { MdLocationOn } from "react-icons/md";
import { MapPin } from 'lucide-react';
import { IoIosArrowForward } from "react-icons/io";
import { useGetlatestVendorTypeDataQuery } from "@/features/vendors/vendorAPI";
import { useSaveVendorMutation, useGetSavedVendorsQuery, useUnsaveVendorMutation } from "@/features/savedVendors/savedVendorAPI";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetVendorsReviewStatsQuery } from '@/features/reviews/reviewAPI';
import { navigateToVendor } from '@/utils/seoUrl';
import Link from "next/link";
import { useRouter } from "next/navigation";


const FeaturedVendors = ({ showAll = false }) => {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();
  const { data: vendorsData, isLoading, error } = useGetlatestVendorTypeDataQuery();
  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: savedVendorsData, isLoading: isLoadingSaved } = useGetSavedVendorsQuery(undefined, { skip: !isAuthenticated });
  const savedVendorIds = savedVendorsData?.data?.map(v => v._id || v.id) || [];


  const getDisplayLocation = (vendor) => {
    const locationString = vendor.city || (vendor.serviceAreas?.length > 0 ? vendor.serviceAreas[0] : vendor.address?.city);
    if (locationString && typeof locationString === 'string') {
      return locationString.split(',')[0];
    }
    return 'Location not specified';
  }
  

  // Format vendors data according to our display needs
  const formattedVendors = useMemo(() => vendorsData?.data?.map(vendor => ({
    id: vendor._id,
    image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
    category: vendor.businessType === 'venue' ? vendor.venueType : vendor.vendorType,
    name: vendor.businessName,
    location: getDisplayLocation(vendor),
    services: vendor.services,
    pricing: vendor.pricing || [],
    // Add all original vendor fields for SEO URL generation
    businessName: vendor.businessName,
    vendorType: vendor.vendorType,
    venueType: vendor.venueType,
    businessType: vendor.businessType,
    city: vendor.city,
    nearLocation: vendor.nearLocation,
    serviceAreas: vendor.serviceAreas,
  })) || [], [vendorsData]);



  // Show all vendors if showAll is true, otherwise show only 4
  const displayedVendors = useMemo(() => showAll ? formattedVendors : formattedVendors.slice(0, 4), [showAll, formattedVendors]);
  // Fetch review stats for all displayed vendors
  const vendorIds = useMemo(() => displayedVendors.map(v => v.id), [displayedVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });
  const stats = statsData?.stats || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Only return after all hooks are called
  if (isLoading) {
    return <div className="text-center py-10">Loading vendors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading vendors: {error.message}</div>;
  }

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save vendors.');
      return;
    }
    if (savedVendorIds.includes(id)) {
      try {
        await unsaveVendor(id).unwrap();
        toast.success('Vendor removed from favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to unsave vendor');
      }
    } else {
      try {
        await saveVendor(id).unwrap();
        toast.success('Vendor saved to favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to save vendor');
      }
    }
  };
  const handleCardClick = (vendor) => {
  const city = (vendor.city || vendor.address?.city || vendor.serviceAreas?.[0] || getDisplayLocation(vendor))
    ?.split(',')[0]
    ?.toLowerCase()
    .replace(/\s+/g, '-') || 'unknown';

  const category = (vendor.venueType || vendor.vendorType || 'wedding-resort')
    .toLowerCase()
    .replace(/\s+/g, '-');

  const slug = vendor.businessName?.toLowerCase().replace(/\s+/g, '-') || 'venue';

  if (vendor.businessType === 'venue') {
    router.push(`/venue/${city}/${category}/${slug}`);
  } else {
    router.push(`/vendors/${city}/${category}/${slug}`);
  }
};


  const handleVendorClick = (vendor) => {
    handleCardClick(vendor);
  };


  return (
    <div className="lg:mx-2 px-4 md:px-10 xl:px-20 py-10">
      <div className="flex flex- justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-semibold text-gray-800 font-serif">Latest Vendors By Category</h3>

        {!showAll && formattedVendors.length > 4 && (
          <Link style={{ textDecoration: 'none' }} href="/featurevendors" className="flex text-[#052038] hover:underline">
            <p className="text-[#052038] hover:text-black">View All</p>
            <IoIosArrowForward className="ml-1 mt-1 text-[#052038]" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedVendors.map((vendor) => {
          const stat = stats[vendor.id] || { avgRating: 0, reviewCount: 0 };
          return (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
              onClick={() => handleVendorClick(vendor)}
            >
              <div className="relative group">
                <img
                  src={vendor.image || 'default-vendor-image.jpg'}
                  alt={vendor.name}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
                <button
                  onClick={(e) => toggleFavorite(e, vendor.id)}
                  className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
                  aria-label={savedVendorIds.includes(vendor.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  {savedVendorIds.includes(vendor.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
              {/* Details */}
              <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category}</p>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                      {vendor.name || "Vendor Name"}
                    </h5>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                      <FaStar size={18} className="text-yellow-500" />
                      <span>
                        {isLoadingStats
                          ? '0'
                          : typeof stat.avgRating === 'number' && !isNaN(stat.avgRating) && stat.avgRating !== 0
                            ? stat.avgRating === 5
                              ? '5'
                              : stat.avgRating.toFixed(1)
                            : '0'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                    <MapPin size={14} />
                    <span className="truncate">{vendor.location || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1"></div>
                </div>
                <div className="border-t mt-3 pt-3 text-sm text-gray-800">
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
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="text-gray-600   p-1 rounded">
                      {(() => {
                        let raw = vendor.services || [];
                        let vendorServices = Array.isArray(raw)
                          ? raw.length === 1 && typeof raw[0] === "string"
                            ? raw[0].split(',').map(s => s.trim())
                            : raw
                          : [];
                        return vendorServices.length > 0 ? (
                          <div className="flex flex-wrap gap-2 ">
                            {vendorServices.slice(0, 2).map((service, index) => (
                              <span
                                key={index}
                                className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md  "
                              >
                                {service}
                              </span>
                            ))}
                            {vendorServices.length > 2 && (
                              <span className="text-sm text-gray-600 hover:underline">
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
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedVendors;






