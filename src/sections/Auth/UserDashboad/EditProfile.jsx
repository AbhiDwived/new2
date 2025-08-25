"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    profilePhoto: "",
    weddingDate: "",
  });

  useEffect(() => {
    if (user) {
      // Try to load from localStorage first
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('userProfileData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setFormData({
              name: parsedData.name || user.name || "",
              email: parsedData.email || user.email || "",
              phone: parsedData.phone || user.phone || "",
              address: parsedData.address || user.address || "",
              city: parsedData.city || user.city || "",
              state: parsedData.state || user.state || "",
              country: parsedData.country || user.country || "",
              profilePhoto: parsedData.profilePhoto || user.image || "",
              weddingDate: parsedData.weddingDate || (user.weddingDate ? user.weddingDate.split("T")[0] : ""),
            });
            return;
          } catch (error) {
            console.error('Error parsing saved data:', error);
          }
        }
      }
      
      // Fallback to user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        profilePhoto: user.image || "",
        weddingDate: user.weddingDate ? user.weddingDate.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("profileImageInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save wedding date to localStorage
      if (formData.weddingDate && typeof window !== 'undefined') {
        localStorage.setItem('userEventDate', formData.weddingDate);
        localStorage.setItem('userProfileData', JSON.stringify(formData));
      }

      toast.success("Profile updated successfully!");
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please log in to edit your profile.</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-300">
        <div className="max-w-4xl mx-auto p-6  shadow-lg rounded-xl">
          {/* Header and Profile Image */}
          <div className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
            <div
              onClick={handleImageClick}
              className="relative group cursor-pointer w-36 h-36 rounded-full border-4 border-blue-100 overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={
                  formData.profilePhoto ||
                  "https://via.placeholder.com/150?text=Upload"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 text-white text-sm">
                Click to change
              </div>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            {Object.entries(formData).map(([key, value]) =>
              key === "profilePhoto" ? null : (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700 capitalize mb-1"
                  >
                    {key === "weddingDate" ? "Event Date" : key}
                  </label>
                  <input
                    id={key}
                    name={key}
                    type={key === "email" ? "email" : key === "weddingDate" ? "date" : "text"}
                    value={value}
                    onChange={handleChange}
                    className="w-full border bg-gray-100 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={`Enter ${key}`}
                    autoComplete="off"
                  />
                </div>
              )
            )}
            <div className="col-span-full text-center mt-2">
              <button
                type="submit"
                disabled={isLoading}
                style={{ borderRadius: '5px' }}
                className="bg-[#0f304d] hover:bg-[#0f304def] text-white px-6 py-2 rounded-md text-lg font-medium disabled:opacity-50 transition duration-300"
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;
