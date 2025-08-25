"use client";
import React, { useState, useEffect } from "react";
import { Briefcase, Users, CalendarDays, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


const Corporate1 = "/newPics/Corporate1.avif";
const Corporate2 = "/newPics/Corporate2.avif";
const Corporate3 = "/newPics/Corporate3.avif";
const CoConference = "/newPics/CoConference.avif";
const Coconference2 = "/newPics/Coconference2.avif";
const CoTeam1 = "/newPics/CoTeam1.avif";
const CoTeam2 = "/newPics/CoTeam2.avif";
const CoTeam3 = "/newPics/CoTeam3.avif";
const CoEvent = "/newPics/CoEvent.avif";
const CoEvent2 = "/newPics/CoEvent2.avif";
const CoEvent3 = "/newPics/CoEvent3.avif";

const tabs = [
  { key: "meeting", label: "Meeting Venues", icon: LayoutGrid },
  { key: "conference", label: "Conferences", icon: Users },
  { key: "team", label: "Team Building", icon: Briefcase },
  { key: "events", label: "Corporate Events", icon: CalendarDays },
];

const services = {
  meeting: [
    {
      title: "Conference Rooms",
      description:
        "Professional meeting spaces equipped with the latest technology for presentations and discussions.",
      image: Corporate1,
      navigate: "/conference",
    },
    {
      title: "Executive Boardrooms",
      description:
        "Elegant and private spaces for important board meetings and executive discussions.",
      image: Corporate2,
      navigate: "/executive",
    },
    {
      title: "Training Facilities",
      description:
        "Spacious rooms designed for workshops, training sessions, and collaborative learning.",
      image: Corporate3,
      navigate: "/training",
    },
  ],
  conference: [
    {
      title: "Large Auditoriums",
      description:
        "Host large-scale conferences with state-of-the-art sound and projection systems.",
      image: CoConference,
      navigate: "/large-auditorium",
    },
    {
      title: "Breakout Rooms",
      description:
        "Smaller rooms for side sessions and discussions during your conference.",
      image: Coconference2,
      navigate: "/breakout-room",
    },
    {
      title: "Panel Discussions",
      description:
        "Engage audiences with insightful panels in well-equipped spaces.",
      image: CoConference,
      navigate: "/pannel-discussion",
    },
  ],
  team: [
    {
      title: "Outdoor Retreats",
      description:
        "Bond with your team through activities in scenic outdoor locations.",
      image: CoTeam1,
      navigate: "/outdoor",
    },
    {
      title: "Indoor Workshops",
      description:
        "Structured team-building exercises with professional facilitators.",
      image: CoTeam2,
      navigate: "/indoor",
    },
    {
      title: "Leadership Activities",
      description:
        "Programs focused on building leadership and communication skills.",
      image: CoTeam3,
      navigate: "/leadership",
    },
  ],
  events: [
    {
      title: "Award Nights",
      description:
        "Celebrate milestones and achievements with elegant award ceremonies.",
      image: CoEvent,
      navigate: "/award-nights",
    },
    {
      title: "Product Launches",
      description:
        "Showcase new products with impressive setups and media coverage.",
      image: CoEvent2,
      navigate: "/products",
    },
    {
      title: "Networking Events",
      description:
        "Foster connections in a relaxed and professional environment.",
      image: CoEvent3,
      navigate: "/networking",
    },
  ],
};

export default function Corporate() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("meeting");

  // ✅ Safe localStorage handling (only runs on client)
  useEffect(() => {
    const savedTab = localStorage.getItem("selectedCorporateTab");
    if (savedTab) setSelectedTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCorporateTab", selectedTab);
  }, [selectedTab]);

  const filteredServices = services[selectedTab].filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
            Corporate Meeting & Event Solutions
          </h1>
          <p className="mb-8 text-white">
            Professional venues and services for your business gatherings,
            conferences, and corporate events
          </p>
          <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              style={{ borderRadius: "5px" }}
              className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
              aria-label="Search Venue"
            >
              Search Venue
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#e9eff5] px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Corporate Services
          </h2>
          <p className="text-gray-600 mt-2">
            Comprehensive solutions for all your business meeting and event
            needs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex lg:gap-9 flex-wrap mb-10 bg-gray-300 rounded-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              style={{ borderRadius: "5px" }}
              className={`flex items-center justify-center px-4 py-2 transition 
                w-full sm:w-1/2 md:w-1/3 lg:w-1/5 m-1
                ${
                  selectedTab === tab.key
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 "
                }`}
              aria-label={tab.label}
            >
              <tab.icon size={16} className="mx-2" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={350}
                  className="w-full h-68 object-cover p-3 rounded-[30px]"
                />
                <div className="px-3">
                  <h5 className="font-semibold text-lg mb-2 text-gray-800">
                    {item.title}
                  </h5>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <button
                    onClick={() => item.navigate && router.push(item.navigate)}
                    className="bg-[#0F4C81] text-white px-4 mb-3 py-2 rounded w-full hover:bg-blue-900"
                    aria-label="View Options"
                  >
                    View Options
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No matching services found.
            </p>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#0F4C81] py-16 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h4 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
            Ready to Plan Your Corporate Event?
          </h4>
          <p className="mb-8 text-white">
            Our team of experienced event planners is ready to help you create{" "}
            <br />
            the perfect corporate experience
          </p>
          <div className="flex justify-center">
            <div className="bg-white text-black rounded-lg px-6 py-2">
              <Link
                href="/contactUs"
                className="font-semibold text-black no-underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
