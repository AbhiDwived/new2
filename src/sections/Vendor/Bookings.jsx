"use client"

import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FiCheckCircle } from "react-icons/fi";
import { BsExclamationCircle } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { useGetVendorBookingsListQuery, useUpdateVendorBookingMutation, useGetUserListByIdQuery, useCreateuserBookingByVendorMutation } from "@/features/vendors/vendorAPI";
import { useGetUserProfileByIdQuery } from "@/features/auth/authAPI";
import { toast } from 'react-toastify';
import Loader from "@/components/shared/Loader";


export default function BookingManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userIdSearch, setUserIdSearch] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  const [cardStatusFilter, setCardStatusFilter] = useState('');

  // Add state for form errors
  const [formErrors, setFormErrors] = useState({});

  const cardRef = useRef(null);



  // Get vendor info from Redux store
  const vendor = useSelector((state) => state.vendor.vendor);
  const vendorId = vendor?._id || vendor?.id;

  // API queries and mutations
  const { data, isLoading, error, refetch } = useGetVendorBookingsListQuery(vendorId, {
    skip: !vendorId,
  });
  const [updateVendorBooking, { isLoading: updating }] = useUpdateVendorBookingMutation();
  const {
    data: userList,
    isLoading: isUserListLoading,
    error: userListError,
    refetch: refetchUserList,
  } = useGetUserListByIdQuery(userIdSearch, {
    skip: !shouldSearch || !userIdSearch,
  });
  const [createBooking, { isLoading: creating }] = useCreateuserBookingByVendorMutation();

  const bookings = data?.data?.bookings || [];
  // console.log("bookings", bookings);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    guestCount: 0,
    plannedAmount: 0,
    venue: ''
  });

  const statusColors = {
    confirmed: { class: "bg-green-100 text-green-800", icon: <FiCheckCircle size={16} /> },
    pending: { class: "bg-yellow-100 text-yellow-800", icon: <BsExclamationCircle size={16} /> },
    completed: { class: "bg-blue-100 text-blue-800", icon: <FiCheckCircle size={16} /> }
  };

  const overviewStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
    confirmed: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
    completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length
  };


  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateVendorBooking({
        bookingId,
        bookingData: { status: newStatus }
      }).unwrap();
      toast.success("Booking status updated successfully!");
      refetch();
    } catch (error) {
      toast.error(`Failed to update booking status: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesName = booking?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

    const matchesStatus = 
      statusFilter === 'All Status' ? true :
      booking?.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCardStatus = 
      !cardStatusFilter ? true :
      booking?.status?.toLowerCase() === cardStatusFilter.toLowerCase();

    return matchesName && matchesStatus && matchesCardStatus;
  });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setCardStatusFilter('');
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleModalClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedBooking(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      eventTime: '',
      guestCount: 0,
      plannedAmount: 0,
      venue: ''
    });
    setFormErrors({}); // Clear errors on modal close
  };

  // Validation function
  const validateBookingForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Client name is required';
    if (!formData.email) errors.email = 'Client email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.phone) errors.phone = 'Client phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errors.phone = 'Invalid Indian phone number';
    if (!formData.eventType) errors.eventType = 'Event type is required';
    if (!formData.eventDate) errors.eventDate = 'Event date is required';
    else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) errors.eventDate = 'Event date cannot be in the past';
    }
    if (!formData.eventTime) errors.eventTime = 'Event time is required';
    if (!formData.guestCount || parseInt(formData.guestCount) <= 0) errors.guestCount = 'Guest count must be greater than 0';
    if (!formData.plannedAmount || parseInt(formData.plannedAmount) <= 0) errors.plannedAmount = 'Budget must be greater than 0';
    if (!formData.venue) errors.venue = 'Venue is required';
    // Add to formErrors state if not in edit mode
    if (!isEditMode && !userIdSearch) errors.userIdSearch = 'Client ID is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleSave to use validation
  const handleSave = async () => {
    if (!validateBookingForm()) return;
    if (isEditMode && selectedBooking) {
      try {
        await updateVendorBooking({
          bookingId: selectedBooking._id,
          bookingData: {
            eventType: formData.eventType,
            eventDate: formData.eventDate,
            eventTime: formData.eventTime,
            guestCount: formData.guestCount,
            plannedAmount: formData.plannedAmount,
            venue: formData.venue,
          }
        }).unwrap();
        toast.success("Booking updated successfully!");
        refetch();
        handleModalClose();
      } catch (error) {
        toast.error(`Failed to update booking: ${error.message || 'Unknown error'}`);
      }
    } else {
      await handleCreateBooking();
    }
  };

  // Update handleCreateBooking to use validation
  const handleCreateBooking = async () => {
    if (!validateBookingForm()) return;
    try {
      const bookingData = {
        userId: userIdSearch,
        vendorId: vendorId,
        vendorName: vendor?.businessName || vendor?.name || "",
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue,
        guestCount: Number(formData.guestCount),
        plannedAmount: Number(formData.plannedAmount),
        notes: "",
      };
      const response = await createBooking(bookingData).unwrap();
      toast.success("Booking created successfully!");
      refetch();
      handleModalClose();
    } catch (error) {
      toast.error(`Failed to create booking: ${error.message || 'Unknown error'}`);
    }
  };

  const cardStatusLabelMap = {
  '': 'Total Bookings',
  'pending': 'Pending Bookings',
  'confirmed': 'Confirmed Bookings',
  'completed': 'Completed Bookings'
};

  useEffect(() => {
    if (userList && shouldSearch && userList.result) {
      const user = userList.result;
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
      setShouldSearch(false);
    }
  }, [userList, shouldSearch]);

  const stats = [
    { 
      title: 'Total Bookings', 
      count: overviewStats.total, 
      type: '', 
      color: 'blue', 
      gradient: 'from-blue-50 to-blue-100',
      onClick: () => setCardStatusFilter('')
    },
    { 
      title: 'Pending', 
      count: overviewStats.pending, 
      type: 'pending', 
      color: 'yellow', 
      gradient: 'from-yellow-50 to-yellow-100',
      onClick: () => setCardStatusFilter('pending')
    },
    { 
      title: 'Confirmed', 
      count: overviewStats.confirmed, 
      type: 'confirmed', 
      color: 'green', 
      gradient: 'from-green-50 to-green-100',
      onClick: () => setCardStatusFilter('confirmed')
    },
    { 
      title: 'Completed', 
      count: overviewStats.completed, 
      type: 'completed', 
      color: 'purple', 
      gradient: 'from-purple-50 to-purple-100',
      onClick: () => setCardStatusFilter('completed')
    }
  ];

  // Get user profile data
  const { data: userProfileData, isLoading: isProfileLoading } = useGetUserProfileByIdQuery(selectedUserId, {
    skip: !selectedUserId || !showViewModal,
  });

  const handleViewProfile = (userId) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }
    setSelectedUserId(userId);
    setShowViewModal(true);
  };

 

  if (!vendorId) {
    return (
      <div className="text-center mt-10 text-red-500">
        Vendor ID not found. Please refresh the page.
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Error loading bookings: {error?.data?.message || error?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="p-2 w-full bg-gray-50 min-h-screen ">
      {/* Booking Overview */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Bookings Management</h2>
            <p className="text-sm text-gray-500">View and manage all venue bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.type}
              onClick={stat.onClick}
              className={`bg-gradient-to-r ${stat.gradient} px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300
                ${cardStatusFilter === stat.type
                  ? `shadow-md transform scale-[1.02] border border-${stat.color}-200` 
                  : 'hover:shadow-md hover:scale-[1.01] border border-transparent'}`}
            >
              <p className={`text-sm text-${stat.color}-600 mb-1 font-bold`}>{stat.title}</p>
              <p className={`text-xl font-semibold text-${stat.color}-700`}>{stat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Heading and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="sm:text-2xl text-[15px] font-semibold">
          {cardStatusFilter ? `${cardStatusFilter.charAt(0).toUpperCase() + cardStatusFilter.slice(1)} Bookings` : 'All Bookings'}
        </p>
        <button
          onClick={() => {
            setIsEditMode(false);
            setSelectedBooking(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              eventType: '',
              eventDate: '',
              eventTime: '',
              guestCount: 0,
              plannedAmount: 0,
              venue: ''
            });
            setFormErrors({}); // Clear errors on new booking
            setShowModal(true);
          }}
          className="bg-[#19599A] text-white px-3 py-1 rounded hover:bg-[#19599A] whitespace-nowrap sm:w-auto sm:ml-0 ml-4 text-sm sm:text-base"
        >
          + Add Booking
        </button>
      </div>

      

      {/* Booking Cards */}
      {filteredBookings.map((booking) => (
        <div
          key={booking._id}
          className="relative border border-gray-200 rounded-lg px-2 py-4 mb-4 bg-white shadow-sm"
        >
          {/* Top Row: Name and Actions */}
          <div className="flex justify-between items-start flex-wrap md:flex-nowrap mb-2 sm:justify-center sm:items-center">
            <div className="items-center justify-between inline sm:flex">
              <span className="text-[18px] sm:text-[20px] font-semibold text-gray-800">
                {booking?.user?.name || "Unknown User"}
              </span>
              <div className="inline">
                <div className={`flex justify-center gap-1 w-[80px] lg:m-2  sm:w-[100px] py-2 items-center-safe rounded text-[12px]  ${statusColors[booking?.status?.toLowerCase()]?.class || statusColors['pending'].class}`}>
                  <span className="font-medium">
                    {statusColors[booking?.status?.toLowerCase()]?.icon || statusColors['pending'].icon}
                  </span>
                  <span className="">{booking?.status || 'Pending'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:mt-2 ml-auto md:w[70px]">
              <button 
                onClick={() => handleViewProfile(booking?.user?._id)}
                className="hover:bg-[#DEBF78] text-gray-600 rounded p-1 border border-gray-300" 
                title="View"
                disabled={!booking?.user?._id}
              >
                <IoEyeOutline className="w-[12px] sm:w-[15px]" />
              </button>
              <button
                className="hover:bg-[#DEBF78] text-gray-600 rounded p-1 border border-gray-300"
                title="Edit"
                onClick={() => {
                  setIsEditMode(true);
                  setShowModal(true);
                  setSelectedBooking(booking);
                  setFormData({
                    eventType: booking?.eventType || '',
                    eventDate: booking?.eventDate?.split('T')[0] || '',
                    eventTime: booking?.eventTime || '',
                    guestCount: booking?.guestCount || 0,
                    plannedAmount: booking?.plannedAmount || 0,
                    venue: booking?.venue || '',
                    name: booking?.user?.name || '',
                    email: booking?.user?.email || '',
                    phone: booking?.user?.phone || '',
                  });
                  setFormErrors({}); // Clear errors on edit
                }}
              >
                <FaRegEdit className="w-[12px] sm:w-[15px]" />
              </button>
              <select
                className="border border-gray-300 rounded-md p-2 text-[10px]  w-[100px]"
                value={booking?.status || 'pending'}
                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-gray-500" />
                {booking?.eventDate ? (
                  <>{new Date(booking.eventDate).toLocaleDateString()} at {booking?.eventTime || 'N/A'}</>
                ) : (
                  'Date not set'
                )}
              </div>
              <div className="text-sm text-gray-500">
                Event: {booking?.eventType || 'N/A'} | Guests: {booking?.guestCount || 0}
              </div>
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <div className="p-2 text-sm flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-600" />
                <span className="text-gray-700 font-medium">{booking?.venue || 'Venue not set'}</span>
              </div>
              <div className="p-2 text-sm font-semibold text-gray-700">
                ₹{(booking?.plannedAmount || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* View Profile Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-2">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Profile</h2>
              <button onClick={() => {
                setShowViewModal(false);
                setSelectedUserId(null);
              }} className="text-gray-500 hover:text-gray-700">
                <ImCross />
              </button>
            </div>

            {isProfileLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader />
              </div>
            ) : userProfileData?.user ? (
              <div className="space-y-4">
                {/* Profile Photo */}
                <div className="flex justify-center mb-4">
                  {userProfileData.user.profilePhoto ? (
                    <img 
                      src={userProfileData.user.profilePhoto} 
                      alt={`${userProfileData.user.name}'s profile`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {userProfileData.user.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{userProfileData.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userProfileData.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userProfileData.user.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{userProfileData.user.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wedding Date</p>
                    <p className="font-medium">
                      {userProfileData.user.weddingDate 
                        ? new Date(userProfileData.user.weddingDate).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Partner Name</p>
                    <p className="font-medium">{userProfileData.user.partnerName || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">About</p>
                  <p className="font-medium">{userProfileData.user.about || 'No description available'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {userProfileData?.message || 'No profile data available'}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUserId(null);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-2 ">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh] ">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold ">Add Booking</h2>
                <p className="text-sm text-gray-500">Update booking information</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                <ImCross />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditMode && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Search Client by ID <span className="text-red-500">*</span></label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={userIdSearch}
                      onChange={(e) => setUserIdSearch(e.target.value)}
                      placeholder="Enter Client ID"
                      className={`w-full border rounded p-2 ${formErrors.userIdSearch ? 'border-red-500' : ''}`}
                    />
                    <button
                      onClick={() => {
                        if (userIdSearch.trim()) setShouldSearch(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Search
                    </button>
                  </div>
                  {formErrors.userIdSearch && <span className="text-red-500 text-xs mt-1">{formErrors.userIdSearch}</span>}
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Client Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.name ? 'border-red-500' : ''}`}
                />
                {formErrors.name && <span className="text-red-500 text-xs mt-1">{formErrors.name}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Client Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Client Phone <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.phone ? 'border-red-500' : ''}`}
                />
                {formErrors.phone && <span className="text-red-500 text-xs mt-1">{formErrors.phone}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Event Type <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.eventType ? 'border-red-500' : ''}`}
                />
                {formErrors.eventType && <span className="text-red-500 text-xs mt-1">{formErrors.eventType}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Event Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.eventDate ? 'border-red-500' : ''}`}
                />
                {formErrors.eventDate && <span className="text-red-500 text-xs mt-1">{formErrors.eventDate}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Event Time <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.eventTime ? 'border-red-500' : ''}`}
                />
                {formErrors.eventTime && <span className="text-red-500 text-xs mt-1">{formErrors.eventTime}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Guest Count <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.guestCount ? 'border-red-500' : ''}`}
                />
                {formErrors.guestCount && <span className="text-red-500 text-xs mt-1">{formErrors.guestCount}</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Budget <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.plannedAmount}
                  onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.plannedAmount ? 'border-red-500' : ''}`}
                />
                {formErrors.plannedAmount && <span className="text-red-500 text-xs mt-1">{formErrors.plannedAmount}</span>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Venue <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className={`w-full border rounded p-2 ${formErrors.venue ? 'border-red-500' : ''}`}
                />
                {formErrors.venue && <span className="text-red-500 text-xs mt-1">{formErrors.venue}</span>}
              </div>
            </div>

            <div className="mt-2 flex justify-end p-4 rounded">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#19599A] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:bg-[#19599A]"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}