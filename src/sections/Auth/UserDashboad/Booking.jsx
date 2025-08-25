"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  useGetUserBookingsQuery,
  useCreateBookingMutation,
  useDeleteBookingMutation,
  useGetAvailableVendorsQuery
} from '@/features/bookings/bookingAPI';
import { useVendorservicesPackageListMutation } from '@/features/vendors/vendorAPI';
import { useSelector, useDispatch } from 'react-redux';
// Ensure proper import of ToastContainer and toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for styling
import Loader from "@/components/shared/Loader";
import {
  selectBookings,
  selectTotalPlanned,
  selectTotalSpent,
  selectTotalBookingsCount,
  selectBookingLoading,
  selectBookingError,
  selectAvailableVendors,
  setFilters,
  clearFilters
} from '@/features/bookings/bookingSlice';

const BookingBudget = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const user = session?.user;
  const token = session?.accessToken;

  // Redux selectors
  const bookings = useSelector(selectBookings);
  const totalPlanned = useSelector(selectTotalPlanned);
  const totalSpent = useSelector(selectTotalSpent);
  const totalBookingsCount = useSelector(selectTotalBookingsCount);
  const isLoading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const availableVendors = useSelector(selectAvailableVendors);
  const remaining = totalPlanned - totalSpent;

  // RTK Query hooks
  const {
    refetch: refetchBookings,
    isError
  } = useGetUserBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const { isLoading: isLoadingVendors } = useGetAvailableVendorsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [vendorservicesPackageList] = useVendorservicesPackageListMutation();

  // Local state
  const [vendorPackages, setVendorPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    eventType: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    plannedAmount: '',
    selectedPackage: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access bookings');
      return;
    }
  }, [isAuthenticated]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Show error if API request fails
  useEffect(() => {
    if (isError && error) {
      toast.error(`Error loading bookings: ${error}`);
    }
  }, [isError, error]);

  
  // Fetch vendor packages when vendor is selected
  const fetchVendorPackages = async (vendorId) => {
    if (!vendorId || vendorId === 'custom') {
      setVendorPackages([]);
      return;
    }

    setIsLoadingPackages(true);
    try {
      const response = await vendorservicesPackageList({ vendorId }).unwrap();
      if (response && response.packages) {
        setVendorPackages(response.packages);
      } else {
        setVendorPackages([]);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      toast.error('Failed to fetch vendor packages');
      setVendorPackages([]);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  // Update vendor name and fetch packages when vendor ID changes
  const handleVendorChange = (vendorId) => {
    // Clear vendor name error when changing vendor
    setFormErrors(prev => ({ ...prev, vendorName: '' }));

    if (vendorId === 'custom') {
      setFormData(prev => ({
        ...prev,
        vendorId: 'custom',
        vendorName: '',
        selectedPackage: '',
        plannedAmount: ''
      }));
      setVendorPackages([]);
      return;
    }

    const selectedVendor = availableVendors.find(vendor => vendor._id === vendorId);
    if (selectedVendor) {
      setFormData(prev => ({
        ...prev,
        vendorId,
        vendorName: selectedVendor.businessName || selectedVendor.name,
        selectedPackage: '',
        plannedAmount: ''
      }));
      fetchVendorPackages(vendorId);

      // Update filters in Redux
      dispatch(setFilters({ vendorId }));
    } else {
      setFormData(prev => ({
        ...prev,
        vendorId: '',
        vendorName: '',
        selectedPackage: '',
        plannedAmount: ''
      }));
      setVendorPackages([]);
      dispatch(clearFilters());
    }
  };

  // Handle package selection
  const handlePackageChange = (packageId) => {
    const selectedPackage = vendorPackages.find(pkg => pkg._id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        selectedPackage: packageId,
        plannedAmount: selectedPackage.offerPrice || selectedPackage.price || ''
      }));
      // Clear planned amount error when selecting a package
      setFormErrors(prev => ({ ...prev, plannedAmount: '' }));
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error for the field being changed
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Check vendor name
    if (!formData.vendorName || !formData.vendorName.trim()) {
      errors.vendorName = 'Vendor name is required';
    }

    // Check event type
    if (!formData.eventType) {
      errors.eventType = 'Event type is required';
    }

    // Check planned amount
    if (!formData.plannedAmount) {
      errors.plannedAmount = 'Planned amount is required';
    } else if (isNaN(parseFloat(formData.plannedAmount)) || parseFloat(formData.plannedAmount) <= 0) {
      errors.plannedAmount = 'Please enter a valid amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddBooking = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const bookingData = {
        vendorId: formData.vendorId === 'custom' ? null : formData.vendorId,
        vendorName: formData.vendorName,
        eventType: formData.eventType,
        eventDate: formData.eventDate || null,
        venue: formData.venue || '',
        guestCount: parseInt(formData.guestCount) || 0,
        plannedAmount: parseFloat(formData.plannedAmount) || 0,
        notes: formData.notes || ''
      };

      // Add package info if selected
      if (formData.selectedPackage) {
        const selectedPackage = vendorPackages.find(pkg => pkg._id === formData.selectedPackage);
        if (selectedPackage) {
          bookingData.packageId = formData.selectedPackage;
          bookingData.packageName = selectedPackage.packageName;
        }
      }

      const result = await createBooking(bookingData).unwrap();

      // Reset form
      setFormData({
        vendorId: '',
        vendorName: '',
        eventType: '',
        eventDate: '',
        venue: '',
        guestCount: '',
        plannedAmount: '',
        selectedPackage: '',
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        notes: ''
      });

      // Clear errors
      setFormErrors({});

      // Clear filters
      dispatch(clearFilters());

      // Success toast with more details
      toast.success(`Booking for ${bookingData.vendorName} added successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (err) {
      console.error('Booking error:', err);
      
      // Detailed error toast
      toast.error(`Failed to add booking: ${err.data?.message || 'Unknown error occurred'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    // Show confirmation alert before deleting
    const confirmed = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteBooking(bookingId).unwrap();
      toast.success('Booking deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(`Error deleting booking: ${err.data?.message || 'Unknown error'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const eventTypes = [
    'Wedding',
    'Christmas Party',
    'New Year Party',
    'Lohri Party',
    'Valentine\'s Day',
    'Holi Party',
    'Diwali Party',
    'Sangeet Ceremony',
    'Ring Ceremony',
    'Pre Wedding Mehendi Party',
    'Baby Shower',
    'Birthday Party',
    'First Birthday Party',
    'Bachelor Party',
    'Bridal Shower',
    'Brand Promotion',
    'Kids Birthday Party',
    'Childrens Party',
    'Christian Communion',
    'Class Reunion',
    'Business Dinner',
    'Conference',
    'Corporate Offsite',
    'Corporate Party',
    'Cocktail Dinner',
    'Dealers Meet',
    'Engagement',
    'Exhibition',
    'Corporate Training',
    'Family Get together',
    'Farewell',
    'Fashion Show',
    'Family Function',
    'Game Watch',
    'Get Together',
    'Group Dining',
    'Freshers Party',
    'Meeting',
    'Musical Concert',
    'Naming Ceremony',
    'Kitty Party',
    'Pool Party',
    'House Party',
    'Residential Conference',
    'Photo Shoots',
    'Stage Event',
    'Team Building',
    'Team Outing',
    'Social Mixer',
    'Video Shoots',
    'Walk-in Interview',
    'Wedding Anniversary',
    'Training',
    'Adventure Party',
    'Annual Fest',
    'Aqueeqa ceremony',
    'Wedding Reception',
    'Nightlife',
    'Live Sports Screening',
    'MICE',
    'Other'
  ];

  // Show loading state
  if (isLoading || isCreating || isDeleting) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen p-2 mt-3 md:p-6 lg:mx-3">
      <div className="">
        {/* Header */}
        <div className="text-center space-y-2 mb-3">
          <h3 className="font-bold mb-3 text-gray-800 flex items-left  gap-2">
            Booking Budget Summary
          </h3>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 shadow-md p-2 rounded-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">₹{totalPlanned.toLocaleString()}</div>
            <div className="text-sm mt-1">Total Planned</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg  transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">₹{totalSpent.toLocaleString()}</div>
            <div className="text-sm mt-1">Total Spent</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg  transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">₹{remaining.toLocaleString()}</div>
            <div className="text-sm  mt-1">Remaining</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{totalBookingsCount}</div>
            <div className="text-sm  mt-1">Total Bookings</div>
          </div>
        </div>

        {/* Add New Booking Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 lg:mt-5">
          <h4 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4">
            <Plus className="h-5 w-5 " /> Add New Booking
          </h4>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="vendorId"
                  value={formData.vendorId}
                  onChange={(e) => handleVendorChange(e.target.value)}
                  className={`w-full px-4 py-2 bg-white/50 border ${formErrors.vendorName ? 'border-red-500' : 'border-gray-200'} rounded focus:border-purple-400 focus:ring focus:ring-purple-400`}
                >
                  <option value="">Select a vendor</option>
                  {isLoadingVendors ? (
                    <option disabled>Loading vendors...</option>
                  ) : (
                    availableVendors.map(vendor => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName || vendor.name}
                      </option>
                    ))
                  )}
                  <option value="custom">Other (Enter manually)</option>
                </select>
                {formData.vendorId === 'custom' && (
                  <input
                    id="vendorName"
                    placeholder="Enter vendor name"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange('vendorName', e.target.value)}
                    className={`w-full mt-2 px-4 py-2 bg-white/50 border ${formErrors.vendorName ? 'border-red-500' : 'border-gray-200'} rounded focus:border-purple-400 focus:ring focus:ring-purple-400`}
                  />
                )}
                {formErrors.vendorName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.vendorName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  User Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter User Name"
                  value={formData.name}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter Contact Number"
                  value={formData.phone}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/50 border ${formErrors.eventType ? 'border-red-500' : 'border-gray-200'} rounded focus:border-purple-400 focus:ring focus:ring-purple-400`}
                >
                  <option value="">Select type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formErrors.eventType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.eventType}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="package" className="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <select
                  id="package"
                  value={formData.selectedPackage}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  disabled={!formData.vendorId || formData.vendorId === 'custom' || isLoadingPackages}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                >
                  <option value="">Select package</option>
                  {isLoadingPackages ? (
                    <option disabled>Loading packages...</option>
                  ) : (
                    vendorPackages.map(pkg => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName} - ₹{pkg.offerPrice || pkg.price}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="plannedAmount" className="block text-sm font-medium text-gray-700">
                  Final Amount
                </label>
                <input
                  id="plannedAmount"
                  type="number"
                  placeholder="50000"
                  value={formData.plannedAmount}
                  onChange={(e) => handleInputChange('plannedAmount', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/50 border ${formErrors.plannedAmount ? 'border-red-500' : 'border-gray-200'} rounded focus:border-purple-400 focus:ring focus:ring-purple-400`}
                />
                {formErrors.plannedAmount && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" /> {formErrors.plannedAmount}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Event Date
                </label>
                <div className="relative">
                  <input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <input
                  id="venue"
                  placeholder="e.g. Grand Ballroom"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                  Guest Count
                </label>
                <input
                  id="guestCount"
                  type="number"
                  placeholder="150"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block w-full">
                <span className="block mb-1">Additional Notes</span>
                <textarea
                  rows="3"
                  placeholder="Tell us more about your event..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </label>
            </div>
            <button
              onClick={handleAddBooking}
              disabled={isCreating}
              style={{ borderRadius: '5px' }}
              className="bg-[#0F4C81] text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none"
            >
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Adding...' : 'Add Booking'}
              </span>
            </button>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 lg:mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
              <p className="text-gray-500">Add your first booking to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map(booking => (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <h4 className="font-semibold text-gray-800">{booking.vendorName}</h4>
                  <p className="text-sm text-purple-600 font-medium">{booking.eventType}</p>
                  {booking.eventDate && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {booking.venue && <p className="text-sm text-gray-600">{booking.venue}</p>}
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <p className="text-sm font-semibold text-green-600">
                      Planned: ₹{booking.plannedAmount.toLocaleString()}
                    </p>
                    {booking.spentAmount > 0 && (
                      <p className="text-sm font-semibold text-purple-600">
                        Spent: ₹{booking.spentAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}  // Increased duration
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"  // Add colored theme for better visibility
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default BookingBudget;