"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const UserLogin = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        error === "CredentialsSignin"
          ? "Invalid email or password."
          : "Something went wrong. Please try again."
      );
    }
  }, [searchParams]);

  const validateForm = (email, password) => {
    const newErrors = {};
    if (!email || !email.includes('@')) newErrors.email = 'Valid email required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const credentialsAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe");

    if (!validateForm(email, password)) return;

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email,
        password,
        rememberMe,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password.");
      } else {
        // Get session to extract token
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        if (session?.accessToken) {
          localStorage.setItem("token", session.accessToken);
        }
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/user/dashboard";
        }, 1000);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your wedding planning tools.
        </p>

        <div className="bg-white p-8 rounded-lg border shadow-md w-full max-w-md">
          <form onSubmit={credentialsAction} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@email.com"
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F4C81] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#0F4C81] hover:text-[#0D3F6A] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F4C81] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer mx-2"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-md transition-colors mb-4 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Sign Up */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default UserLogin;
