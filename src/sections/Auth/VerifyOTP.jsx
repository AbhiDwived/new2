"use client"

import React, { useState, useEffect } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/features/auth/authAPI';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

const VerifyOTP = () => {
  const router = useRouter();
  // Get email from navigation state or localStorage
  const [email, setEmail] = useState(localStorage.getItem('pendingEmail') || '');

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // If no email, redirect to signup
  useEffect(() => {
    if (!email) {
      toast.error('No registration session found. Please register again.');
      router.push('/signup');
    } else {
      localStorage.setItem('pendingEmail', email);
    }
  }, [email]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, canResend]);

  const handleResendOTP = async () => {
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP resent successfully!");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error('OTP Resend Failed:', err);
      
      // Check for specific error message about no pending registration
      if (err?.data?.message === 'No pending registration found for this email. Please register first.') {
        toast.error('Your registration session has expired. Please register again.');
        localStorage.removeItem('pendingEmail');
        setTimeout(() => {
          router.push('/signup');
        }, 2000);
      } else {
        toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Basic validation
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success("OTP Verified successfully!");
      localStorage.removeItem('pendingEmail');
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Delay to let toast show before redirect
    } catch (err) {
      console.error('OTP Verification Failed:', err);
      if (err?.data?.message === 'No pending registration found. Please register again.') {
        toast.error('Your registration session expired. Please register again.');
        localStorage.removeItem('pendingEmail');
        setTimeout(() => {
          router.push('/signup');
        }, 2000);
      } else {
        toast.error(err?.data?.message || "OTP Verification failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <p className="text-center mb-4">Enter the 6-digit OTP sent to your email.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:opacity-70 mb-4"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP Button */}
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition disabled:opacity-70 text-sm"
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="text-center text-sm text-gray-600">
              Resend OTP in {timer} seconds
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-500 text-center">
              {error.data?.message || 'Invalid OTP'}
            </p>
          )}
        </form>
      </div>

      {/* ✅ Toast container (remove if added globally) */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VerifyOTP;
