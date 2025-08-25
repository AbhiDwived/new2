"use client"

import React, { useState, useMemo } from "react";
import { FaStar, FaPen, FaTrash } from "react-icons/fa";
import {
  useGetAllVendorsQuery,
  useDeleteVendorByAdminMutation,
} from "@/features/admin/adminAPI";
import { useGetVendorsReviewStatsQuery } from '@/features/reviews/reviewAPI';
import Loader from "@/components/shared/Loader";

const categories = [
  "All Categories",
  "Photographers & Wedding Photographers",
  "Makeup Artists",
  "Mehndi Artists",
  "Bands & DJs (Music & Dance)",
  "Cakes",
  "Caterers",
  "Florists",
  "Decorators",
  "Bridal Wear",
  "Groom Wear",
  "Choreographers",
  "Event Planners / Wedding Planners",
  "Magicians",
  "Gifts",
  "Tent Houses",
  "Entertainers",
  "Bus on Rent",
  "Jewellers / Jewellery & Accessories",
  "Astrologers",
];

const VendorManagement = () => {
  const router = useRouter();
  const { data: vendorsData, isLoading, isError, refetch } = useGetAllVendorsQuery();
  const [deleteVendorByAdmin] = useDeleteVendorByAdminMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 9;

  const allVendors = (vendorsData?.vendors || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredVendors = useMemo(() => {
    const filtered = allVendors.filter((vendor) => {
      const matchesSearch = !searchTerm || 
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const normalizedCategory = vendor.category?.toLowerCase().replace(/\s/g, "") || 
                               vendor.vendorType?.toLowerCase().replace(/\s/g, "");
      const selectedCatNormalized = selectedCategory.toLowerCase().replace(/\s/g, "");
      const matchesCategory =
        selectedCategory === "All Categories" || normalizedCategory === selectedCatNormalized;

      return matchesSearch && matchesCategory;
    });
    
    return filtered;
  }, [allVendors, searchTerm, selectedCategory]);

  const startIdx = (currentPage - 1) * vendorsPerPage;
  const paginatedVendors = filteredVendors.slice(startIdx, startIdx + vendorsPerPage);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  // Fetch review stats for displayed vendors
  const vendorIds = useMemo(() => paginatedVendors.map(v => v._id || v.id), [paginatedVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });
  const stats = statsData?.stats || {};

  // Helper for smart pagination display (first, current, last, ellipsis)
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  const handleView = (vendor) => {
    const vendorId = vendor._id; // MongoDB uses _id
    if (vendorId) {
      router.push(`/preview-profile/${vendorId}`);
    } else {
      console.error("Cannot navigate: Vendor ID is undefined");
      alert("Unable to view vendor profile: ID not found");
    }
  };
  const handleEdit = (vendor) => {
    const vendorId = vendor._id;
    if (vendorId) {
      // Store vendor data in localStorage for admin access
      localStorage.setItem('adminEditingVendor', JSON.stringify({
        vendor: vendor,
        isAdminEdit: true,
        originalAdminToken: localStorage.getItem('adminToken')
      }));
      // Navigate to vendor dashboard
      router.push(`/vendor/dashboard?adminEdit=${vendorId}`);
    } else {
      alert("Unable to edit vendor: ID not found");
    }
  };

  const handleDelete = async (vendor) => {
    const vendorId = vendor._id;
    const vendorName = vendor.businessName || vendor.name;
    
    if (!vendorId) {
      alert('Cannot delete vendor: ID not found');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${vendorName}?`)) {
      try {
        await deleteVendorByAdmin({ vendorId }).unwrap();
        alert(`Successfully deleted vendor: ${vendorName}`);
        refetch(); // Refresh the vendor list
      } catch (err) {
        alert(`Failed to delete vendor: ${err?.data?.message || err?.error || 'Please try again'}`);
      }
    }
  };

  if (isLoading) return <Loader fullScreen />;
  if (isError) return <div className="text-center text-red-500 p-4">Error loading vendors</div>;

  return (
    <div className=" bg-white rounded-xl ">
      <div className="flex justify-between items-center mb-4">
        <div className="p-3">
          <h2 className="text-2xl font-semibold">Vendor Management</h2>
          <p className="text-sm text-gray-500">Manage all registered vendors on the platform</p>
        </div>
        
        <div className="flex gap-2 px-3">
          <input
            type="text"
            placeholder="Search vendors..."
            className="border px-2 py-1 rounded text-xs w-40"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded text-xs w-40"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={() => router.push('/admin/add-vendor')}
            className="text-white px-2 py-1 rounded text-xs w-40"
            style={{ backgroundColor: '#0f4c81' }}
          >
            Add Vendor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4 mr-4">
        {paginatedVendors.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No vendors found.</p>
        ) : (
          paginatedVendors.map((vendor, idx) => {
            // Format vendor data to match FeatureVendors card props
            const vendorId = vendor._id; // MongoDB uses _id
            const cardVendor = {
              id: vendorId,
              image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
              category: vendor.vendorType || vendor.category,
              name: vendor.businessName || vendor.name,
              location: vendor.serviceAreas?.length > 0
                ? vendor.serviceAreas[0]
                : vendor.address?.city && vendor.address?.state
                  ? `${vendor.address.city}, ${vendor.address.state}`
                  : vendor.address?.city || vendor.address?.state || vendor.location || 'Location not specified',
              rating: stats[vendorId]?.avgRating || 0,
              reviews: stats[vendorId]?.reviewCount || 0,
              services: vendor.services,
              price: vendor.pricingRange && vendor.pricingRange.min && vendor.pricingRange.max
                ? `₹${vendor.pricingRange.min.toLocaleString()} - ₹${vendor.pricingRange.max.toLocaleString()}`
                : 'Price on request',
              pricing: vendor.pricing || [],
            };
            const originalVendor = paginatedVendors[idx];
            
            return (
              <div
                key={`vendor-${vendorId || idx}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => handleView(originalVendor)}
              >
                <div className="relative group">
                  <img
                    src={cardVendor.image || 'default-vendor-image.jpg'}
                    alt={cardVendor.name}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                  />
                </div>
                {/* Details */}
                <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase">{cardVendor.category || "Vendor"}</p>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                        {cardVendor.name || "Vendor Name"}
                      </h5>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                        <FaStar size={18} className="text-yellow-500" />
                        <span>
                          {isLoadingStats
                            ? '0'
                            : typeof cardVendor.rating === 'number' && !isNaN(cardVendor.rating) && cardVendor.rating !== 0
                              ? cardVendor.rating === 5
                                ? '5'
                                : cardVendor.rating.toFixed(1)
                              : '0'}
                        </span>
                      </div>
                    </div>
                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                      <span className="truncate">{cardVendor.location || "Location not specified"}</span>
                    </div>
                  </div>
                  {/* Price / Rooms / Pax */}
                  <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                    {/* Pricing */}
                    <div className="flex items-center gap-5 text-sm text-gray-600 mb-3 border-amber-300">
                      {cardVendor?.pricing?.filter(item => item?.type && item?.price)?.length > 0 ? (
                        cardVendor.pricing
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
                      <span className="text-gray-600 p-1 rounded">
                        {(() => {
                          let raw = cardVendor.services || [];
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
                  {/* Admin Actions */}
                  <div className="flex justify-between items-center mt-2">
                  <button
                    className="px-3 py-1 border rounded text-sm"
                      onClick={e => { e.stopPropagation(); handleView(originalVendor); }}
                  >
                    View Profile
                  </button>
                  <div className="space-x-2">
                      <button className="p-1" onClick={e => { e.stopPropagation(); handleEdit(originalVendor); }}>
                      <FaPen className="text-yellow-500" />
                    </button>
                      <button className="p-1" onClick={e => { e.stopPropagation(); handleDelete(originalVendor); }}>
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Improved Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mt-4 gap-2">
        <span>
          Showing {startIdx + 1}-{Math.min(startIdx + vendorsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
        </span>
        <nav className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-lg shadow border">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Previous page"
          >
            Prev
          </button>
          {paginationPages.map((page, idx) =>
            page === '...'
              ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              : <button
                  key={`page-${page}-${idx}`}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border transition ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default VendorManagement;