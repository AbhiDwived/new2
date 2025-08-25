"use client"

import React, { useState, useEffect, useRef } from "react";

const ProjectList = () => {
  const stats = [
    { value: "500+", label: "Premium Venues", number: 500 },
    { value: "25,000+", label: "Successful Events", number: 25000 },
    { value: "2,000+", label: "Trusted Vendors", number: 2000 },
    { value: "99%", label: "Client Satisfaction", number: 99 },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Function to animate counting
  const animateCounter = (index, target, duration = 3000) => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smoother animation - cubic ease-in-out for slower start
      const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = easeInOutCubic(progress);
      
      // Calculate current value
      let currentValue = Math.floor(easedProgress * target);
      
      // Update state
      setCounters(prevCounters => {
        const newCounters = [...prevCounters];
        newCounters[index] = currentValue;
        return newCounters;
      });
      
      // Continue animation if not complete
      if (now < endTime) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Start animations when section becomes visible
  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        // Add a staggered delay to each counter
        setTimeout(() => {
          animateCounter(index, stat.number);
        }, index * 200); // 200ms delay between each counter starting
      });
    }
  }, [isVisible]);

  // Format the counter values with commas and add + symbol
  const formatCounter = (value, format) => {
    const formattedNumber = value.toLocaleString();
    return format.includes('+') ? `${formattedNumber}+` : `${formattedNumber}%`;
  };

  return (
    <section ref={sectionRef} className="bg-[#0f4c81] py-16 px-4 sm:px-8 md:px-16 text-white text-center">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair mb-4">
          MyBestVenue by Numbers
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto text-gray-200">
          We've been helping clients find their perfect venues for years. Here's what we've achieved so far.
        </p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#195b8c] rounded-xl shadow-md p-6 sm:p-8 text-center"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-white mb-2">
                {isVisible ? formatCounter(counters[index], stat.value) : "0"}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
