"use client";

import React, { useState, useEffect } from "react";
import {
  useVerifyPasswordResetMutation,
  useResendPasswordResetOtpMutation,
} from "@/features/auth/authAPI";
import { useRouter, useSearchParams } from "next/navigation"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyPasswordReset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ get userId from query string
  const userId = searchParams.get("userId");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [verifyPasswordReset, { isLoading, error }] =
    useVerifyPasswordResetMutation();
  const [resendPasswordResetOtp, { isLoading: isResending }] =
    useResendPasswordResetOtpMutation();

  // Timer countdown logic
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
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend]);

  const handleResendOTP = async () => {
    if (!userId) {
      toast.error("Missing user ID.");
      return;
    }

    try {
      await resendPasswordResetOtp({ userId }).unwrap();
      toast.success("OTP resent successfully!");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error("OTP Resend Failed:", err);
      toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyPasswordReset({ userId, otp }).unwrap();
      toast.success("OTP verified successfully!");

      setTimeout(() => {
        router.push(`/reset-password?userId=${userId}`); // ✅ Next.js navigation
      }, 2000);
    } catch (err) {
      console.error("Password reset verification failed:", err);
      toast.error(err?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <p className="text-center mb-4">Enter the OTP sent to your email.</p>
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
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP Button */}
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition disabled:opacity-70 text-sm"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-center text-sm text-gray-600">
              Resend OTP in {timer} seconds
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-500 text-center">
              {error.data?.message || "Invalid or expired OTP"}
            </p>
          )}
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
      />
    </div>
  );
};

export default VerifyPasswordReset;
