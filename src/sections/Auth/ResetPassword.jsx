"use client";

import React, { useState } from "react";
import { useResetPasswordMutation } from "@/features/auth/authAPI";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // ✅ get query param

  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ userId, newPassword }).unwrap();
      router.push("/login");
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
          {isSuccess && (
            <p className="mt-4 text-green-500 text-center">
              Password updated successfully!
            </p>
          )}
          {error && (
            <p className="mt-4 text-red-500 text-center">
              {error.data?.message || "Failed to reset password"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
