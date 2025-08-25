"use client"

import React from 'react';
import {
  FaBirthdayCake,
  FaMagic,
  FaPaintBrush,
  FaClipboardList,
  FaRegBuilding,
  FaHotel,
  FaUmbrellaBeach,
  FaTree,
  FaCamera,
  FaGlassCheers,
  FaHome,
  FaLandmark
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useGetAllPublicVendorsQuery } from '@/features/vendors/vendorAPI';

// Helper function to get icon by venue category title
const getCategoryIcon = (title) => {
  switch (title) {
    case 'Art Gallery':
      return <FaPaintBrush size={24} />;
    case 'Amusement Park':
      return <FaMagic size={24} />;
    case 'Auditorium':
      return <FaLandmark size={24} />;
    case 'Banquet Halls':
      return <FaRegBuilding size={24} />;
    case 'Bars':
    case 'Clubs':
    case 'Pubs':
      return <FaGlassCheers size={24} />;
    case 'Pool Side':
      return <FaUmbrellaBeach size={24} />;
    case 'Conference Rooms':
    case 'Meeting Rooms':
    case 'Training Rooms':
      return <FaClipboardList size={24} />;
    case 'Farm Houses':
      return <FaHome size={24} />;
    case 'Hotels':
    case '5 Star Hotel':
    case 'Wedding Hotels':
      return <FaHotel size={24} />;
    case 'Party Lawn':
    case 'Marriage Lawn':
      return <FaTree size={24} />;
    case 'Resort':
    case 'Wedding Resort':
      return <FaUmbrellaBeach size={24} />;
    case 'Restaurants':
    case 'Cafes':
      return <FaBirthdayCake size={24} />;
    case 'Seminar Halls':
      return <FaRegBuilding size={24} />;
    case 'Theater':
      return <FaLandmark size={24} />;
    case 'Unique Venues':
      return <FaMagic size={24} />;
    case 'Roof Top':
      return <FaRegBuilding size={24} />;
    case 'Gaming Zone':
    case 'Kids Play Area':
      return <FaMagic size={24} />;
    case 'Villas':
    case 'Vacation Homes':
    case 'Guest Houses':
      return <FaHome size={24} />;
    case 'Boat Yatch':
      return <FaUmbrellaBeach size={24} />;
    case 'Co-working Spaces':
    case 'Business Centres':
      return <FaRegBuilding size={24} />;
    case 'Marriage Garden':
      return <FaTree size={24} />;
    default:
      return <FaRegBuilding size={24} />;
  }
};

const VendorByCategory = ({ location = "All" }) => {
  const router = useRouter();
  
  // Fetch all vendors from Redux
  const { data: vendorsData, isLoading } = useGetAllPublicVendorsQuery();

  // Define all venue categories - exact match from database
  const categoryTitles = [
    'Art Gallery',
    'Amusement Park',
    'Auditorium',
    'Banquet halls',
    'Bars',
    'Clubs',
    'Pool Side',
    'Conference Rooms',
    'Farm Houses',
    'Hotels',
    'Party lawn',
    'Resort',
    'Restaurants',
    'Seminar Halls',
    'Theater',
    'Unique Venues',
    'Roof Top',
    'Gaming Zone',
    'Villas',
    'Pubs',
    'Meeting Rooms',
    'Boat Yatch',
    'Vacation Homes',
    'Cafes',
    'Co-working spaces',
    'Business Centres',
    'Guest Houses',
    '5 Star Hotel',
    'Marriage Garden',
    'Wedding Hotels',
    'Marriage Lawn',
    'Wedding Resort',
    'Training Rooms',
    'Kids Play Area'
  ];

  // Calculate counts for each category
  const getCategoryCounts = () => {
    if (!vendorsData?.vendors && !vendorsData?.data) return {};
    
    const vendors = vendorsData.vendors || vendorsData.data || [];
    const counts = {};
    
    categoryTitles.forEach(category => {
      // Filter vendors by category and location
      const filteredVendors = vendors.filter(vendor => {
        // Check venue type matching based on businessType (exact match)
        const matchesCategory = 
          vendor.businessType === 'venue' && vendor.venueType === category;
        
        // Location matching based on actual model fields
        const matchesLocation = location === "All" || 
          (vendor.city && vendor.city.toLowerCase().includes(location.toLowerCase())) ||
          (vendor.state && vendor.state.toLowerCase().includes(location.toLowerCase())) ||
          (vendor.address && vendor.address.toLowerCase().includes(location.toLowerCase())) ||
          (vendor.nearLocation && vendor.nearLocation.toLowerCase().includes(location.toLowerCase()));
        
        return matchesCategory && matchesLocation;
      });
      counts[category] = filteredVendors.length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Create array of category objects with icon and count
  const categories = categoryTitles.map(title => ({
    title,
    count: categoryCounts[title] || 0,
    icon: getCategoryIcon(title),
  }));

  // Update the handleCategoryClick function
  const handleCategoryClick = (title) => {
    // Convert location and category to URL-friendly format
    const locationSlug = location.toLowerCase().replace(/\s+/g, '-');
    const categorySlug = title.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to the vendor list page
    // router.push(`/venue/${locationSlug}/${categorySlug}`);
    router.push(`/venue/${locationSlug}/${categorySlug}`);
  };

  return (
    <div className="bg-[#F9FAFB] py-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="w-full mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-3">
            Find Venues in {location}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover the best wedding and corporate event venues in {location}.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:mx-16">
          {categories.map(({ title, count, icon }, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(title)}
              style={{ borderRadius: '10px' }}
              className="bg-white border border-gray-200 shadow-sm px-3 py-4 sm:px-4 sm:py-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group w-full"
              type="button"
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-gray-800">
                {icon}
              </div>
              <h6 className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold text-black font-serif group-hover:text-pink-600 transition-colors">
                {title}
              </h6>
              <p className="text-xs sm:text-sm text-gray-500">
                {isLoading ? "Loading..." : `${count} Venues`}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorByCategory;
