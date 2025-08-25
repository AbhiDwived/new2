"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MapPin } from "lucide-react";

import { useGetAllPublicVendorsQuery } from "@/features/vendors/vendorAPI";
import {
  useSaveVendorMutation,
  useUnsaveVendorMutation,
  useCheckVendorSavedQuery,
  useGetSavedVendorsQuery,
} from "@/features/savedVendors/savedVendorAPI";
import { useGetVendorsReviewStatsQuery } from "@/features/reviews/reviewAPI";

import Loader from "@/components/shared/Loader";
// import DiscoverImage from "../public/newPics/discoverImage.jpg";

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
<<<<<<< HEAD
  const selectedCity = searchParams.get("city") || "All India";
=======
  const selectedCity = searchParams.get("city") || "All ";
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: vendorData, isLoading, error } = useGetAllPublicVendorsQuery();
  const { data: savedVendorsData } = useGetSavedVendorsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const savedVendorIds =
    savedVendorsData?.data?.map((v) => v._id || v.id) || [];

  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();

  const handleSaveVendor = async (e, vendorId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to save vendors");
      return;
    }
    try {
      await saveVendor(vendorId).unwrap();
      toast.success("Vendor saved successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Failed to save vendor");
    }
  };

  const handleUnsaveVendor = async (e, vendorId) => {
    e.stopPropagation();
    try {
      await unsaveVendor(vendorId).unwrap();
      toast.success("Vendor removed from favorites");
    } catch (error) {
      toast.error(error.data?.message || "Failed to remove vendor");
    }
  };

  // const handleVendorClick = (vendorId) => {
  //   router.push(`/preview-profile/${vendorId}`);
  // };

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

  const filteredVendors = React.useMemo(() => {
    if (!vendorData?.vendors) return [];
    return vendorData.vendors.filter((vendor) => {
      const matchesSearch =
        searchTerm === "" ||
        vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.serviceAreas?.some((area) =>
          area.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        category === "" || vendor.vendorType === category;

      const matchesCity =
<<<<<<< HEAD
        selectedCity === "All India" ||
=======
        selectedCity === "All " ||
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
        vendor.serviceAreas?.some((area) =>
          area.toLowerCase().includes(selectedCity.toLowerCase())
        ) ||
        vendor.address?.city?.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [vendorData, searchTerm, category, selectedCity]);

  // Review stats
  const vendorIds = React.useMemo(
    () => filteredVendors.map((v) => v._id),
    [filteredVendors]
  );

  const { data: statsData, isLoading: isLoadingStats } =
    useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });

  const stats = statsData?.stats || {};

  if (isLoading) return <Loader fullScreen />;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading vendors
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Search Results
            </h1>
            <div className="bg-white rounded-lg p-4 text-gray-800">
              <p className="text-sm">
                {searchTerm && (
                  <span className="font-semibold">"{searchTerm}"</span>
                )}
                {category && (
                  <span className="font-semibold"> in {category}</span>
                )}
<<<<<<< HEAD
                {selectedCity !== "All India" && (
=======
                {selectedCity !== "All " && (
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
                  <span className="font-semibold"> at {selectedCity}</span>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {filteredVendors.length}{" "}
                {filteredVendors.length === 1 ? "vendor" : "vendors"} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="w-full px-2 py-8">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No vendors found matching your search criteria.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse All Vendors
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
                savedVendorIds={savedVendorIds}
                toggleFavorite={handleSaveVendor}
                onVendorClick={handleVendorClick}
                onUnsaveVendor={handleUnsaveVendor}
                isAuthenticated={isAuthenticated}
                rating={
                  isLoadingStats ? "--" : stats[vendor._id]?.avgRating ?? 0
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Vendor Card
const VendorCard = ({
  vendor,
  savedVendorIds,
  toggleFavorite,
  onVendorClick,
  onUnsaveVendor,
  isAuthenticated,
  rating,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const { data: savedStatus } = useCheckVendorSavedQuery(vendor._id, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (savedStatus?.isSaved !== undefined) {
      setIsSaved(savedStatus.isSaved);
    }
  }, [savedStatus]);

  const handleHeartClick = (e) => {
    if (isSaved) {
      onUnsaveVendor(e, vendor._id);
      setIsSaved(false);
    } else {
      toggleFavorite(e, vendor._id);
      setIsSaved(true);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
     onClick={() => onVendorClick(vendor)}
    >
      <div className="relative group">
        <Image
          src={
            vendor.profilePicture ||
            vendor.galleryImages?.[0]?.url ||
            "/newPics/discoverImage.jpg" // <-- use string path
          }
          alt={vendor.businessName}
          width={500}
          height={300}
          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
        />
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800 hover:bg-gray-50"
        >
          {isSaved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="flex flex-col justify-between flex-grow p-2 font-serif">
        <div>
          <p className="text-xs text-gray-500 mb-1 uppercase">
            {vendor.vendorType || "Vendor"}
          </p>
          <div className="flex justify-between items-center gap-2 mb-2">
            <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
              {vendor.businessName}
            </h5>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
              <FaStar size={18} className="text-yellow-500" />
              <span>{rating}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
            <MapPin size={14} />
            <span className="truncate">
              {vendor.serviceAreas?.[0] ||
                vendor.address?.city ||
                "Location not specified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
