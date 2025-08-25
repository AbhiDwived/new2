"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Bell, Lock, Trash2, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = ({ onUpdate }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isAuthenticated = status === 'authenticated';

  // Loading states
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Backend URL
  const backendURL =
    process.env.NEXT_PUBLIC_API_BACKEND?.replace('/api/v1', '') || 'https://api.mybestvenue.com';

  // Persistent Event Date and Countdown
  const [eventDate, setEventDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedEventDate = localStorage.getItem('userEventDate');
      return storedEventDate || (user?.weddingDate?.split("T")[0] || "");
    }
    return "";
  });

  // Form Data with persistent storage
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedFormData = localStorage.getItem('userProfileData');
      if (storedFormData) {
        try {
          const parsedData = JSON.parse(storedFormData);
          return {
            name: user?.name || parsedData.name || "",
            email: user?.email || parsedData.email || "",
            phone: user?.phone || parsedData.phone || "",
            address: user?.address || parsedData.address || "",
            city: user?.city || parsedData.city || "",
            state: user?.state || parsedData.state || "",
            country: user?.country || parsedData.country || "",
            weddingDate: eventDate,
            profilePhoto: user?.profilePhoto || parsedData.profilePhoto || null,
          };
        } catch (error) {
          console.error("Error parsing stored form data:", error);
        }
      }
    }
    
    return {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      weddingDate: eventDate,
      profilePhoto: user?.profilePhoto || null,
    };
  });

  // Preview Image with persistent storage
  const [previewImage, setPreviewImage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPreviewImage = localStorage.getItem('userProfileImage');
      return storedPreviewImage || user?.image || null;
    }
    return user?.image || null;
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 'Weak',
    strengthColor: 'text-red-500',
    strengthWidth: '20%',
    failedCriteria: [
      "Length (8-20 characters)",
      "At least 1 uppercase letter",
      "At least 1 lowercase letter",
      "At least 1 number",
      "At least 1 special character"
    ]
  });

  // Notifications Toggle
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    inquiryResponses: true,
    checklistReminders: true,
    marketingEmails: false,
  });

  // Event Countdown Calculation
  const [daysUntilEvent, setDaysUntilEvent] = useState(() => {
    // Try to get from localStorage first
    const storedDaysUntilEvent = localStorage.getItem('userEventCountdown');
    if (storedDaysUntilEvent) {
      return parseInt(storedDaysUntilEvent, 10);
    }
    return 0;
  });

  // Tasks Completed with persistent storage
  const [tasksCompleted, setTasksCompleted] = useState(() => {
    // Try to get from localStorage first
    const storedTasksCompleted = localStorage.getItem('userTasksCompleted');
    if (storedTasksCompleted) {
      return parseInt(storedTasksCompleted, 10);
    }
    // Default value if not found
    return 142;
  });

  // Update tasks completed with localStorage persistence
  const updateTasksCompleted = (newTasksCount) => {
    // Ensure the value is within a reasonable range (0-200)
    const validatedTasksCount = Math.max(0, Math.min(200, newTasksCount));
    
    // Update state
    setTasksCompleted(validatedTasksCount);
    
    // Store in localStorage
    localStorage.setItem('userTasksCompleted', validatedTasksCount.toString());
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Calculate days until event (with persistent storage)
  const calculateEventCountdown = useCallback(() => {
    if (eventDate) {
      const eventDateObj = new Date(eventDate);
      const today = new Date();
      const timeDiff = eventDateObj.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const calculatedDays = Math.max(0, daysDiff);
      
      // Store in localStorage
      localStorage.setItem('userEventDate', eventDate);
      localStorage.setItem('userEventCountdown', calculatedDays.toString());
      
      setDaysUntilEvent(calculatedDays);
    }
  }, [eventDate]);
  
  // Recalculate countdown on component mount to ensure it's up-to-date
  useEffect(() => {
    // Force recalculation on mount to ensure countdown is current
    if (eventDate) {
      calculateEventCountdown();
    }
  }, []);

  // Recalculate event countdown on component mount and when event date changes
  useEffect(() => {
    calculateEventCountdown();
  }, [calculateEventCountdown]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Store updated form data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfileData', JSON.stringify(formData));
        localStorage.setItem('userEventDate', formData.weddingDate);
      }

      // Update event date and recalculate countdown
      if (formData.weddingDate) {
        setEventDate(formData.weddingDate);
        calculateEventCountdown();
      }

      if (onUpdate) {
        onUpdate();
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account handler
  const handleDelete = async () => {
    try {
      // Mock delete - replace with actual API call
      toast.success("Account deleted successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast.error("Failed to delete account.");
      console.error(err);
    }
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

  // Handle password change fields
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    
    // Evaluate password strength if it's the new password field
    if (field === 'newPassword') {
      const strengthEvaluation = evaluatePasswordStrength(value);
      setPasswordStrength(strengthEvaluation);
    }
  };

  // Toggle notifications
  const handleNotificationToggle = (setting) => {
    setNotifications((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    setIsUpdatingPassword(true);
    try {
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        toast.error("All password fields are required");
        return;
      }

      if (passwordData.currentPassword === passwordData.newPassword) {
        toast.error("New password must be different from current password");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      if (!isStrongPassword(passwordData.newPassword)) {
        toast.error(`Password must meet all criteria: ${passwordStrength.failedCriteria.join(", ")}`);
        return;
      }

      // Mock password update - replace with actual API call
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className=" space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No photo</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Profile Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {["name", "email", "phone", "weddingDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field === "weddingDate" ? "Event Date" : field}
                  </label>
                  <input
                    type={field === "weddingDate" ? "date" : "text"}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {["address", "city", "state", "country"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1 border p-2 rounded-md"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 rounded-md w-full sm:w-auto ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Saving..." : "Save Information"}
            </button>
          </div>

          {/* Account Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Lock className="h-5 w-5" /> Account Settings
            </h2>
            
            {/* Password validation section at the top */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[70%]">
                 {/* Password fields */}
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <div key={field} className="flex flex-col md:flex-row gap-4">
                <div className="w-full ">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={passwordData[field]}
                      onChange={(e) => handlePasswordChange(field, e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 mt-1"
                      onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}
                    >
                      {showPassword[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword}
              className="bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 my-2 w-full sm:w-auto rounded-md disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
            
              </div>
              <div className="w-full md:w-[30%]">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Password Strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.strengthColor}`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                {renderPasswordStrengthScale()}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Password must have:</p>
                  <ul className="text-xs space-y-1 pl-4 list-disc">
                    {passwordStrength.failedCriteria.map((criteria, index) => (
                      <li key={index} className="text-red-500">{criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <hr />
           
            <div>
              <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This will delete your account permanently.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Notifications + Event Countdown */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Bell className="h-5 w-5" /> Notification Settings
            </h2>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <p className="font-medium text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationToggle(key)}
                  className="h-5 w-5"
                />
              </div>
            ))}
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Save Notification Settings
            </button>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-pink-500" /> Event Countdown
            </h2>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Event Date</p>
              <p className="font-medium text-gray-800">
                {new Date(formData.weddingDate).toDateString()}
              </p>
              <div className="bg-white mt-4 p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">
                  Days until your event
                </p>
                <p className="text-4xl font-bold text-pink-600">
                  {daysUntilEvent}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Tasks completed</p>
                <div className="bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${(tasksCompleted / 200) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600">
                    {tasksCompleted} / 200
                  </p>
                  <button 
                    onClick={() => updateTasksCompleted(tasksCompleted + 1)}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Complete Task
                  </button>
                  <button 
                    onClick={() => updateTasksCompleted(tasksCompleted - 1)}
                    className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                    disabled={tasksCompleted <= 0}
                  >
                    Undo Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete your account permanently? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 "
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;