"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import components to avoid SSR issues
const Checklist = dynamic(() => import("@/sections/Auth/UserDashboad/CheckList"), { ssr: false });
const Budget = dynamic(() => import("@/sections/Auth/UserDashboad/Budget"), { ssr: false });
const GuestList = dynamic(() => import("@/sections/Auth/UserDashboad/GuestList"), { ssr: false });
const SavedVendors = dynamic(() => import("@/sections/Auth/UserDashboad/SavedVendor"), { ssr: false });
const Inquiries = dynamic(() => import("@/sections/Auth/UserDashboad/Inquiry"), { ssr: false });
const ProfileTab = dynamic(() => import("@/sections/Auth/UserDashboad/UserProfile"), { ssr: false });
const Booking = dynamic(() => import("@/sections/Auth/UserDashboad/Booking"), { ssr: false });

const tabComponents = {
  "check-list": Checklist,
  "budget": Budget,
  "booking": Booking,
  "guest-list": GuestList,
  "saved-vendor": SavedVendors,
  "inquiry": Inquiries,
  "profile": ProfileTab,
};

const tabLabels = {
  "check-list": "Checklist",
  "budget": "Budget",
  "booking": "Booking",
  "guest-list": "Guest",
  "saved-vendor": "Vendors",
  "inquiry": "Inquiries",
  "profile": "Profile",
};

export default function DashboardTab() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const tab = params.tab;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Store token in localStorage when session is available
    if (status === "authenticated" && session?.accessToken) {
      localStorage.setItem("token", session.accessToken);
    }
  }, [status, router, session]);

  useEffect(() => {
    if (tab && !tabComponents[tab]) {
      router.push("/user/dashboard/check-list");
    }
  }, [tab, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;
  if (!tabComponents[tab]) return null;

  const profile = session?.user;
  const storedEventDate = typeof window !== "undefined" ? localStorage.getItem('userEventDate') : null;
  const eventDate = storedEventDate 
    ? new Date(storedEventDate) 
    : (profile?.weddingDate ? new Date(profile.weddingDate) : null);

  const formattedEventDate = eventDate
    ? eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No event date set";

  const displayName = profile?.name?.split("&")[0] || profile?.name || "User";
  const location = profile?.city || "Location not set";

  const ActiveComponent = tabComponents[tab];

  return (
    <div className="w-full">
      {/* Greeting */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-serif">
              Hello, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-serif">
              {formattedEventDate} • {location}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lg:mt-7 p-2">
        <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2 bg-gray-200 py-1 px-2 overflow-x-auto rounded">
          {Object.entries(tabLabels).map(([value, label]) => (
            <button
              key={value}
              onClick={() => router.push(`/user/dashboard/${value}`)}
              className={`py-1 px-2 text-sm sm:text-base capitalize transition-all duration-200 border whitespace-nowrap rounded
                ${tab === value
                  ? "bg-white text-black font-semibold"
                  : "bg-gray-200 text-gray-600 hover:bg-white hover:text-black"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        <Suspense fallback={<div>Loading component...</div>}>
          <ActiveComponent
            profile={profile}
            onUpdate={() => {
              // No explicit refetch needed due to Redux subscription
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}