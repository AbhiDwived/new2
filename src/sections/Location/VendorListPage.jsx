"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetAllVendorsQuery } from '@/features/admin/adminAPI';
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Loader from '@/components/shared/Loader';
import { FiArrowLeft } from "react-icons/fi";
import { MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetVendorByIdQuery } from "@/features/vendors/vendorAPI";
import {
  useSaveVendorMutation,
  useGetSavedVendorsQuery,
  useUnsaveVendorMutation
} from "@/features/savedVendors/savedVendorAPI";
import { toast } from 'react-toastify';
import { useGetVendorsReviewStatsQuery } from '@/features/reviews/reviewAPI';

const VendorListPage = ({ params }) => {
  const router = useRouter();
  const urlParams = useParams();
<<<<<<< HEAD
  const { city = 'all', category = '' } = urlParams || {};
=======
  const { city = '', category = '' } = urlParams || {};
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');

  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();

  const vendor = useSelector((state) => state.vendor.vendor);
  const vendorId = vendor?._id;

  // Needed only if you show vendor‑specific info; can remove if unused
  useGetVendorByIdQuery(vendorId, { skip: !vendorId });

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: savedVendorsData, isLoading: isLoadingSaved } =
    useGetSavedVendorsQuery(undefined, { skip: !isAuthenticated });
  const savedVendorIds =
    savedVendorsData?.data?.map((v) => v._id || v.id) || [];

  // Format inputs from URL
  const formattedCategory = category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const formattedCity =
<<<<<<< HEAD
    city === 'all' || city === 'all-india'
      ? 'All India'
=======
    city === 'all'
      ? 'All '
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      : city
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  const {
    data: vendorsData,
    isLoading,
    error,
    refetch
  } = useGetAllVendorsQuery();

  // Mapping between frontend category titles and database vendor types
  const categoryMapping = {
    'Banquet Halls': ['Banquet Halls', 'TentHouse'],
    'Hotels': ['Hotels', '5 Star Hotel', 'Wedding Hotels'],
    'Marriage Garden': ['Marriage Garden', 'Marriage Lawn'],
    'Kalyana Mandapams': ['Kalyana Mandapams'],
    'Wedding Resorts': ['Wedding Resorts', 'Resort', 'Wedding Resort'],
    'Wedding Lawns & Farmhouses': ['Wedding Lawns & Farmhouses', 'Party Lawn', 'Farm Houses'],
    'Wedding Photographers': ['Wedding Photographers', 'Photographers', 'Videography', 'Photobooth'],
    'Party Places': ['Party Places', 'DJ', 'Musics'],
    'Caterers': ['Caterers', 'Cakes'],
    'Wedding Decorators': ['Wedding Decorators', 'Decorator', 'Florist'],
    'Wedding Makeup': ['Wedding Makeup'],
    'Wedding Planners': ['Wedding Planners', 'Choreographers', 'Gifts', 'Invitation', 'Transportation', 'Other'],
    // Additional venue categories
    'Art Gallery': ['Art Gallery'],
    'Amusement Park': ['Amusement Park'],
    'Auditorium': ['Auditorium'],
    'Bars': ['Bars'],
    'Clubs': ['Clubs'],
    'Pubs': ['Pubs'],
    'Pool Side': ['Pool Side'],
    'Conference Rooms': ['Conference Rooms'],
    'Meeting Rooms': ['Meeting Rooms'],
    'Training Rooms': ['Training Rooms'],
    'Restaurants': ['Restaurants'],
    'Cafes': ['Cafes'],
    'Seminar Halls': ['Seminar Halls'],
    'Theater': ['Theater'],
    'Unique Venues': ['Unique Venues'],
    'Roof Top': ['Roof Top'],
    'Gaming Zone': ['Gaming Zone'],
    'Kids Play Area': ['Kids Play Area'],
    'Villas': ['Villas'],
    'Vacation Homes': ['Vacation Homes'],
    'Guest Houses': ['Guest Houses'],
    'Boat Yatch': ['Boat Yatch'],
    'Co Working Spaces': ['Co-working Spaces'],
    'Business Centres': ['Business Centres']
  };

  // Filtering
  const filteredVendors =
    vendorsData?.vendors?.filter((v) => {
      const lowerSearch = searchTerm.toLowerCase().trim();

      /** category match */
      const mappedCategories = categoryMapping[formattedCategory] || [formattedCategory];
      const matchesCategory = mappedCategories.includes(v.vendorType) || 
                             mappedCategories.includes(v.venueType) ||
                             (v.businessType === 'venue' && mappedCategories.includes(v.venueType)) ||
                             (formattedCategory.toLowerCase() === 'banquet halls' && (v.vendorType === 'Banquet halls' || v.venueType === 'Banquet halls'));
      
      // Debug category matching
      if (v.businessName && v.businessName.toLowerCase().includes('banquet')) {

      }

      /** city / service‑area match */
<<<<<<< HEAD
      let matchesLocation = city === 'all' || city === 'all-india';
=======
      let matchesLocation = city === 'all';
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      if (!matchesLocation) {
        const searchCity = formattedCity.toLowerCase();
        const vendorLocations = [
          ...(v.serviceAreas ?? []),
          v.address?.city,
          v.city,
          v.state,
          v.nearLocation
        ]
          .filter(Boolean)
          .map((loc) => loc.toLowerCase());
        matchesLocation = vendorLocations.some(loc => 
          loc.includes(searchCity) || searchCity.includes(loc)
        );
      }

      /** free‑text search match */
      let matchesSearch = true;
      if (lowerSearch) {
        const searchable = [
          v.businessName,
          ...(v.serviceAreas ?? []),
          v.address?.city ?? ''
        ]
          .filter(Boolean)
          .map((s) => s.toLowerCase());
        matchesSearch = searchable.some((field) => field.includes(lowerSearch));
      }

      return matchesCategory && matchesLocation && matchesSearch;
    }) ?? [];

  // Sorting
  const sortedVendors = React.useMemo(() => {
    return [...filteredVendors].sort((a, b) => {
      if (activeTab === 'popular') {
        // higher rating first; fallback 0
        return (b.rating || 0) - (a.rating || 0);
      }
      if (activeTab === 'newest') {
        // newest createdAt first; ensure Date objects
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [filteredVendors, activeTab]);

  // Dynamic review stats hook (must be after sortedVendors is defined)
  const vendorIds = React.useMemo(() => sortedVendors.map(v => v._id), [sortedVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });
  const stats = statsData?.stats || {};

  /* ------------------------- helpers ------------------------- */

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save vendors.');
      return;
    }
    try {
      if (savedVendorIds.includes(id)) {
        await unsaveVendor(id).unwrap();
        toast.success('Vendor removed from favorites!');
      } else {
        await saveVendor(id).unwrap();
        toast.success('Vendor saved to favorites!');
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
        `Failed to ${savedVendorIds.includes(id) ? 'unsave' : 'save'} vendor`
      );
    }
  };

  const handleVendorClick = (vendor) => {
    if (vendor?.city && vendor?.businessName) {
      const city = vendor.city.toLowerCase().replace(/\s+/g, '-');
      const businessName = vendor.businessName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      const location = vendor.nearLocation?.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') || 'area';
<<<<<<< HEAD
      const baseUrl = vendor.businessType === 'venue' ? '/venue' : '/vendors';
      const seoUrl = `${baseUrl}/${city}/${businessName}-in-${location}`;
      router.push(seoUrl);
=======
      
      if (vendor.businessType === 'venue') {
        const seoUrl = `/${city}/venue/${businessName}-in-${location}`;
        router.push(seoUrl);
      } else {
        const type = (vendor.vendorType || 'service').toLowerCase().replace(/\s+/g, '-');
        const seoUrl = `/vendors/${city}/${type}/${businessName}-in-${location}`;
        router.push(seoUrl);
      }
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    } else {
      router.push(`/preview-profile/${vendor._id}`);
    }
  };

  /* ------------------------- filtering ----------------------- */

  /* ------------------------- sorting ------------------------- */

  /* ------------------------- early states -------------------- */

  // Debug logging

  
<<<<<<< HEAD
  if (!category) {
    return (
      <div className="text-center py-10 text-red-500">
        Invalid category in URL.
=======
  if (!category || !city) {
    return (
      <div className="text-center py-10 text-red-500">
        Invalid category or location in URL.
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading vendors: {error.message}
        <button
          onClick={() => refetch()}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );

  /* ------------------------- render -------------------------- */

  return (
    <>
      {/* ---------- HEADER ---------- */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-12 md:py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-2">
              Find the Perfect {formattedCategory}
            </h1>
            <h2 className="text-lg mb-2">In {formattedCity}</h2>
            <p className="mb-6 text-sm sm:text-base">
              {sortedVendors.length}{' '}
              {sortedVendors.length === 1 ? 'Vendor' : 'Vendors'} Available
            </p>

            {/* ----------- SEARCH BAR ------------ */}
            <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md text-sm"
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // prevent form submission
                    setSearchTerm(pendingSearchTerm.trim());
                  }
                }}
              />
             

              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-4 py-2 text-sm whitespace-nowrap"
                onClick={() => setSearchTerm(pendingSearchTerm.trim())}
              >
                Search
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ---------- FILTER + SORT ---------- */}
      <div className="min-h-screen p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <p className="text-2xl sm:text-3xl md:text-3xl w-full text-gray-800">
            {formattedCategory} in {formattedCity}
          </p>
          <div className="flex space-x-2">
            <Link
              href="/"
              style={{ textDecoration: 'none', color: 'black' }}
              className="flex items-center px-3 py-2 border text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap rounded"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <button
              className={`px-3 py-2 mx-2 text-sm rounded ${activeTab === 'popular'
                ? 'bg-[#062b4b] text-white'
                : 'border text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('popular')}
            >
              Popular
            </button>
            <button
              className={`px-3 py-2 text-sm rounded ${activeTab === 'newest'
                ? 'bg-[#062b4b] text-white'
                : 'border text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('newest')}
            >
              Newest
            </button>
          </div>
        </div>

        {/* ---------- VENDOR CARDS ---------- */}
        {sortedVendors.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <p className="text-lg mb-6">
              No vendors found matching your criteria.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-5 py-2 border text-sm rounded-md hover:bg-gray-100 text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedVendors.map((v) => (
              <div
                key={v._id}
                onClick={() => handleVendorClick(v)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
              >
                <div className="relative group">
                  <img
                    src={v.profilePicture || v.galleryImages?.[0]?.url || '/default-vendor-image.jpg'}
                    alt={v.businessName}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleFavorite(e, v._id)}
                    className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
                  >
                    {savedVendorIds.includes(v._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
                {/* Details */}
                <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase">{v.vendorType || "Vendor"}</p>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                        {v.businessName}
                      </h5>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                        <FaStar size={18} className="text-yellow-500" />
                        <span>{isLoadingStats ? '--' : (stats[v._id]?.avgRating ?? 0)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                      <MapPin size={14} />
                      <span className="truncate">
                        {(v.serviceAreas ?? []).join(', ') ||
                          'Location not specified'}
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1"></div>
                  </div>
                  <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                    <div className="flex items-center gap-5 text-sm text-gray-600 mb-3 border-amber-300">
                      {v?.pricing?.filter((p) => p?.type && p?.price).length > 0 ? (
                        v.pricing
                          .filter((p) => p?.type && p?.price)
                          .slice(0, 2)
                          .map((p, idx) => (
                            <div key={idx}>
                              <div className="text-sm text-gray-500">
                                {p.type}
                              </div>
                              <div className="flex items-center text-md font-bold text-gray-800">
                                ₹ {p.price.toLocaleString('en-IN')}
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                  {p.unit || 'per person'}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          No Pricing Available
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="text-gray-600   p-1 rounded"
                        onClick={() => handleVendorClick(v)}
                      >
                        {(() => {
                          let raw = v.services || [];
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
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VendorListPage;
