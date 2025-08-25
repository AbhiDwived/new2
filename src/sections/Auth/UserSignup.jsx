"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useRegisterUserMutation } from '@/features/auth/authAPI';
import { showToast } from '@/utils/toast';
import { Eye, EyeOff } from 'react-feather';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    profilePhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [userType, setUserType] = useState('couple');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const router = useRouter();
  const nameInputRef = useRef(null);
  const isMounted = useRef(true);
  const timeoutRef = useRef();

  useEffect(() => {
    isMounted.current = true;
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e) => {
    window.scrollTo({top:0, category:"top"})
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Enhanced email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isStrongPassword = (password) => {
    // At least 8 characters, max 20
    // Must contain:
    // - At least 1 uppercase letter
    // - At least 1 lowercase letter
    // - At least 1 number
    // - At least 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
  };

  // Comprehensive password strength evaluation
  const evaluatePasswordStrength = (password) => {
    // Criteria for password strength
    const criteria = [
      { 
        test: (p) => p.length >= 8 && p.length <= 20, 
        message: "Length (8-20 characters)" 
      },
      { 
        test: (p) => /[A-Z]/.test(p), 
        message: "At least 1 uppercase letter" 
      },
      { 
        test: (p) => /[a-z]/.test(p), 
        message: "At least 1 lowercase letter" 
      },
      { 
        test: (p) => /\d/.test(p), 
        message: "At least 1 number" 
      },
      { 
        test: (p) => /[@$!%*?&]/.test(p), 
        message: "At least 1 special character" 
      }
    ];

    // Evaluate strength
    const passedCriteria = criteria.filter(c => c.test(password));
    
    let strength = 'Weak';
    let strengthColor = 'text-red-500';
    let strengthWidth = '20%';
    
    if (passedCriteria.length === 5) {
      strength = 'Strong';
      strengthColor = 'text-green-500';
      strengthWidth = '100%';
    } else if (passedCriteria.length >= 4) {
      strength = 'Good';
      strengthColor = 'text-yellow-500';
      strengthWidth = '80%';
    } else if (passedCriteria.length >= 3) {
      strength = 'Medium';
      strengthColor = 'text-orange-500';
      strengthWidth = '60%';
    } else if (passedCriteria.length >= 2) {
      strength = 'Weak';
      strengthColor = 'text-red-500';
      strengthWidth = '40%';
    }

    return {
      strength,
      strengthColor,
      strengthWidth,
      failedCriteria: criteria.filter(c => !c.test(password)).map(c => c.message)
    };
  };

  // State for password strength
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 'Weak',
    strengthColor: 'text-red-500',
    strengthWidth: '20%',
    failedCriteria: []
  });

  // Render method for password strength scale
  const renderPasswordStrengthScale = () => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ease-in-out ${passwordStrength.strengthColor.replace('text-', 'bg-')}`}
          style={{ width: passwordStrength.strengthWidth }}
        ></div>
      </div>
    );
  };

  // Update password strength on change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Evaluate password strength if it's the password field
    if (name === 'password') {
      const strengthEvaluation = evaluatePasswordStrength(value);
      setPasswordStrength(strengthEvaluation);
    }
  };

  // Update confirm password change to check match
  const handleConfirmPasswordChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Check password match
    if (formData.password !== value) {
      showToast.warn("Passwords do not match");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Password Strength
    const strengthCheck = evaluatePasswordStrength(formData.password);
    if (strengthCheck.strength !== 'Strong') {
      showToast.error("Please strengthen your password. Missing requirements:\n" + 
        strengthCheck.failedCriteria.join('\n'));
      return;
    }

    // Comprehensive validation
    const phone = formData.phone.toString();
    const email = formData.email.trim();
    const password = formData.password;

    // Validate Name
    if (formData.name.trim().length < 3) {
      showToast.error("Name must be at least 3 characters long.");
      return;
    }

    // Validate Email
    if (!isValidEmail(email)) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    // Validate Phone
    if (!isValidPhoneNumber(phone)) {
      showToast.error("Please enter a valid phone number.");
      return;
    }

    // Validate Password Strength
    if (!isStrongPassword(password)) {
      showToast.error("Password must:\n- Be 8-20 characters long\n- Include at least 1 uppercase letter\n- Include at least 1 lowercase letter\n- Include at least 1 number\n- Include at least 1 special character (@$!%*?&)");
      return;
    }

    if (password !== formData.confirmPassword) {
      showToast.error("⚠️ Passwords do not match!");
      return;
    }

    if (!formData.termsAccepted) {
      showToast.error("⚠️ You must agree to the terms and conditions.");
      return;
    }

    // Rest of the existing submit logic remains the same
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        payload.append(key, value);
      }
    });

    try {
      const res = await registerUser(payload).unwrap();
      console.log("Registration response:", res);
      // Do not store token/user yet, wait for OTP verification
      showToast.success("✅ OTP sent to your email! Please verify.");
      if (res?.email) {
        localStorage.setItem('pendingEmail', res.email);
        router.push('/verify-otp', { state: { email: res.email } });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      showToast.error(`❌ ${err.data?.message || 'Registration failed. Try again.'}`);
    }
  };

  const handleTabClick = (type) => {
    setUserType(type);
    if (type === 'vendor') {
      router.push('/vendor-register');
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-1 text-center text-gray-800">Create User Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join myBestVenue to access wedding planning tools and connect with vendors.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleTabClick('user')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'couple' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              User
            </button>
            <button
              onClick={() => handleTabClick('vendor')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'vendor' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="25"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={nameInputRef}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                id="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <PhoneInput
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                required
                defaultCountry="IN"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            {/* Password */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-gray-700">
                  Create Password <span className="text-red-500">*</span>
                </label>
                {formData.password && (
                  <span className={`text-xs font-semibold ${passwordStrength.strengthColor}`}>{passwordStrength.strength}</span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                />
                {/* Eye button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  style={{ top: 0, bottom: 0 }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {/* Password strength scale on the right, vertically centered */}
                {formData.password && (
                  <div className="absolute inset-y-0 flex items-center right-10 w-16">
                    {renderPasswordStrengthScale()}
                  </div>
                )}
              </div>
              {/* Optionally show failed criteria below */}
              {formData.password && passwordStrength.failedCriteria.length > 0 && (
                <ul className="text-xs text-gray-500 mt-1">
                  {passwordStrength.failedCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Profile Photo Upload with Preview */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Profile Picture</label>
              <div className="flex items-center space-x-4">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                )}
                <label
                  htmlFor="profilePhoto"
                  className="cursor-pointer inline-block px-4 py-2 text-white text-sm font-medium rounded-md shadow transition"
                  style={{ backgroundColor: 'rgb(15, 76, 129)' }}
                >
                  Choose File
                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.profilePhoto && (
                <p className="mt-2 text-sm text-gray-500">{formData.profilePhoto.name}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81]"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer mx-1">
                I agree to the{' '}
                <Link href="/terms" style={{ textDecoration: 'none' }} className="text-[#0F4C81] hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" style={{ textDecoration: 'none' }} className="text-[#0F4C81] hover:underline">Privacy Policy</Link>
                <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-lg transition-colors ${isLoading ? 'bg-[#7AA6CE]' : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'} focus:outline-none focus:ring-2 focus:ring-[#0F4C81]`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" style={{ textDecoration: 'none' }} className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline">
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserSignup;
