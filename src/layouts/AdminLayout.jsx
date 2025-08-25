"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>   {/* children replaces <Outlet /> */}
      <Footer />
    </>
  );
}
