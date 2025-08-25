"use client"

import React, { useState, useRef, useEffect } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Event Manager",
    company: "InnoTech Solutions",
    content:
      "MyBestVenue helped us find the perfect location for our annual conference...",
    rating: 5,
    image: "/newPics/testM1.avif",
    category: "conference",
  },
  {
    id: "2",
    name: "Akash Patel",
    role: "CEO",
    company: "Horizon Enterprises",
    content:
      "We organized our company's 10th anniversary celebration through MyBestVenue...",
    rating: 4.8,
    image: "/newPics/testM2.avif",
    category: "corporate",
  },
  {
    id: "3",
    name: "Riya Desai",
    role: "Marketing Director",
    company: "Global Media",
    content:
      "From planning to execution, MyBestVenue provided exceptional service...",
    rating: 4.9,
    image: "/newPics/testM3.avif",
    category: "corporate",
  },
  {
    id: "4",
    name: "Vikram Singh",
    role: "Wedding Planner",
    company: "Dream Weddings",
    content:
      "As a wedding planner, I rely on MyBestVenue for finding unique locations...",
    rating: 5,
    image: "/newPics/testM4.avif",
    category: "wedding",
  },
  {
    id: "5",
    name: "Anjali Gupta",
    role: "Bride",
    company: "",
    content:
      "Finding our dream wedding venue was so easy with MyBestVenue...",
    rating: 5,
    image: "/newPics/testM5.avif",
    category: "wedding",
  },
  {
    id: "6",
    name: "Rajesh Kumar",
    role: "Event Host",
    company: "Family Reunions",
    content:
      "Our family reunion needed a special venue that could accommodate everyone...",
    rating: 4.7,
    image: "/newPics/testM6.avif",
    category: "social",
  },
];


const tabs = ['all', 'wedding', 'corporate', 'social'];

// Group items for carousel slides
const groupIntoSlides = (items, perSlide) => {
  const slides = [];
  for (let i = 0; i < items.length; i += perSlide) {
    slides.push(items.slice(i, i + perSlide));
  }
  return slides;
};

const TestimonialSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3); // default lg: 3 items
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Update itemsPerSlide on window resize
  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerSlide(3);   // lg
      else if (width >= 768) setItemsPerSlide(2); // md
      else setItemsPerSlide(1);                   // sm
    };

    updateItemsPerSlide(); // initial check

    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);
  const filteredTestimonials =
    activeTab === 'all'
      ? testimonials
      : testimonials.filter((t) => t.category === activeTab);

  // Group testimonials dynamically based on itemsPerSlide
  const slides = groupIntoSlides(filteredTestimonials, itemsPerSlide);
  const totalSlides = slides.length;

  // Reset currentSlide if currentSlide exceeds new totalSlides after resizing or filtering
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (distance > threshold) nextSlide(); // swipe left
    else if (distance < -threshold) prevSlide(); // swipe right
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div className=" mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-playfair">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our clients have to say about their experience with MyBestVenue.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 md:grid-cols-4 max-w-2xl mx-auto p-1 bg-gray-100 rounded-md mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`p-2 rounded-md text-sm font-medium capitalize text-center ${activeTab === tab ? 'bg-white text-gray-500' : 'text-gray-700'
                }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentSlide(0);
              }}
              aria-label={tab === 'all' ? 'All Events' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} testimonials`}
            >
              {tab === 'all' ? 'All Events' : tab}
            </button>
          ))}
        </div>


        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            style={{ borderRadius: '25px' }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow hover:bg-gray-100"
            aria-label="Previous testimonials"
          >
            <FaChevronLeft size={15} />
          </button>

          {/* Swipeable slides */}
          <div
            className="overflow-hidden w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex bg-white transition-transform duration-500"
              style={{
                width: `${slides.length * 100}%`,
                transform: `translateX(-${(100 / slides.length) * currentSlide}%)`,
              }}
            >
              {slides.map((group, i) => (
                <div
                  key={i}
                  className="flex justify-center gap-5 px-9"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  {group.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      // make flex basis dynamic to fill the slide evenly
                      style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}
                      className="max-w-md"
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            style={{ borderRadius: '25px' }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow hover:bg-gray-100"
            aria-label="Next testimonials"
          >
            <FaChevronRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full max-w-md w-full transition duration-300 hover:shadow-md">
      <FaQuoteLeft className="text-[#F4EADC] text-3xl mb-4" />

      <div className="flex items-center gap-4 mb-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-14 w-14 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h3 className="font-semibold text-[#14487D]">{testimonial.name}</h3>
          <p className="text-sm text-gray-700">
            {testimonial.role}
            {testimonial.company && `, ${testimonial.company}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-5 w-5 ${i < Math.floor(testimonial.rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>

      <p className="text-gray-800 italic leading-relaxed">
        {testimonial.content}
      </p>
    </div>
  );
};

export default TestimonialSection;
