"use client"

import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera, Video, Music, Utensils, Gift, Activity, Smile, Cake, Sparkles, Tent
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetAllVendorsQuery } from '@/features/admin/adminAPI';
import { useGetVendorsReviewStatsQuery } from '@/features/reviews/reviewAPI';
import { BiSolidFlorist, BiSolidParty } from "react-icons/bi";
import { SiPioneerdj } from "react-icons/si";
import { BsCake2 } from "react-icons/bs";
import { MdInsertInvitation, MdEmojiTransportation, MdAddAPhoto } from "react-icons/md";
import { FaStar } from "react-icons/fa";

// Vendor Components
import WeddingPhotographers from './Photographers';
import MakeupArtists from './MakeupArtists';
import MehndiArtists from './MehndiArtists';
import Caterers from './Caterers';
import WeddingDecorators from './Decorators';
import WeddingMakeUp from './WeddingMakeUp';
import WeddingPlanners from './Planners';
import PartyPlaces from './PartyPlaces';
import Choreographers from './Choreographers';
import Photobooth from './Photobooth';
import Cakes from './Cakes';
import DJ from './DJ';
import TentHouse from './TentHouse';
import Transportation from './Transportation';
import Videography from './Videography';
import Florist from './Florists';
import Gifts from './Gifts';
import Invitation from './Invitations';
import Musics from './Music';

// Primary Vendors
const vendorCategories = [
  { title: 'Photographers', icon: Camera },
  { title: 'Makeup Artists', icon: Sparkles },
  { title: 'Mehndi Artists', icon: Activity },
  { title: 'Bands', icon: Music },
  { title: 'Cake Vendors', icon: BsCake2 },
  { title: 'Caterers', icon: Utensils },
  { title: 'Florists', icon: BiSolidFlorist },
  { title: 'Decorators', icon: Gift },
  { title: 'Bridal Wear', icon: Sparkles },
  { title: 'Jewellers', icon: Sparkles },
  { title: 'Groom Wear', icon: Activity },
];

// Additional Services (filtered to exclude primary)
const rawAdditionalServices = [
  { title: 'Choreographers', icon: Activity },
  { title: 'Event Planners', icon: Utensils },
  { title: 'DJs', icon: SiPioneerdj },
  { title: 'Magicians', icon: Smile },
  { title: 'Gift Providers', icon: Gift },
  { title: 'Tent House Services', icon: Tent },
  { title: 'Entertainers', icon: Smile },
  { title: 'Wedding Planners', icon: Utensils },
  { title: 'Wedding Photographers', icon: Camera },
  { title: 'Astrologers', icon: Sparkles },
];

// Remove any categories already in Primary Vendors
const additionalServices = rawAdditionalServices.filter(
  add => !vendorCategories.some(primary => primary.title === add.title)
);

// Category to Component mapping
const categoryComponents = {
  'Photographers': <WeddingPhotographers />,
  'Makeup Artists': <MakeupArtists />,
  'Mehndi Artists': <MehndiArtists />,
  'Bands': <Musics />,
  'Cake Vendors': <Cakes />,
  'Caterers': <Caterers />,
  'Florists': <Florist />,
  'Decorators': <WeddingDecorators />,
  'Bridal Wear': <Gifts />,
  'Jewellers': <Gifts />,
  'Groom Wear': <Gifts />,
  'Choreographers': <Choreographers />,
  'Event Planners': <WeddingPlanners />,
  'DJs': <DJ />,
  'Magicians': <PartyPlaces />,
  'Gift Providers': <Gifts />,
  'Tent House Services': <TentHouse />,
  'Entertainers': <PartyPlaces />,
  'Wedding Planners': <WeddingPlanners />,
  'Wedding Photographers': <WeddingPhotographers />,
  'Astrologers': <PartyPlaces />,
};

export default function WeddingVendor({ params }) {
  const [activeTab, setActiveTab] = useState('primary');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category');

  const { data, isLoading, isError, error } = useGetAllVendorsQuery(undefined, {
    // Add caching and refetch options to improve performance
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const filteredCategories = useMemo(() => {
    const categories = activeTab === 'primary' ? vendorCategories : additionalServices;
    return searchTerm
      ? categories.filter(({ title }) =>
          title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : categories;
  }, [searchTerm, activeTab]);

  const filteredVendors = useMemo(() => {
    if (!data || !data.vendors) return [];
    return data.vendors.filter(v =>
      filteredCategories.some(cat => cat.title === v.vendorType)
    );
  }, [data, filteredCategories]);

  const vendorIds = useMemo(() => filteredVendors.map(v => v._id), [filteredVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { 
    skip: !vendorIds.length,
    // Add caching for review stats
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (vendorCategories.some(cat => cat.title === initialCategory)) {
        setActiveTab('primary');
      } else if (additionalServices.some(cat => cat.title === initialCategory)) {
        setActiveTab('additional');
      }
    }
  }, [initialCategory]);

  const handleCategoryClick = (category) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    router.push(`/vendors/all/${categorySlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error: {error?.data?.message || error?.message || 'Failed to fetch vendors.'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative font-serif">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A2A3A] font-playfair">
            Find the Perfect Vendors
          </h1>
          <p className="mb-8 text-base md:text-lg">
            Connect with trusted professionals for your special event
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-full max-w-2xl bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="py-4 bg-gray-50">
        <div className="w-full p-5">
          <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
            Start Hiring Your Vendors
          </h2>

          {/* Tab buttons */}
          <div className="flex justify-center mt-4 mb-8">
            <div className="inline-flex bg-gray-200 rounded-md overflow-hidden p-1">
              <button
                onClick={() => {
                  setActiveTab('primary');
                  setSelectedCategory(null);
                  setSearchTerm('');
                }}
                className={`px-3 py-2 text-sm font-medium transition ${activeTab === 'primary'
                  ? 'bg-white text-gray-700 border border-gray-300'
                  : 'bg-corporate-primary text-black'
                  }`}
              >
                Primary Vendors
              </button>
              <button
                onClick={() => {
                  setActiveTab('additional');
                  setSelectedCategory(null);
                  setSearchTerm('');
                }}
                className={`px-3 py-2 text-sm font-medium transition ${activeTab === 'additional'
                  ? 'bg-white text-gray-700 border border-gray-300'
                  : 'bg-corporate-primary text-black'
                  }`}
              >
                Additional Services
              </button>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 py-2 lg:ml-10">
            {isLoading ? (
              // Show skeleton loading for categories
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center rounded bg-white py-2 w-full animate-pulse">
                  <div className="flex items-center justify-center mr-2 px-3 py-2">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map(({ title, icon: Icon }, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(title)}
                  className={`flex items-center rounded transition group bg-white py-2 w-full ${selectedCategory === title
                    ? 'border-2 border-[#0f4c81]'
                    : 'border border-transparent'
                    } hover:border-[#0f4c81]`}
                >
                  <div className="flex items-center justify-center mr-2 px-3 py-2">
                    <Icon className="w-9 h-9 text-black bg-gray-100 px-2 rounded-full" />
                  </div>
                  <span className="font-medium text-gray-800">{title}</span>
                </button>
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500">
                No categories found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Component View */}
      {selectedCategory && (
        <div className="p-2 lg:mx-20 lg:mt-15">
          <div className="grid grid-cols-[1fr_auto] items-start mb-6 gap-4">
            <h3 className="text-xl font-bold break-words">{selectedCategory}</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="border text-sm text-gray-700 px-3 py-2 rounded hover:bg-[#DEBF78] transition whitespace-nowrap"
            >
              Back to Categories
            </button>
          </div>

          {categoryComponents[selectedCategory] || <p>No component available.</p>}
        </div>
      )}
    </div>
  );
}
