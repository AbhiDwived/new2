"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllBookingsQuery, useUpdateBookingMutation } from '@/features/bookings/bookingAPI';
import Loader from "@/components/shared/Loader";
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data: response, isLoading, error } = useGetAllBookingsQuery();
  const [updateBooking] = useUpdateBookingMutation();

  const handleViewVendor = (booking) => {
    const vendorId = booking.vendorId || booking.vendor?._id || booking.vendor?.id;
    if (vendorId) {
      router.push(`/preview-profile/${vendorId}`);
    } else {
      console.error("Vendor ID missing for booking", booking);
      toast.warning("Vendor ID is missing. Cannot view vendor profile.");
    }
  };

  const handleViewUser = (booking) => {
    const userId = booking.user?._id || booking.user?.id || booking.userId;
    if (userId) {
      router.push(`/admin/user_management?userId=${userId}`);
    } else {
      console.error("User ID missing for booking", booking);
      toast.warning("User ID is missing. Cannot view user profile.");
    }
  };

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const allBookings = response?.data?.bookings || [];

  const bookingsData = {
    all: allBookings,
    confirmed: allBookings.filter(b => b.status === 'confirmed'),
    pending: allBookings.filter(b => b.status === 'pending'),
    cancelled: allBookings.filter(b => b.status === 'cancelled')
  };

  const stats = [
    {
      title: 'Total Bookings',
      count: response?.data?.totalBookingsCount || '0',
      type: 'all',
      color: 'blue',
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Confirmed',
      count: response?.data?.confirmedBookingsCount || '0',
      type: 'confirmed',
      color: 'green',
      gradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Pending',
      count: response?.data?.pendingBookingsCount || '0',
      type: 'pending',
      color: 'yellow',
      gradient: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'Cancelled',
      count: bookingsData.cancelled.length,
      type: 'cancelled',
      color: 'red',
      gradient: 'from-red-50 to-red-100'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleExport = () => {
    const dataToExport = bookingsData[activeFilter];
    const headers = ['Vendor Name', 'Customer', 'Phone Number', 'Venue', 'Date', 'Status', 'Amount'];

    const csvData = [
      headers.join(','),
      ...dataToExport.map(booking => [
        booking.vendorName || 'N/A',
        booking.user?.name || 'N/A',
        booking.user?.phone || 'N/A',
        booking.venue || 'N/A',
        new Date(booking.eventDate).toLocaleDateString(),
        booking.status,
        `₹${Number(booking.plannedAmount || 0).toLocaleString('en-IN')}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${activeFilter}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination logic
  const bookingsList = bookingsData[activeFilter] || [];
  const totalPages = Math.ceil(bookingsList.length / pageSize);
  const paginatedBookings = bookingsList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="py-3">
      {/* Header and Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="mx-3">
          <h1 className="text-md lg:text-2xl font-bold">Bookings Management</h1>
          <p className="text-sm text-gray-500">View and manage all venue bookings</p>
        </div>
        <button
          onClick={handleExport}
          className="text-sm bg-gradient-to-r from-[#0f4c81] to-[#1a6cbd] text-white p-2 mx-3 rounded-md hover:from-[#DEBF78] hover:to-[#E8D4A7] shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 mx-3">
          {stats.map((stat) => (
            <div
              key={stat.type}
              onClick={() => setActiveFilter(stat.type)}
              className={`cursor-pointer bg-gradient-to-r ${stat.gradient} px-4 py-2.5 rounded-lg transition-all duration-300
                ${activeFilter === stat.type
                  ? `shadow-md transform scale-[1.02] border border-${stat.color}-200`
                  : 'hover:shadow-md hover:scale-[1.01] border border-transparent'}`}
            >
              <p className={`text-sm text-${stat.color}-600 mb-1 font-bold`}>{stat.title}</p>
              <p className={`text-xl font-semibold text-${stat.color}-700`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table (now Card-based) */}
        <div className="border border-gray-100 rounded-lg px-3 py-3 lg:mx-3 shadow-md hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold">
              {activeFilter === 'all' ? 'Recent Bookings' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
            </p>
            <p className="text-xs text-gray-500">
              Showing {bookingsData[activeFilter]?.length || 0} bookings
            </p>
          </div>

          {/* Card-based Bookings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedBookings.length === 0 ? (
              <div className="col-span-full text-center py-6 text-gray-500 bg-white rounded-lg border">No bookings found for the selected filter.</div>
            ) : (
              paginatedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="relative border border-gray-200 rounded-lg px-4 py-4 bg-white shadow-sm flex flex-col gap-2"
                >
                  {/* Top Row: Vendor/User and Status */}
                  <div className="flex justify-between items-start flex-wrap mb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-md font-semibold text-gray-800">
                        {booking.vendorName || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Customer: {booking.user?.name || 'N/A'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.status)}`}> 
                      {booking.status === 'confirmed' && <span>✔️</span>}
                      {booking.status === 'pending' && <span>⏳</span>}
                      {booking.status === 'cancelled' && <span>❌</span>}
                      <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">📅 Date: <span className="font-medium text-gray-700 text-md">{new Date(booking.eventDate).toLocaleDateString()}</span></span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">📍 Venue: <span className="font-medium text-gray-700 text-md">{booking.venue || 'N/A'}</span></span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">👥 Guests: <span className="font-medium text-gray-700 text-md">{booking.guestCount || 0}</span></span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">📞 Phone: <span className="font-medium text-gray-700 text-md">{booking.user?.phone || 'N/A'}</span></span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">💰 Amount: <span className="font-semibold text-green-700 text-md">₹{Number(booking.plannedAmount || 0).toLocaleString('en-IN')}</span></span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">🎉 Event: <span className="font-medium text-gray-700 text-md">{booking.eventType || 'N/A'}</span></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleViewVendor(booking)} className="hover:bg-blue-100 text-blue-700 rounded p-1 border border-blue-200" title="View Vendor">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button onClick={() => handleViewUser(booking)} className="hover:bg-green-100 text-green-700 rounded p-1 border border-green-200" title="View User">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10a3 3 0 11-6 0 3 3 0 016 0zM5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;