"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VendorLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main> {/* replaces <Outlet /> */}
      <Footer />
    </>
  );
}
