"use client"

import React, { useMemo, useState } from "react";
import { GrContact } from "react-icons/gr";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,
} from "@/features/admin/adminAPI";

// Visually distinct pastel color palette
const DISTINCT_COLORS = [
  "#FFD6E0", "#D6EFFF", "#D6FFD6", "#FFF5D6", "#E0D6FF",
  "#FFE0F7", "#D6FFF6", "#FFF0D6", "#F7FFD6", "#FFD6F7",
  "#D6F7FF", "#F0FFD6", "#FFD6D6", "#D6D6FF", "#F7D6FF",
];

// Get readable text color for a given background
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 180) ? "#222" : "#fff";
}

function getDistinctColor(value, usedMap) {
  if (!usedMap[value]) {
    const idx = Object.keys(usedMap).length % DISTINCT_COLORS.length;
    usedMap[value] = DISTINCT_COLORS[idx];
  }
  return usedMap[value];
}

const PendingVendorApprovals = () => {
  const { data, isLoading, isError } = useGetPendingVendorsQuery();
  const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorByAdminMutation();

  const [vendorToReject, setVendorToReject] = useState(null); // For modal
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const vendors = Array.isArray(data)
    ? data
    : Array.isArray(data?.vendors)
      ? data.vendors
      : [];

  // Pagination logic
  const totalPages = Math.ceil(vendors.length / pageSize);
  const paginatedVendors = vendors.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  // Assign distinct colors for category and vendorType
  const categoryColorMap = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      if (v.category) getDistinctColor(v.category, map);
    });
    return map;
  }, [vendors]);

  const vendorTypeColorMap = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      if (v.vendorType) getDistinctColor(v.vendorType, map);
    });
    return map;
  }, [vendors]);

  const handleApprove = async (vendorId) => {
    try {
      await approveVendor({ vendorId }).unwrap();
      toast.success("Vendor approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error(err.data?.message || "Error approving vendor.");
    }
  };

  if (isLoading) return <p className="p-4">Loading vendors...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load vendors.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow p-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Pending Vendor Approvals</h2>
        <p className="text-sm text-gray-500 mb-6">New vendor applications awaiting approval</p>

        {vendors.length === 0 ? (
          <p className="text-center text-gray-500">No pending vendors.</p>
        ) : (
          paginatedVendors.map((vendor) => (
            <div
              key={vendor._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h5 className="font-semibold text-lg text-gray-600 flex items-center gap-2 flex-wrap">
                    {vendor.businessName && (
                      <span className="font-bold text-gray-700">{vendor.businessName}</span>
                    )}
                    {vendor.category && (
                      <span
                        className="ml-2 px-2 py-1 rounded-full"
                        style={{
                          fontSize: "7px",
                          background: categoryColorMap[vendor.category] || "#eee",
                          color: getContrastYIQ(categoryColorMap[vendor.category] || "#eee"),
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          border: "1px solid #eee",
                        }}
                      >
                        {vendor.category}
                      </span>
                    )}
                    {vendor.vendorType && (
                      <span
                        className="ml-2 text-sm px-2 py-1 rounded-full border"
                        style={{
                          fontSize: "9px",
                          background: vendorTypeColorMap[vendor.vendorType] || "#eee",
                          color: getContrastYIQ(vendorTypeColorMap[vendor.vendorType] || "#eee"),
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          border: "1px solid #eee",
                        }}
                      >
                        {vendor.vendorType}
                      </span>
                    )}
                  </h5>
                  <h6 className="flex items-center text-sm text-gray-600 mt-1 mb-1">
                    <GrContact className="mr-1" /> {vendor.email}
                  </h6>
                  <h6 className="flex items-center text-sm text-gray-600 mt-1 mb-1">
                    <FaPhoneAlt className="mr-1" /> {vendor.phone}
                  </h6>
                  <p className="text-sm text-gray-600 mb-1">
                    Applied on {new Date(vendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleApprove(vendor._id)}
                    disabled={isApproving || isDeleting}
                    className={`bg-green-100 text-green-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-green-200 transition ${(isApproving || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <FaRegCheckCircle className="mr-1" />
                    {isApproving ? 'Approving...' : 'Approve'}
                  </button>

                  <button
                    onClick={() => setVendorToReject(vendor)}
                    disabled={isApproving || isDeleting}
                    className={`bg-red-100 text-red-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-red-200 transition ${(isApproving || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <RxCrossCircled className="mr-1" />
                    Reject
                  </button>

                  <button className="text-gray-600 text-sm underline hover:text-gray-800 hover:bg-[#DEBF78] p-1 rounded">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-6 bg-gray-50 px-3 py-2 rounded-lg shadow border">
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
                ? <span key={idx} className="px-2 text-gray-400">...</span>
                : <button
                    key={page}
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
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {vendorToReject && (
        <div className="fixed inset-0 bg-white/40  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Rejection</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to reject <strong>{vendorToReject.businessName}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:text-black underline"
                onClick={() => setVendorToReject(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={async () => {
                  try {
                    await deleteVendor({ vendorId: vendorToReject._id }).unwrap();
                    toast.success("Vendor rejected and removed.");
                    setVendorToReject(null);
                  } catch (err) {
                    console.error("Rejection failed:", err);
                    toast.error(err?.data?.message || "Error rejecting vendor.");
                    setVendorToReject(null);
                  }
                }}
              >
                {isDeleting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PendingVendorApprovals;