"use client"

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { useGetAllPublicVendorsQuery } from '@/features/vendors/vendorAPI';
import Loader from '@/components/shared/Loader';

<<<<<<< HEAD
// Keep All India as default option
const defaultLocations = ["All India"];
=======
// Keep All as default option
const defaultLocations = ["All"];
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90

const BrowseVenues = ({ onLocationSelect, currentLocation, searchTerm = "" }) => {
  const router = useRouter();
  const { city: urlCity } = useParams();
<<<<<<< HEAD
  const [activeLocation, setActiveLocation] = useState("All India");
=======
  const [activeLocation, setActiveLocation] = useState("All");
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  // Fetch vendors data to get locations
  const { data: vendorsData, isLoading } = useGetAllPublicVendorsQuery();
  
  // Combine default locations with vendor locations
  const allLocations = [...defaultLocations, ...(vendorsData?.locations || [])];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setVisibleCount(width < 768 ? 1 : width < 1024 ? 3 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fromURL = urlCity
      ? urlCity.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')
      : null;
    const fromProp = currentLocation;

<<<<<<< HEAD
    const locationToSet = fromURL || fromProp || "All India";
=======
    const locationToSet = fromURL || fromProp || "All";
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
    const finalLocation = locationToSet.split(',')[0];
    setActiveLocation(finalLocation);
    
    // Notify parent component about the active location

    onLocationSelect?.(finalLocation);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLocation, urlCity, onLocationSelect]);

  const handleLocationClick = (city) => {

    setActiveLocation(city);
    onLocationSelect?.(city);
    router.push(`/venue/${city.replace(/\s+/g, '-').toLowerCase()}`);
  };

  const filteredLocations = allLocations.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrev = () => {
    setScrollIndex((prev) =>
      prev === 0 ? filteredLocations.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setScrollIndex((prev) =>
      prev >= filteredLocations.length - visibleCount ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <div className="w-full my-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full my-6 lg:px-20">
      <h5 className="text-xl font-semibold mb-4 text-center font-playfair">
        Browse Venues by Location
      </h5>

      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${(filteredLocations.length / visibleCount) * 100}%`,
            transform: `translateX(-${(scrollIndex * 100) / filteredLocations.length}%)`,
          }}
        >
          {filteredLocations.map((location) => {
            const city = location.split(',')[0];
            return (
              <div
                key={location}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / filteredLocations.length}%` }}
              >
                <button
                  onClick={() => handleLocationClick(city)}
                  className={`w-full flex items-center justify-center py-4 text-sm font-medium transition-colors duration-200 border rounded
                  ${city === activeLocation
                      ? 'bg-[#0f4c81] text-white'
                      : 'hover:bg-[#f3f3f3] text-gray-700 hover:text-gray-900'
                    }`}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {city}
                </button>
              </div>
            )
          })}
        </div>

        {filteredLocations.length > visibleCount && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Scroll left"
              style={{ borderRadius: '25px' }}
              className="group absolute left-5 top-1/2 -translate-y-1/2 bg-white text-gray-600 border p-2 shadow-md hover:bg-yellow-100 transition"
            >
              <IoIosArrowRoundBack className="text-2xl  transition" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Scroll right"
              style={{ borderRadius: '25px' }}
              className="group absolute right-5 top-1/2 -translate-y-1/2 bg-white text-gray-600 border p-2 shadow-md hover:bg-yellow-100 transition"
            >
              <IoIosArrowRoundForward className="text-2xl  transition" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseVenues;
