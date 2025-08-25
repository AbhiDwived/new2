"use client"

import React, { useEffect, useState } from 'react';
import { FaStar, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';
import { HiOutlineCalendar } from "react-icons/hi";
import { useParams, useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useGetVendorByIdQuery, useGetVendorBySeoUrlQuery, useVendorservicesPackageListMutation, useGetAllPublicVendorsQuery } from '@/features/vendors/vendorAPI';
=======
import { useGetVendorByIdQuery, useGetVendorBySeoUrlQuery, useVendorservicesPackageListMutation } from '@/features/vendors/vendorAPI';
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
import { useCreateBookingMutation, useGetUserBookingsQuery } from '@/features/bookings/bookingAPI';
import { toast } from 'react-toastify';
// import mainProfile from "..//mainProfile.png";

import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";
import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Loader from '@/components/shared/Loader';
import { useAddUserInquiryMessageMutation } from '@/features/auth/authAPI';
import { useCreateAnonymousInquiryMutation } from '@/features/inquiries/inquiryAPI';
import { ImCross } from 'react-icons/im';
import { useGetPortfolioImagesQuery, useGetPortfolioVideosQuery } from '@/features/vendors/vendorAPI';
import { useGetVendorReviewsQuery } from '@/features/reviews/reviewAPI';
import { useGetSavedVendorsQuery, useUnsaveVendorMutation, useSaveVendorMutation } from "@/features/savedVendors/savedVendorAPI";

const PreviewProfile = ({ params }) => {
  const [activeTab, setActiveTab] = useState("About");
  const [activeGalleryTab, setActiveGalleryTab] = useState('images');
  const router = useRouter();
  const urlParams = useParams();
  
<<<<<<< HEAD
  // Get params from Next.js routing - use React.use() for Next.js 15
  const resolvedParams = React.use(params) || urlParams || {};
  const { city, slug, venue, vendor, vendorId } = resolvedParams;
  
  // For venue routes like /venue/city/venue-name-in-location
  // slug will be an array like ['venue-name-in-location']
  const venueSlug = Array.isArray(slug) ? slug[0] : slug;
  
  // Get vendor ID from query parameter if available
  const [searchParams, setSearchParams] = useState(null);
  // Determine business type based on route
  const [routeInfo, setRouteInfo] = useState({ isVenueRoute: false, isVendorRoute: false });
  
  // Consolidated window-dependent logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
      const pathname = window.location.pathname;
      setRouteInfo({
        isVenueRoute: pathname.includes('/venue/'),
        isVendorRoute: pathname.includes('/vendors/')
      });
    }
  }, []);
  
  const queryVendorId = searchParams?.get('id');
  
  // Use venue parameter for venue routes, vendor parameter for vendor routes
  const slugParam = venueSlug || venue || vendor;
  
  const finalBusinessType = routeInfo.isVenueRoute ? 'venue' : routeInfo.isVendorRoute ? 'vendor' : 'venue';
  
  // Check if we have SEO URL params or direct vendor ID
  const hasSeoParams = city && slugParam;
  const hasVendorId = vendorId || queryVendorId;
=======
  // Get params from Next.js routing - params is a Promise in Next.js 15
  const resolvedParams = React.use(params) || urlParams || {};
  const { city, category, venue, vendor, vendorId } = resolvedParams;
  
  // Get vendor ID from query parameter if available
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const queryVendorId = searchParams?.get('id');
  
  // Use venue parameter for venue routes, vendor parameter for vendor routes
  const slugParam = venue || vendor;
  
  // Determine business type based on route
  const isVenueRoute = typeof window !== 'undefined' && window.location.pathname.includes('/venue/');
  const isVendorRoute = typeof window !== 'undefined' && window.location.pathname.includes('/vendors/');
  const finalBusinessType = isVenueRoute ? 'venue' : isVendorRoute ? 'vendor' : 'venue';
  
  // Check if we have SEO URL params or direct vendor ID
  const hasSeoParams = city && category && slugParam;
  const hasVendorId = vendorId;
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  

  
  // Use SEO URL if all SEO params are present
  const { data: vendorBySeo, isLoading: isLoadingBySeo, error: errorBySeo } = useGetVendorBySeoUrlQuery(
<<<<<<< HEAD
    { businessType: finalBusinessType, city, slug: slugParam },
=======
    { businessType: finalBusinessType, city, type: category, slug: slugParam },
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    { skip: !hasSeoParams }
  );
  

  
  // Use vendor ID for direct access (from route param or query param)
  const finalVendorId = vendorId || queryVendorId;
  const { data: vendorById, isLoading: isLoadingById, error: errorById } = useGetVendorByIdQuery(
    finalVendorId,
    { skip: !finalVendorId || hasSeoParams }
  );
  
<<<<<<< HEAD
  // Fallback: Get all vendors if SEO URL fails
  const { data: allVendorsData } = useGetAllPublicVendorsQuery(undefined, {
    skip: (hasSeoParams && vendorBySeo) || hasVendorId
  });
  
  // Find vendor by business name from slug if SEO URL fails
  const vendorFromSlug = React.useMemo(() => {
    if (!slugParam || !allVendorsData?.vendors) return null;
    const searchName = slugParam.replace(/-/g, ' ').replace(/\bin\b.*$/, '').trim();
    return allVendorsData.vendors.find(v => 
      v.businessName?.toLowerCase().includes(searchName.toLowerCase()) ||
      searchName.toLowerCase().includes(v.businessName?.toLowerCase())
    );
  }, [slugParam, allVendorsData]);
  
  // Memoize vendor data resolution to prevent unnecessary recalculations
  const vendorData = React.useMemo(() => {
    // Priority order: SEO URL > Direct ID > Slug fallback
    if (hasSeoParams && vendorBySeo?.vendor) return vendorBySeo;
    if (hasVendorId && vendorById?._id) return vendorById;
    if (vendorFromSlug?._id) return { vendor: vendorFromSlug };
    return null;
  }, [hasSeoParams, vendorBySeo?.vendor?._id, hasVendorId, vendorById?._id, vendorFromSlug?._id]);
  
  const isVendorLoading = React.useMemo(() => {
    if (hasSeoParams) return isLoadingBySeo;
    if (hasVendorId) return isLoadingById;
    return false;
  }, [hasSeoParams, isLoadingBySeo, hasVendorId, isLoadingById]);
  
  const vendorError = React.useMemo(() => {
    return !vendorData && !isVendorLoading ? 'Vendor not found' : null;
  }, [vendorData, isVendorLoading]);
=======
  // Use appropriate data - prefer SEO lookup, fallback to ID lookup
  const vendorData = (hasSeoParams && vendorBySeo) ? vendorBySeo : vendorById;
  const isVendorLoading = hasSeoParams ? isLoadingBySeo : isLoadingById;
  const vendorError = (hasSeoParams && !vendorBySeo && !isLoadingBySeo) ? null : (hasSeoParams ? errorBySeo : errorById);
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  
  const actualVendorId = vendorData?.vendor?._id || vendorData?._id || vendorId;


  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const { refetch: refetchBookings } = useGetUserBookingsQuery(undefined, { skip: !isAuthenticated });
  const [packages, setPackages] = useState([]);
  const [getVendorPackages] = useVendorservicesPackageListMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;
  // const userId = user?._id;

<<<<<<< HEAD
=======

  

>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  // Booking form state with validation
  const [bookingForm, setBookingForm] = useState({
    eventType: '',
    packageName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: '',
    selectedPackage: '',
    plannedAmount: '5000',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Inquiry form state with validation
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: ''
  });

  // Inquiry errors state
  const [inquiryErrors, setInquiryErrors] = useState({});

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Update validateForm for booking
  const validateForm = () => {
    const errors = {};
    if (!bookingForm.eventType) errors.eventType = 'Event type is required';
    if (!bookingForm.packageName) errors.packageName = 'Package name is required';
    if (!bookingForm.eventDate) errors.eventDate = 'Event date is required';
    if (!bookingForm.name) errors.name = 'Name is required';
    if (!bookingForm.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(bookingForm.email)) errors.email = 'Invalid email address';
    if (!bookingForm.phone) errors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(bookingForm.phone)) errors.phone = 'Invalid Indian phone number';
    if (!bookingForm.plannedAmount) errors.plannedAmount = 'Planned amount is required';
    if (!bookingForm.guestCount) errors.guestCount = 'Number of guests is required';
    else if (parseInt(bookingForm.guestCount) <= 0) errors.guestCount = 'Number of guests must be greater than 0';
    // Validate date is not in the past
    if (bookingForm.eventDate) {
      const selectedDate = new Date(bookingForm.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.eventDate = 'Event date cannot be in the past';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Inquiry validation
  const validateInquiry = () => {
    const errors = {};
    if (!inquiryForm.name) errors.name = 'Name is required';
    if (!inquiryForm.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(inquiryForm.email)) errors.email = 'Invalid email address';
    if (!inquiryForm.phone) errors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(inquiryForm.phone)) errors.phone = 'Invalid mobile number';
    if (!inquiryForm.eventDate) errors.eventDate = 'Event date is required';
    if (!inquiryForm.message) errors.message = 'Message is required';
    setInquiryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingInputChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fetch vendor packages
  useEffect(() => {
    const fetchPackages = async () => {
      if (!actualVendorId) {
        return;
      }

      try {
        const response = await getVendorPackages({ vendorId: actualVendorId }).unwrap();

        if (response?.packages && Array.isArray(response.packages)) {
          setPackages(response.packages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        toast.error('Failed to load vendor packages');
        setPackages([]);
      }
    };

    if (!isVendorLoading && actualVendorId) {
      fetchPackages();
    }
  }, [actualVendorId, isVendorLoading, getVendorPackages]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    // Authorization checks
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      router.push('/login');
      return;
    }
<<<<<<< HEAD
    
    // Validate vendor exists
    if (!actualVendorId) {
      toast.error('Vendor information not available');
      return;
    }
    
    // Check if user is trying to book their own service
    if (user?.role === 'vendor' && user?.id === actualVendorId) {
      toast.error('You cannot book your own service');
      return;
    }
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      // Find selected package details
      const selectedPackageDetails = packages.find(pkg => pkg._id === bookingForm.packageName);

      // Use offer price if available and less than regular price
      const finalPrice = selectedPackageDetails?.offerPrice &&
        selectedPackageDetails.offerPrice < selectedPackageDetails.price
        ? selectedPackageDetails.offerPrice
        : selectedPackageDetails?.price || 0;

      const response = await createBooking({
        vendorId: actualVendorId,
        vendorName: vendorData?.vendor?.businessName || '',
        eventType: bookingForm.eventType,
        packageName: selectedPackageDetails?.packageName || '',
        packageId: bookingForm.packageName,
        packagePrice: selectedPackageDetails?.price || 0,
        offerPrice: selectedPackageDetails?.offerPrice || 0,
        finalPrice: finalPrice,
        eventDate: bookingForm.eventDate,
        eventTime: bookingForm.eventTime,
        venue: bookingForm.venue,
        guestCount: parseInt(bookingForm.guestCount) || 0,
        plannedAmount: finalPrice,
        userName: bookingForm.name,
        userEmail: bookingForm.email,
        userPhone: bookingForm.phone,
        notes: bookingForm.notes
      }).unwrap();

      if (response.success) {
        toast.success('Booking request sent successfully');
        refetchBookings();

        // Reset form
        setBookingForm({
          eventType: '',
          packageName: '',
          eventDate: '',
          eventTime: '',
          venue: '',
          guestCount: '',
          selectedPackage: '',
          plannedAmount: '0',
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          notes: ''
        });
        setFormErrors({});
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Error creating booking');
    }
  };

  const actualVendor = vendorData?.vendor || vendorData;

<<<<<<< HEAD
  // Helper function to render vendor services
  const renderVendorServices = () => {
    let raw = vendorData?.vendor?.services || actualVendor?.services || [];
    let vendorServices = Array.isArray(raw)
      ? raw.length === 1 && typeof raw[0] === "string"
        ? raw[0].split(',').map(s => s.trim())
        : raw
      : [];

    return vendorServices.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {vendorServices.map((service, index) => (
          <span
            key={index}
            className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
          >
            {service}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-sm text-gray-400">No services available</span>
    );
  };

  // Helper function to render vendor address
  const renderVendorAddress = () => {
    const vendorAddress = vendorData?.vendor?.address || actualVendor?.address;
    if (vendorAddress && typeof vendorAddress === 'object') {
      // Handle address object format
      const parts = [];
      if (vendorAddress.street) parts.push(vendorAddress.street);
      if (vendorAddress.city) parts.push(vendorAddress.city);
      if (vendorAddress.state) parts.push(vendorAddress.state);
      if (vendorAddress.zipCode) parts.push(vendorAddress.zipCode);
      return parts.length > 0 ? parts.join(', ') : 'Location not available';
    } else if (typeof vendorAddress === 'string') {
      // Handle legacy string format
      return vendorAddress;
    } else if ((vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas)?.length > 0) {
      // Fallback to service areas
      return (vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas).map((area, index) => (
        <span key={index}>
          {area}
          {index !== (vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas).length - 1 && ', '}
        </span>
      ));
    } else {
      return 'Location not available';
    }
  };
=======

>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

  const [isSaved, setIsSaved] = useState(false);

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [addUserInquiryMessage] = useAddUserInquiryMessageMutation();
  const [createAnonymousInquiry] = useCreateAnonymousInquiryMutation();

  const userRecord = useSelector((state) => state.auth);
  const userId = userRecord?.user?.id;

  

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update handleInquirySubmit to use validateInquiry
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    // Authorization checks
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    if (userRecord?.user?.role === 'vendor') {
      toast.error('Vendors cannot send inquiries');
      return;
    }
<<<<<<< HEAD
    
    // Validate vendor exists
    if (!actualVendor?._id) {
      toast.error('Vendor information not available');
      return;
    }
    
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    if (!validateInquiry()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
<<<<<<< HEAD
    
    setInquiryLoading(true);
    try {
      if (userId) {
        // Authenticated user inquiry
        await addUserInquiryMessage({
          userId,
          vendorId: actualVendor._id,
=======
    setInquiryLoading(true);
    try {
      if (userId) {
        await addUserInquiryMessage({
          userId,
          vendorId: actualVendor?._id,
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          eventDate: inquiryForm.eventDate,
          message: inquiryForm.message
        }).unwrap();
        toast.success('Inquiry sent successfully!');
      } else {
<<<<<<< HEAD
        // Anonymous inquiry
        await createAnonymousInquiry({
          vendorId: actualVendor._id,
=======
        await createAnonymousInquiry({
          vendorId: actualVendor?._id,
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          eventDate: inquiryForm.eventDate,
          message: inquiryForm.message
        }).unwrap();
        toast.success('Inquiry sent successfully as guest!');
      }
<<<<<<< HEAD
      
      // Reset form on success
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        message: ''
      });
      setInquiryErrors({});
    } catch (err) {
<<<<<<< HEAD
      console.error('Inquiry submission error:', err);
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      toast.error(err.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  // Only scroll to top on initial page load, not after form submit or any form interaction
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleVideoView = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const ImageViewModal = ({ imageUrl, onClose }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="max-w-[90%] max-h-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Full Size"
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
        >
          <ImCross size={16} />
        </button>
      </div>
    </div>
  );

<<<<<<< HEAD
  const VideoViewModal = ({ videoUrl, onClose }) => {
    const getEmbedUrl = (url) => {
      try {
        if (!url || typeof url !== 'string') return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          return url.replace('watch?v=', 'embed/');
        }
        return url;
      } catch (error) {
        console.error('Error processing video URL:', error);
        return '';
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        onClick={onClose}
      >
        <div
          className="max-w-[90%] max-h-[90%] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-[80vh]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
            onClick={onClose}
          >
            <ImCross size={16} />
          </button>
        </div>
      </div>
    );
  };
=======
  const VideoViewModal = ({ videoUrl, onClose }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="max-w-[90%] max-h-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          className="w-full h-[80vh]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
        >
          <ImCross size={16} />
        </button>
      </div>
    </div>
  );
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

  // Portfolio Gallery Queries
  const { data: portfolioImagesData } = useGetPortfolioImagesQuery(actualVendorId, {
    skip: !actualVendorId
  });

  const { data: portfolioVideosData } = useGetPortfolioVideosQuery(actualVendorId, {
    skip: !actualVendorId
  });

  const vendorPortfolio = {
    images: portfolioImagesData?.images || [],
    videos: portfolioVideosData?.videos || []
  };



  const { data: reviewData } = useGetVendorReviewsQuery(actualVendorId, { skip: !actualVendorId });
  const reviews = reviewData?.reviews || [];
  // const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;
<<<<<<< HEAD
  const calculatedAvgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const avgRating = calculatedAvgRating === 5 ? '5' : calculatedAvgRating.toFixed(1);
=======
  const avg = reviews.length
  ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
  : 0;

const avgRating = avg === 5 ? '5' : avg.toFixed(1);
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

  const reviewCount = reviews.length;

  // Loading and error states
  if (isVendorLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (vendorError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Venue Not Found</h2>
          <p className="text-gray-600">The venue you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (!vendorData || (!vendorData.vendor && !vendorData._id)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Venue Data</h2>
          <p className="text-gray-600">Unable to load venue information.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save vendor functionality
  };

  return (
    <div className="mx-auto px-2 py-3 font-serif">
      <button
        className='flex items-center text-gray-800 px-2 py-2 rounded border border-gray-400 mb-2 hover:bg-[#DEBF78]'
<<<<<<< HEAD
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }}
=======
        onClick={() => window.history.back()}
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      >
        <FaArrowLeft className='mr-2' /> Back to Vendor
      </button>
      {/* Header */}

      <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-start gap-4">
        {/* Profile Image */}
        <img
          src={vendorData?.vendor?.profilePicture || vendorData?.vendor?.profilePhoto || actualVendor?.profilePicture || actualVendor?.profilePhoto}
          alt={vendorData?.vendor?.businessName || actualVendor?.businessName || "Vendor Profile"}
          className="w-40 h-40 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1 space-y-1">

          <h2 className="text-xl font-bold text-gray-800">{vendorData?.vendor?.businessName || actualVendor?.businessName}</h2>
          <p className="text-sm text-gray-500">{vendorData?.vendor?.vendorType || actualVendor?.vendorType}</p>





          {/* Services */}
          <div className="flex flex-wrap gap-2 mt-2">
<<<<<<< HEAD
            {renderVendorServices()}
=======
            {(() => {
              let raw = vendorData?.vendor?.services || actualVendor?.services || [];
              let vendorServices = Array.isArray(raw)
                ? raw.length === 1 && typeof raw[0] === "string"
                  ? raw[0].split(',').map(s => s.trim())
                  : raw
                : [];

              return vendorServices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendorServices.map((service, index) => (
                    <span
                      key={index}
                      className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">No services available</span>
              );
            })()}
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
          </div>

          {/* Pricing */}
          <div className="flex overflow-x-auto flex-nowrap  gap-4 mt-2 whitespace-nowrap">
            {(vendorData?.vendor?.pricing || actualVendor?.pricing)?.filter(item => item?.type && item?.price)?.length > 0 ? (
              (vendorData?.vendor?.pricing || actualVendor?.pricing)
                .filter(item => item?.type && item?.price)
                .map((item, index) => (
                  <div
                    key={item._id || index}
                    className="inline-block min-w-[200px] border-blue-400 rounded-xl p-2  text-sm font-bold text-gray-800"
                  >
                    <span className="text-gray-500">{item.type}:</span>  ₹{item.price.toLocaleString('en-IN')}  <span className='text-gray-500'>{item.unit || 'per person'}</span>
                  </div>
                ))
            ) : (
              <div className="text-sm text-gray-500">No Pricing Available</div>
            )}
          </div>

          {/* Rating & Location */}
          <div className="flex flex-wrap items-center gap-2 text-md text-gray-600 mt-1">
            <span className="flex items-center font-medium">
              <FaStar className="mr-1" color={"#FACC15"} size={22} />
              {avgRating}
              <span className="ml-1 text-gray-400">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
            </span>
            <span>·</span>

            <span className="flex items-center">
              <IoLocationOutline className="inline-block mr-1" />
<<<<<<< HEAD
              {renderVendorAddress()}
=======
              {(() => {
                const vendorAddress = vendorData?.vendor?.address || actualVendor?.address;
                if (vendorAddress && typeof vendorAddress === 'object') {
                  // Handle address object format
                  const parts = [];
                  if (vendorAddress.street) parts.push(vendorAddress.street);
                  if (vendorAddress.city) parts.push(vendorAddress.city);
                  if (vendorAddress.state) parts.push(vendorAddress.state);
                  if (vendorAddress.zipCode) parts.push(vendorAddress.zipCode);
                  return parts.length > 0 ? parts.join(', ') : 'Location not available';
                } else if (typeof vendorAddress === 'string') {
                  // Handle legacy string format
                  return vendorAddress;
                } else if ((vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas)?.length > 0) {
                  // Fallback to service areas
                  return (vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas).map((area, index) => (
                    <span key={index}>
                      {area}
                      {index !== (vendorData?.vendor?.serviceAreas || actualVendor?.serviceAreas).length - 1 && ', '}
                    </span>
                  ));
                } else {
                  return 'Location not available';
                }
              })()}
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
            </span>


          </div>

          <div className="flex flex-wrap justify-start gap-2 mt-2 sm:mt-0 w-full">
            <span className="text-sm px-3 py-1 rounded-full text-white whitespace-nowrap"
              style={{ backgroundColor: (vendorData?.vendor?.isActive || actualVendor?.isActive) ? "#34C759" : "#0f4c81" }}
            >
              {(vendorData?.vendor?.status || actualVendor?.status) ? "Active" : "Inactive"}
            </span>

            {/* {vendor?.isVerified && ( */}
            <span className="text-sm px-3 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 border-2 border-green-600 whitespace-nowrap">
              <FiShield className="text-green-600" size={16} />
              Verified
            </span>
            {/* )} */}

            {/* {vendor?.isApproved && ( */}
            <span className="text-sm px-3 py-1 rounded-full text-[#0f4c81] border-2 border-[#0f4c81] whitespace-nowrap">
              Approved
            </span>
            {/* )} */}
          </div>

          {/* Description */}
          <p className="text-md text-gray-500 mt-2">
            {/* {vendor?.vendor?.description || 'No description available'} */}
          </p>
        </div>

        {/* Save Button */}

        <div className="absolute sm:top-35 sm:right-8 right-4 md:mt-2">
          <button
            className="flex items-center text-sm text-gray-700 border  px-3 py-2 rounded hover:bg-[#DEBF78]"
            onClick={handleSave}
          >
            <FaRegHeart className={isSaved ? "text-red-500 mr-2" : "mr-2"} /> Save
          </button>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Photo Gallery */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Portfolio Gallery</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveGalleryTab('images')}
                className={`px-3 py-1 rounded text-sm ${activeGalleryTab === 'images' ? 'bg-[#0f4c81] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Images ({vendorPortfolio.images.length})
              </button>
              <button
                onClick={() => setActiveGalleryTab('videos')}
                className={`px-3 py-1 rounded text-sm ${activeGalleryTab === 'videos' ? 'bg-[#0f4c81] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Videos ({vendorPortfolio.videos.length})
              </button>
            </div>
          </div>

          {activeGalleryTab === 'images' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vendorPortfolio.images.length > 0 ? (
                  vendorPortfolio.images
                    .slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
                    .map((image, i) => (
                      <div
                        key={image._id || i}
                        className="relative group cursor-pointer"
                        onClick={() => handleImageView(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.title || `Portfolio Image ${i + 1}`}
                          className="rounded object-cover w-full h-56 transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm truncate">{image.title || 'Portfolio Image'}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No portfolio images available
                  </div>
                )}
              </div>

              {/* Pagination */}
              {vendorPortfolio.images.length > imagesPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0f4c81] text-white hover:bg-[#0d3d6a]'
                      }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.ceil(vendorPortfolio.images.length / imagesPerPage) },
                    (_, i) => i + 1
                  ).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-full ${currentPage === pageNum
                        ? 'bg-[#0f4c81] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev =>
                      Math.min(prev + 1, Math.ceil(vendorPortfolio.images.length / imagesPerPage))
                    )}
                    disabled={currentPage === Math.ceil(vendorPortfolio.images.length / imagesPerPage)}
                    className={`px-3 py-1 rounded ${currentPage === Math.ceil(vendorPortfolio.images.length / imagesPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0f4c81] text-white hover:bg-[#0d3d6a]'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {activeGalleryTab === 'videos' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vendorPortfolio.videos.length > 0 ? (
                vendorPortfolio.videos.map((video, i) => (
                  <div
                    key={video._id || i}
                    className="relative group cursor-pointer"
<<<<<<< HEAD
                    onClick={() => {
                      try {
                        if (video.url && typeof video.url === 'string' && 
                            (video.url.includes('youtube.com') || video.url.includes('youtu.be'))) {
                          handleVideoView(video.url);
                        } else {
                          console.warn('Invalid video URL format:', video.url);
                        }
                      } catch (error) {
                        console.error('Error handling video view:', error);
                      }
                    }}
                  >
                    <iframe
                      src={(() => {
                        try {
                          if (!video.url || typeof video.url !== 'string') return '';
                          return video.url.includes('youtube.com')
                            ? video.url.replace('watch?v=', 'embed/')
                            : video.url;
                        } catch (error) {
                          console.error('Error processing video URL:', error);
                          return '';
                        }
                      })()}
=======
                    onClick={() => handleVideoView(video.url)}
                  >
                    <iframe
                      src={video.url.includes('youtube.com')
                        ? video.url.replace('watch?v=', 'embed/')
                        : video.url}
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
                      title={video.title || `Portfolio Video ${i + 1}`}
                      className="rounded w-full h-60 object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm truncate">{video.title || 'Portfolio Video'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No portfolio videos available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="mx-auto border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm bg-white text-sm grid gap-4 sm:grid-cols-2 w-full max-w-screen-sm">
          <h3 className="font-semibold text-xl sm:col-span-2">Book Your Service</h3>

          <label className="sm:col-span-2">
            <span className="block mb-1">Vendor</span>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={vendorData?.vendor?.businessName || actualVendor?.businessName || ''}
              readOnly
            />
          </label>

          <label className="sm:col-span-2">
            <span className="block mb-1">User Name <span className="text-red-500">*</span></span>
            <input
              type="text"
              value={bookingForm.name}
              onChange={(e) => handleBookingInputChange('name', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.name ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.name && <span className="text-red-500 text-xs mt-1">{formErrors.name}</span>}
          </label>

          <label>
            <span className="block mb-1">Email <span className="text-red-500">*</span></span>
            <input
              type="email"
              value={bookingForm.email}
              onChange={(e) => handleBookingInputChange('email', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.email ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.email && <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>}
          </label>

          <label>
            <span className="block mb-1">Phone Number <span className="text-red-500">*</span></span>
            <input
              type="tel"
              value={bookingForm.phone}
              onChange={(e) => handleBookingInputChange('phone', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.phone ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.phone && <span className="text-red-500 text-xs mt-1">{formErrors.phone}</span>}
          </label>

          <label>
            <span className="block mb-1">Event Type <span className="text-red-500">*</span></span>
            <select
              value={bookingForm.eventType}
              onChange={(e) => handleBookingInputChange('eventType', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.eventType ? 'border-red-500' : ''}`}
            >
              <option value="">Select Event Type</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Reception">Reception</option>
              <option value="Engagement">Engagement</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.eventType && <span className="text-red-500 text-xs mt-1">{formErrors.eventType}</span>}
          </label>

          <label>
            <span className="block mb-1">Package Name <span className="text-red-500">*</span></span>
            <select
              value={bookingForm.packageName}
              onChange={(e) => {

                const selectedPackage = packages.find(pkg => pkg._id === e.target.value);

                handleBookingInputChange('packageName', e.target.value);
                if (selectedPackage) {
                  handleBookingInputChange('plannedAmount', selectedPackage.price || 0);
                }
              }}
              className={`w-full border rounded px-3 py-2 ${formErrors.packageName ? 'border-red-500' : ''}`}
            >
              <option value="">Select Package</option>
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName} - ₹{pkg.price?.toLocaleString('en-IN')}
                    {pkg.offerPrice ? ` (Offer: ₹${pkg.offerPrice?.toLocaleString('en-IN')})` : ''}
                  </option>
                ))
              ) : (
                <option value="" disabled>No packages available</option>
              )}
            </select>
            {formErrors.packageName && <span className="text-red-500 text-xs mt-1">{formErrors.packageName}</span>}
          </label>

          <label>
            <span className="block mb-1">Event Date <span className="text-red-500">*</span></span>
            <input
              type="date"
              value={bookingForm.eventDate}
              onChange={(e) => handleBookingInputChange('eventDate', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.eventDate ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {formErrors.eventDate && <span className="text-red-500 text-xs mt-1">{formErrors.eventDate}</span>}
          </label>

          <label>
            <span className="block mb-1">Booking Time</span>
            <input
              type="time"
              value={bookingForm.eventTime}
              onChange={(e) => handleBookingInputChange('eventTime', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label>
            <span className="block mb-1">Number of Guests <span className="text-red-500">*</span></span>
            <input
              type="number"
              value={bookingForm.guestCount}
              onChange={(e) => handleBookingInputChange('guestCount', e.target.value)}
              placeholder="e.g. 150"
              className={`w-full border rounded px-3 py-2 ${formErrors.guestCount ? 'border-red-500' : ''}`}
              min="0"
            />
            {formErrors.guestCount && <span className="text-red-500 text-xs mt-1">{formErrors.guestCount}</span>}
          </label>

          <label>
            <span className="block mb-1">Preferred Venue</span>
            <input
              type="text"
              value={bookingForm.venue}
              onChange={(e) => handleBookingInputChange('venue', e.target.value)}
              placeholder="Venue or City"
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label>
            <span className="block mb-1">Planned Amount (₹) <span className="text-red-500">*</span></span>
            <input
              type="number"
              value={bookingForm.plannedAmount}
              className={`w-full border rounded px-3 py-2 bg-gray-50 ${formErrors.plannedAmount ? 'border-red-500' : ''}`}
              readOnly
            />
            {formErrors.plannedAmount && <span className="text-red-500 text-xs mt-1">{formErrors.plannedAmount}</span>}
            {(() => {
              const selectedPackage = packages.find(pkg => pkg._id === bookingForm.packageName);
              if (selectedPackage?.offerPrice && selectedPackage.offerPrice < selectedPackage.price) {
                return (
                  <span className="text-green-600 text-xs mt-1 block">
                    Special offer price: ₹{selectedPackage.offerPrice.toLocaleString('en-IN')}
                  </span>
                );
              }
              return null;
            })()}
          </label>

          <label className="sm:col-span-2">
            <span className="block mb-1">Additional Notes</span>
            <textarea
              rows="3"
              value={bookingForm.notes}
              onChange={(e) => handleBookingInputChange('notes', e.target.value)}
              placeholder="Tell us more about your event..."
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="sm:col-span-2 w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isBookingLoading}
          >
            {isBookingLoading ? 'Sending Request...' : 'Book Now'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 mt-6 rounded">
        {['About', 'Reviews', 'FAQ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-medium ${activeTab === tab ? 'bg-white rounded m-1' : 'text-gray-500 hover:text-black'
              }`}
          >
            {tab === 'Reviews' ? 'Reviews' : tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left = tab content, Right = fixed form/info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">

        {/* Left side: Tabbed content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'About' && <PreviewProfileScreen />}
          {activeTab === 'Reviews' && <CustomerReviews />}
          {activeTab === 'FAQ' && <FaqQuestions />}
        </div>

        {/* Right side: Inquiry */}
        <div className="space-y-6  ">
          {/* Inquiry Form */}
          <div className="border rounded-lg p-4 shadow-sm bg-white sticky top-5">
            <h3 className="font-semibold text-lg mb-3">Send Inquiry</h3>
            <form className="space-y-3 text-sm" onSubmit={handleInquirySubmit}>
              <div>
                <label className="block mb-1">Your Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={inquiryForm.name} onChange={handleInquiryChange} className={`w-full border rounded px-3 py-2 ${inquiryErrors.name ? 'border-red-500' : ''}`} />
                {inquiryErrors.name && <span className="text-red-500 text-xs mt-1">{inquiryErrors.name}</span>}
              </div>
              <div>
                <label className="block mb-1">Your Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={inquiryForm.email} onChange={handleInquiryChange} className={`w-full  border rounded px-3 py-2 ${inquiryErrors.email ? 'border-red-500' : ''}`} />
                {inquiryErrors.email && <span className="text-red-500 text-xs mt-1">{inquiryErrors.email}</span>}
              </div>
              <div>
                <label className="block mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={inquiryForm.phone} onChange={handleInquiryChange} className={`w-full  border rounded px-3 py-2 ${inquiryErrors.phone ? 'border-red-500' : ''}`} />
                {inquiryErrors.phone && <span className="text-red-500 text-xs mt-1">{inquiryErrors.phone}</span>}
              </div>
              <div>
                {/* <label className="block mb-1">useId</label> */}
                <input type="hidden" value={userId} className="w-full border rounded px-3 py-2" />
              </div>
              <input type="hidden" name="vendorId" value={actualVendor?._id} />
              <div>
                <label className="block mb-1">Event Date <span className="text-red-500">*</span></label>
                
                <input
                  type="date"
                  name="eventDateRaw"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 

                    if (selectedDate < today) {
                      // alert("Please select Valid date.");
                      toast.error("Please select Valid date.");
                      return;
                    }

                    const [year, month, day] = e.target.value.split("-");
                    const formatted = `${day}/${month}/${year}`;
                    setInquiryForm(prev => ({
                      ...prev,
                      eventDate: formatted
                    }));
                  }}
                  className={`w-full border rounded px-3 py-2 ${inquiryErrors.eventDate ? 'border-red-500' : ''}`}
                />

                {inquiryErrors.eventDate && <span className="text-red-500 text-xs mt-1">{inquiryErrors.eventDate}</span>}
              </div>
              <div>
                <label className="block mb-1">Message <span className="text-red-500">*</span></label>
                <textarea name="message" rows="3" value={inquiryForm.message} onChange={handleInquiryChange} className={`w-full border rounded px-3 py-2 ${inquiryErrors.message ? 'border-red-500' : ''}`} />
                {inquiryErrors.message && <span className="text-red-500 text-xs mt-1">{inquiryErrors.message}</span>}
              </div>
              <button type="submit"
                disabled={inquiryLoading || userRecord?.user?.role === 'vendor'}
                className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-[#0f4c81]">
                {inquiryLoading ? 'Sending...' : 'Send Inquiry'}</button>
            </form>
          </div>
        </div>
      </div>
      {actualVendorId && <SimilarVendors vendorType={vendorData?.vendor?.vendorType || actualVendor?.vendorType} currentVendorId={actualVendorId} />}
      {selectedImage && <ImageViewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {selectedVideo && <VideoViewModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default PreviewProfile;
