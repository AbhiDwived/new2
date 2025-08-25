"use client"

import React, { useState } from 'react';
import { useForgotPasswordMutation } from '@/features/auth/authAPI';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();

      toast.success("OTP sent successfully!");

      setTimeout(() => {
        router.push(`/verify-password-reset?userId=${res.userId}`);
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <p className="text-center mb-4">Enter your email to receive an OTP.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:opacity-70"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>

      {/* ✅ Toast container for feedback */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default ForgotPassword;
