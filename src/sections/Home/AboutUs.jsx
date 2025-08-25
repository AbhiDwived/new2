"use client"

import React, { useState } from 'react'

import { IoLocationOutline } from "react-icons/io5";
import Link from 'next/link';
import { FaSearch } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
<<<<<<< HEAD
import { FaCommentDots } from 'react-icons/fa';
=======
import { FaCheckCircle, FaUsers, FaCommentDots } from 'react-icons/fa';
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
import { FiCheckCircle } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { FiMapPin } from 'react-icons/fi';



const AboutUs = () => {

<<<<<<< HEAD
  const [selectedCity, setSelectedCity] = useState("All India");
=======
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All ");
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
  const features = [
    {
      title: "Verified Vendors",
      description: "Over 1200+ verified vendors and 100+ hotel tie-ups across India.",
      icon: <FiCheckCircle size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
    {
      title: "Owned Hotels",
      description: "6+ owned hotels and expanding rapidly across India.",
      icon: <BiBuildings size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
    {
      title: "Complete Support",
      description: "From venue search to final booking, we provide comprehensive assistance.",
      icon: <FaCommentDots size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
  ];

  const venueTypes = [
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Banquet Halls",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Hotels",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Farmhouses",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Resorts",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Event Spaces",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Corporate Venues",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Wedding Venues",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Private Function Spaces",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Destination Venues",
    },
  ];

  const popularCities = [
    { title: "Delhi", icon: <FiMapPin className="text-white text-sm sm:text-xl" /> },
    { title: "Noida", icon: <FiMapPin className="text-white text-md sm:text-xl" /> },
    { title: "Gurgaon", icon: <FiMapPin className="text-white text-md sm:text-xl" /> },
    { title: "Greater Noida", icon: <FiMapPin className="text-white text-md sm:text-xl" /> },
    { title: "Ghaziabad", icon: <FiMapPin className="text-white text-md sm:text-xl" /> },
    { title: "Kasna", icon: <FiMapPin className="text-white text-md sm:text-xl" /> },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] text-white py-16 text-center px-4 font-serif">
        <div className="inline-block bg-white/10 text-sm text-white px-4 py-1 rounded-full mb-6">
          <span className="inline-block align-middle"><IoLocationOutline color='white' size={20} /></span> India's Premier Venue Discovery Platform
        </div>

        <p className="text-4xl font-bold mb-4">
<<<<<<< HEAD
          My Best Venue &ndash;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            DSY Group&apos;s Flagship Venture
=======
          My Best Venue –{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            DSY Group's Flagship Venture
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
          </span>
        </p>

        <p className="max-w-2xl mx-auto text-lg text-white/90">
          A digital-first platform helping individuals and corporates find, evaluate, and book the ideal venue for their special occasions.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8 px-4 font-serif">
          <Link
            href="/venue"
<<<<<<< HEAD
=======
            href="/venue"
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-[#0f4c81e7] transition sm:px-3 sm:py-2 text-sm sm:text-base"
            style={{ textDecoration: 'none', color: '#364153' }}
          >
            <FaSearch size={20} className="mr-2" />
            Search Venues
          </Link>

          {/* <button
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded hover:bg-[#0f4c81e7] transition sm:px-3 sm:py-2 text-sm sm:text-base hover:cursor-default"
          >
            <a
        href="tel:+919990555740"
        className=" text-white p-3 rounded-full shadow-lg transition duration-200"
        title="Call Now"
      ></a>
            <FaPhoneVolume size={20} className="mr-2" />
            {/* Get Expert Help */}
          {/* +91-9990555740 */}
          {/* </button> */}
          <button
            onClick={() => window.location.href = 'tel:+919990555740'}
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded hover:bg-[#0f4c81e7] transition sm:px-3 sm:py-2 text-sm sm:text-base"
            title="Call Now"
          >
            <FaPhoneVolume size={20} className="mr-2 text-gray-700" />
            +91-9990555740
          </button>

        </div>
      </section>

      {/* Our Vision and Mission */}
      <div className="bg-white py-16 px-4 sm:px-8 md:px-16 text-center font-serif">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="inline-block bg-[#0F4C81]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#0F4C81] font-semibold">Our Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#0F4C81] mb-6 font-bold">
              Leading India's Venue Discovery Revolution
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To become the most preferred venue discovery platform in India by setting new standards of convenience,
              credibility, and customer satisfaction. We aim to transform how people discover, evaluate, and book
              venues, making every event planning journey seamless and memorable.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-12">
            <div className="inline-block bg-[#0F4C81]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#0F4C81] font-semibold">Our Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#0F4C81] mb-6 font-bold">
              Connecting Venues and Dreamers
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are committed to bridging the gap between venue seekers and venue owners through innovative technology,
              unwavering transparency, and a service-oriented approach. Leveraging years of hospitality expertise,
              we create a seamless, trustworthy platform that empowers both venue owners and event planners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 bg-[#0F4C81]/5 p-8 rounded-lg">
            <div className="border-l-4 border-[#0F4C81] pl-4">
              <h3 className="text-xl text-[#0F4C81] mb-2 font-semibold">Technology-Driven</h3>
              <p className="text-gray-600">
                Utilizing cutting-edge technology to simplify venue discovery and booking.
              </p>
            </div>
            <div className="border-l-4 border-[#0F4C81] pl-4">
              <h3 className="text-xl text-[#0F4C81] mb-2 font-semibold">Customer-Centric</h3>
              <p className="text-gray-600">
                Putting customer experience at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="bg-gray-100 py-16 px-4 sm:px-8 md:px-16 text-center font-serif">
        <h2 className="text-3xl sm:text-4xl text-[#0F4C81] mb-8">What We Offer</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-[#0F4C81] mb-4">Comprehensive Venue Listings</h3>
            <p className="text-gray-700">
              Verified listings of Banquet Halls, Hotels, Farmhouses, Resorts, and Event Spaces
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-[#0F4C81] mb-4">Personalized Services</h3>
            <p className="text-gray-700">
              Real-time availability checks, dedicated relationship managers, and vendor coordination
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-[#0F4C81] mb-4">Event Solutions</h3>
            <p className="text-gray-700">
              Customized solutions for weddings, private functions, and corporate events
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-[#0F4C81] mb-4">Transparent Booking</h3>
            <p className="text-gray-700">
              Transparent pricing, special offers, and complete support from search to booking
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose My Best Venue */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 px-4 sm:px-8 md:px-16 text-white text-center font-serif">
        <p className="text-3xl sm:text-4xl font-bold mb-8">Why My Best Venue?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:mx-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg hover:shadow-lg p-6 border transition duration-300"
            >
              <div className="w-14 h-14 sm:w-14 sm:h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                {feature.icon}
              </div>

              <p className="text-xl sm:text-2xl text-gray-600 mb-2 font-serif break-words">
                {feature.title}
              </p>
              <p className="text-gray-600 text-sm sm:text-base font-serif">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* Venue Types */}
      <div className='m-5'>
        <p className='text-3xl sm:text-4xl mb-8 text-center font-serif text-gray-600'>Venue Types We Cover</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mx-16 m-5'>
          {venueTypes.map((venueType) => (
            <Link
              key={venueType.title}
              // href={`/venue/${venueType.title}`}
              href={`/venue/${encodeURIComponent(venueType.title)}`}
              style={{ textDecoration: 'none' }}
              className="block bg-white rounded-lg hover:shadow-sm text-center border-2 border-[#0f4c81] transition duration-300"
            >
              <p className="text-sm sm:text-base  text-gray-600 inline-flex items-center justify-center m-2">
                {venueType.icon}
                <span className="ml-2 text-sm sm:text-base font-serif">{venueType.title}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>


      {/* Commitment to Excellence */}
      <div className='mt-5 bg-gray-100 py-16 px-4 sm:px-8 md:px-16 text-center font-serif'>
        <p className='text-3xl sm:text-4xl text-[#0F4C81] mb-6'>A Commitment to Excellence</p>
        <p className='max-w-3xl mx-auto text-lg text-gray-700 mb-8'>
<<<<<<< HEAD
          At My Best Venue, we don&apos;t just provide listings &mdash; we deliver complete peace of mind.
=======
          At My Best Venue, we don't just provide listings — we deliver complete peace of mind.
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
          Every event matters, every detail counts, and every memory begins with the right venue.
        </p>
        <p className='text-2xl text-[#0F4C81] italic'>
          My Best Venue: Your Occasion, Our Destination.
        </p>
      </div>

      {/* Popular Cities */}
      <div className='m-5'>
        <p className='text-4xl sm:text-4xl font-serif mb-8 text-center text-gray-600'>
          Popular Cities
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mx-16 m-2 px-1 py-2'>
          {popularCities.map((city) => (
            <Link
              key={city.title}
              href={`/venue/${city.title.toLowerCase()}`}
              style={{ textDecoration: 'none' }}
              onClick={() => setSelectedCity(city.title)}
              className="bg-[#366A9B] text-white rounded-lg hover:shadow-lg text-center transition duration-300 block"
            >
              <h3 className="text-sm sm:text-base font-semibold inline-flex items-center justify-center mt-1 p-3">
                {city.icon}
                <span className="ml-2 text-sm sm:text-base font-serif">{city.title}</span>
              </h3>
            </Link>
          ))}
        </div>

      </div>


      {/* Find Perfect Venue */}
      <div className='mt-5 bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 px-4 sm:px-8 md:px-16 text-white text-center font-serif'>
        <p className='text-2xl sm:text-3xl md:text-4xl font-serif mb-4'>Ready to Find Your Perfect Venue</p>
        <p className='font-serif mb-6'>Join Thousands of Satisfied Customers Who Found Their Dream Venues</p>

        <div>
          <Link
            href="/WeddingVenuesCity"
            style={{ textDecoration: 'none', color: '#4A5565' }}
            className="inline-block bg-white px-4 py-2 rounded-md hover:bg-[#0f4c81e7] transition text-md sm:text-base"
          >
            <span className="flex items-center gap-2">
              <FaSearch />
              Start Searching Now
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default AboutUs