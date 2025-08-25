"use client"

import React, { useState, useEffect } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiTrendingUp, FiCalendar } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import EditProfiles from './EditProfiles';
import PortfolioTab from './Portfolio';
import PackagesAndFaqs from './PackagesAndFaqs';
import Inquiries from './Inquiries/Inquiries';
import ReviewSection from './Reviews';
import Bookings from './Bookings';
import VendorPreviewProfile from "./PreviewProfile/VendorPreviewProfile";
import EventModal from '@/components/EventModal';

import { useSelector, useDispatch } from 'react-redux';
import { FaAngleLeft, FaChevronRight } from "react-icons/fa6";
<<<<<<< HEAD
=======
import { FaEdit, FaTrash } from "react-icons/fa";
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
import { useGetVendorByIdQuery, useUserInquiryListQuery, useGetVendorBookingsListQuery } from '@/features/vendors/vendorAPI';
import { useGetVendorEventsQuery, useDeleteEventMutation, useGetUpcomingEventsQuery } from '@/features/events/eventAPI';

import { toast } from 'react-toastify';
import { setVendorCredentials } from '@/features/vendors/vendorSlice';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
=======
import { useNavigate, useSearchParams } from 'next/navigation';
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
<<<<<<< HEAD
  const searchParams = useSearchParams();
=======
  const [searchParams] = useSearchParams();
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  const [isAdminEdit, setIsAdminEdit] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerForWedding, setShowDatePickerForWedding] = useState(null);
  const [eventName, setEventName] = useState('');
  const [selectedDateForEvent, setSelectedDateForEvent] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab') || 'Overview';
    return savedTab;
  });
   const vendorId = vendor?._id || vendor?.id;

  const { data: vendorData, isLoading: isVendorLoading, error: vendorError } = useGetVendorByIdQuery(vendorId, {
    skip: !vendorId || vendorId === 'undefined'
  });

  // Get events for the current month
  const currentDate = new Date();
  const { data: eventsData, isLoading: isEventsLoading, refetch: refetchEvents } = useGetVendorEventsQuery({
    vendorId,
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear()
  });

  // Get upcoming events
  const { data: upcomingEventsData, isLoading: isUpcomingEventsLoading } = useGetUpcomingEventsQuery({
    vendorId,
    limit: 10
  });

  const [deleteEvent] = useDeleteEventMutation();
  


  // Get vendor inquiries for recent activity
  const { data: inquiriesData, isLoading: isInquiriesLoading } = useUserInquiryListQuery(vendorId, {
    skip: !vendorId,
    refetchOnMountOrArgChange: true
  });

  // Get vendor bookings for analytics
  const { data: bookingsData, isLoading: isBookingsLoading } = useGetVendorBookingsListQuery(vendorId);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  // Handle admin edit mode
  useEffect(() => {
    const adminEditId = searchParams.get('adminEdit');
    const adminEditData = localStorage.getItem('adminEditingVendor');
    
    if (adminEditId && adminEditData) {
      try {
        const editData = JSON.parse(adminEditData);
        if (editData.isAdminEdit && editData.vendor) {
          // Set up vendor data for admin editing
          dispatch(setVendorCredentials({
            vendor: editData.vendor,
            token: localStorage.getItem('adminToken') || localStorage.getItem('token'),
            isAuthenticated: true
          }));
          setIsAdminEdit(true);
        }
<<<<<<< HEAD
      } catch {
        console.error('Error parsing admin edit data');
=======
      } catch (error) {
        console.error('Error parsing admin edit data:', error);
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      }
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Tab change handler
  }, [activeTab, vendor, isAuthenticated, vendorId]);

<<<<<<< HEAD
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('activeTab');
    }
  }, [isAuthenticated]);

=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  if (!isAuthenticated && !isAdminEdit) {
    return <h3 className='text-red-600 font-bold m-5'>You are not logged in.</h3>;
  }

  const tabs = ['Overview', 'Bookings', 'Profile', 'Portfolio', 'Packages & FAQs', 'Inquiries', 'Reviews'];

<<<<<<< HEAD
=======
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('activeTab');
    }
  }, [isAuthenticated]);

>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  const handleDateSelect = (date, name) => {
    setSelectedDateForEvent(date);
    setShowEventModal(true);
    setShowDatePicker(false);
  };

  const handleWeddingDateSelect = (index, date, weddingName) => {
    setSelectedDateForEvent(date);
    setShowEventModal(true);
    setShowDatePickerForWedding(null);
  };

  const handleCalendarClick = (date) => {
    setSelectedDateForEvent(date);
    setSelectedEvent(null); // Ensure no previous event is selected
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent({ vendorId, eventId }).unwrap();
        toast.success('Event deleted successfully');
        refetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && eventsData?.events) {
      const event = eventsData.events.find(e => 
        new Date(e.eventDate).toDateString() === date.toDateString()
      );
      // Show light green background for any date that has an event created
      return event ? 'bg-green-100 relative group cursor-pointer' : 'cursor-pointer';
    }
    return 'cursor-pointer';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && eventsData?.events) {
      const event = eventsData.events.find(e => 
        new Date(e.eventDate).toDateString() === date.toDateString()
      );
      return event ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="group relative">
            <span className="text-red-600 text-xs font-bold">●</span>
            <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 mb-1">
              {event.eventName}
            </div>
          </div>
        </div>
      ) : null;
    }
    return null;
  };

  // Calculate analytics data
  const calculateAnalytics = () => {
    const currentYear = new Date().getFullYear();
    const totalBookings = bookingsData?.data?.totalBookingsCount ?? 0;
    const avgRating = 4.8; // This could be dynamic if you have rating data

    // Calculate yearly inquiries
    const totalInquiriesYearly = inquiriesData?.modifiedList?.filter((inq) => {
      const inqYear = new Date(inq.createdAt).getFullYear();
      return inqYear === currentYear;
    }).length || 0;

    // Calculate yearly bookings
    const totalBookingsYearly = bookingsData?.data?.bookings?.filter((bk) => {
      const bookingYear = new Date(bk.createdAt).getFullYear();
      return bookingYear === currentYear;
    }).length || 0;

    return [
      {
        label: 'Profile Views',
        value: '1,250',
        change: '+15%',
        icon: <FiTrendingUp size={24} className="text-[#0f4c81]" />,
        percent: 75,
        color: 'bg-blue-500'
      },
      {
        label: 'Inquiries',
        value: inquiriesData?.modifiedList?.length || 0,
        change: '+8%',
        icon: <FiMessageSquare size={24} className="text-[#0f4c81]" />,
        percent: Math.min((totalInquiriesYearly / 100) * 100, 100),
        color: 'bg-green-500'
      },
      {
        label: 'Booking Rate',
        value: totalBookings > 0 ? `${Math.round((totalBookings / (inquiriesData?.modifiedList?.length || 1)) * 100)}%` : '0%',
        change: '+5%',
        icon: <FiCalendar size={24} className="text-[#0f4c81]" />,
        percent: totalBookings > 0 ? Math.min((totalBookings / 100) * 100, 100) : 5,
        color: 'bg-purple-500'
      },
      {
        label: 'Review Score',
        value: avgRating.toString(),
        change: '+0.2',
        icon: <FaRegStar size={24} className="text-[#0f4c81]" />,
        percent: (avgRating / 5) * 100,
        color: 'bg-yellow-500'
      },
    ];
  };

  const analyticsData = calculateAnalytics();

  // Format recent activities from real data
  const formatRecentActivities = () => {
    const activities = [];
    
    // Add recent inquiries
    if (inquiriesData?.modifiedList) {
      inquiriesData.modifiedList.slice(0, 5).forEach((inquiry) => {
        const latestMessage = inquiry.userMessage?.[inquiry.userMessage.length - 1];
        if (latestMessage) {
          activities.push({
            id: inquiry._id,
            name: inquiry.name || 'Anonymous User',
            date: new Date(inquiry.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            message: latestMessage.message || 'No message content',
            status: inquiry.replyStatus || 'Pending',
            statusColor: inquiry.replyStatus === 'Replied' ? 'text-green-600' : 'text-yellow-600',
            type: 'inquiry',
            timeAgo: getTimeAgo(inquiry.createdAt)
          });
        }
      });
    }

    // Sort by date (most recent first)
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Helper function to get time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Get formatted activities
  const recentActivities = formatRecentActivities();

  // Format services for display
  const formatServices = (services) => {
    if (!services) return '';
    if (Array.isArray(services)) {
      return services.join(', ');
    }
    return services;
  };

  return (
    <div className="p-2 sm:p-6 bg-white min-h-screen text-gray-800 font-serif">
      {/* Admin Edit Mode Banner */}
      {isAdminEdit && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4 rounded">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-orange-700">
                <h4 className="font-bold">Admin Edit Mode</h4>
                <p className="text-sm">You are editing {vendor?.businessName || 'this vendor'} as an administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminEditingVendor');
                router.push('/admin/vendor_management');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Exit Admin Mode
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-2 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-serif">
              {vendor?.businessName || 'DSY'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-serif">
              {vendor?.vendorType || vendor?.venueType || 'Banquet Halls'} • {
                (() => {
                  // If address field contains full address, use it directly
                  if (vendor?.address && typeof vendor.address === 'string' && vendor.address.includes(',')) {
                    return vendor.address;
                  }
                  
                  // Otherwise build from individual fields
                  const parts = [];
                  if (vendor?.address && typeof vendor.address === 'string') parts.push(vendor.address);
                  if (vendor?.city) parts.push(vendor.city);
                  if (vendor?.state) parts.push(vendor.state);
                  if (vendor?.pinCode) parts.push(vendor.pinCode);
                  
                  return parts.length > 0 ? parts.join(', ') : 'Address not provided';
                })()
              }
            </p>
            {/* Display services */}
            <div className="flex flex-wrap gap-2 mt-1">
              {vendorData?.vendor?.services?.[0]
                ?.split(',')
                .map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs sm:text-sm bg-sky-100 text-gray-700 rounded-md border border-gray-300 font-serif"
                  >
                    {service.trim()}
                  </span>
                )) || (
                  <span className="text-xs text-gray-500 font-serif">{vendor?.vendorType || "no more services"}</span>
                )}
            </div>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="text-black text-xs sm:text-sm font-medium font-serif">
                Profile Status
              </span>
              <span className="text-green-700 font-bold text-xs sm:text-sm font-serif">
                {vendor?.status || 'InActive'}
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0f4c81] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-md sm:text-sm w-full sm:w-auto text-center">
              Preview Profile
            </button>
          </div>
        </div>
      </div>

      <div className="relative bg-[#f5f8fb] p-1 sm:p-2 rounded-md mb-6 overflow-hidden">
        {/* Scroll Left Button */}
        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: -tabWidth * 3, behavior: 'smooth' });
            }
          }}
          style={{borderRadius:'25px'}}
          className="absolute lg:hidden left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600 rounded-full"
        >
          <FaAngleLeft size={14} />
        </button>

        {/* Tabs container */}
        <div id="tabs-container" className="flex overflow-x-auto scrollbar-hide gap-3 ">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(tab)}
              style={{borderRadius:'5px'}}
              className={`whitespace-nowrap p-1 rounded-full text-sm font-medium transition duration-200 ${activeTab === tab
                  ? 'bg-white text-[#0f4c81] shadow'
                  : 'text-gray-700 hover:bg-white/60'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: tabWidth * 3, behavior: 'smooth' });
            }
          }}
          style={{borderRadius:'25px'}}
          className="absolute lg:hidden right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600 rounded-full"
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeTab === 'Overview' && (
          <>

            {/* Performance Overview */}
            <div className="col-span-2 bg-gray-50 p-3 sm:p-4 rounded border">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Performance Overview</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Your profile performance in the last 30 days</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {analyticsData.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 sm:p-4 rounded shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm sm:text-base font-medium text-gray-600">
                        {item.label}
                      </div>
                      <div>{item.icon}</div>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                      {item.value}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 mb-2">
                      {item.change}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar Section */}
              <div className="bg-white p-3 sm:p-4 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm sm:text-base font-medium">Monthly Profile Views</p>
                  <button
                    /* Removed onClick handler */
                    className="relative text-[#0f4c81] flex items-center gap-1 text-sm sm:text-base font-medium hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors group"
                    /* Tooltip on hover */
                    type="button"
                  >
                    <MdOutlineCalendarMonth size={20} className="sm:w-5 sm:h-5" /> Add Event
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                      Choose the date of event
                    </span>
                  </button>
                </div>

                {showDatePicker && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter event name"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>
                      <DatePicker
                        selected={selectedDateForEvent}
                        onChange={(date) => setSelectedDateForEvent(date)}
                        inline
                        className="w-full"
                      />
                      <div className="flex justify-end gap-3 mt-4">
                        <button 
                          onClick={() => {
                            setShowDatePicker(false);
                            setEventName('');
                            setSelectedDateForEvent(null);
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (eventName && selectedDateForEvent) {
                              setShowEventModal(true);
                              setShowDatePicker(false);
                            }
                          }}
                          className="px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0d3f6a] transition-colors"
                          disabled={!eventName || !selectedDateForEvent}
                        >
                          Add Event
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 w-full calendar-container">
                  <Calendar
                    className="w-full border-none"
                    value={new Date()}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    onClickDay={handleCalendarClick}
                    style={{ width: '100%', maxWidth: 'none' }}
                    selectRange={false}
                    maxDetail="month"
                    minDetail="month"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 p-2 sm:p-4 rounded border">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Recent Activity</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">Latest inquiries and reviews</p>

              {isInquiriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading activities...</span>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  {recentActivities.map((activity, idx) => (
                    <div key={activity.id || idx} className="relative pl-6 sm:pl-8">
                      <FiMessageSquare className="absolute top-1 left-0 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.name}</p>
                          <p className="text-xs text-gray-400 mb-1">{activity.timeAgo}</p>
                          <p className="mb-1 text-gray-700 line-clamp-2">{activity.message}</p>
                          {activity.status && (
                            <span className={`${activity.statusColor} text-xs font-medium`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <hr className="mt-3 border-gray-200" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FiMessageSquare className="mx-auto text-gray-300 w-8 h-8 mb-2" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1">New inquiries and reviews will appear here</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <div className="lg:col-span-3 w-full">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              {!vendorId ? (
                <div className="p-4 text-center">
                  <p className="text-red-600">Error: Vendor ID not found. Please try logging in again.</p>
                </div>
              ) : (
                <EditProfiles />
              )}
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'Bookings' && (
          <div className="lg:col-span-3 -mt-4">
            <Bookings />
          </div>
        )}
        {activeTab === 'Portfolio' && (
          <div className="lg:col-span-3 -mt-4">
            <PortfolioTab />
          </div>
        )}
        {activeTab === 'Packages & FAQs' && (
          <div className="lg:col-span-3 -mt-4">
            <PackagesAndFaqs />
          </div>
        )}
        {activeTab === 'Inquiries' && (
          <div className="lg:col-span-3 -mt-4">
            <Inquiries />
          </div>
        )}
        {activeTab === 'Reviews' && (
          <div className="lg:col-span-3 -mt-4">
            <ReviewSection />
          </div>
        )}
      </div>

      {/* Upcoming Weddings Section */}
      {activeTab === 'Overview' && (
        <div className="col-span-2 bg-white p-2 sm:p-4 rounded border mt-4 sm:mt-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Upcoming Events</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">Your Scheduled Events</p>

          {isUpcomingEventsLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading upcoming events...</p>
            </div>
          ) : upcomingEventsData?.events && upcomingEventsData.events.length > 0 ? (
            upcomingEventsData.events.map((event, index) => (
              <div key={event._id} className="border p-2 rounded mb-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                {/* Event Header - Compact */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-gray-600">
                      <MdOutlineCalendarMonth size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{event.eventName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {event.eventType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                      title="Edit Event"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                      title="Delete Event"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Event Details - Compact Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2">
                  {/* Date */}
                  <div className="bg-white p-1.5 rounded border">
                    <p className="text-xs text-gray-500 mb-0.5">📅 Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(event.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.eventDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>

                  {/* Client */}
                  {event.clientName && (
                    <div className="bg-white p-1.5 rounded border">
                      <p className="text-xs text-gray-500 mb-0.5">👤 Client</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{event.clientName}</p>
                      {event.clientPhone && (
                        <p className="text-xs text-gray-500 truncate">{event.clientPhone}</p>
                      )}
                    </div>
                  )}

                  {/* Venue */}
                  {event.venue && (
                    <div className="bg-white p-1.5 rounded border">
                      <p className="text-xs text-gray-500 mb-0.5">📍 Venue</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{event.venue}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="bg-white p-1.5 rounded border">
                    <p className="text-xs text-gray-500 mb-0.5">📊 Details</p>
                    <div className="space-y-0.5">
                      {event.guestCount && (
                        <p className="text-xs text-gray-800">👥 {event.guestCount} guests</p>
                      )}
                      {event.budget && (
                        <p className="text-xs text-green-600 font-medium">₹{event.budget.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-blue-600 font-medium">
                        {Math.ceil((new Date(event.eventDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description and Notes - Improved */}
                {(event.description || event.notes) && (
                  <div className="bg-white p-2 rounded border">
                    {event.description && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <span className="mr-1">📝</span> Description
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    )}
                    {event.notes && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <span className="mr-1">📋</span> Notes
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {event.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                <MdOutlineCalendarMonth size={32} className="mx-auto" />
              </div>
              <p className="text-gray-500 font-medium">No upcoming events found</p>
              <p className="text-xs text-gray-400 mt-1">Click on any date in the calendar to add an event.</p>
            </div>
          )}
        </div>
      )}

      <VendorPreviewProfile show={showModal} onClose={() => setShowModal(false)} />
      
      {/* Event Modal */}
      <EventModal
        show={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
          setSelectedDateForEvent(null);
        }}
        event={selectedEvent}
        vendorId={vendorId}
        selectedDate={selectedDateForEvent}
      />
    </div>
  );
};

export default Dashboard;
