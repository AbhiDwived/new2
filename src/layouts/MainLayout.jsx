"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>   
      <Footer />
      <FloatingContact />
    </div>
  );
}
