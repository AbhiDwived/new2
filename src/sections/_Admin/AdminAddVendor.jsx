"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateVendorByAdminMutation } from '@/features/admin/adminAPI';
import { toast } from 'react-toastify';
import { Country, State, City } from 'country-state-city';


const VENDOR_TYPES = [
  'Photographers',
  'Makeup Artists',
  'Mehndi Artists',
  'Bands',
  'Cake Vendors',
  'Caterers',
  'Florists',
  'Decorators',
  'Bridal Wear',
  'Jewellers',
  'Groom Wear',
  'Choreographers',
  'Event Planners',
  'DJs',
  'Magicians',
  'Gift Providers',
  'Tent House Services',
  'Entertainers',
  'Bus On Rent',
  'Wedding Planners',
  'Wedding Photographers',
  'Astrologers'
];

const VENUE_TYPES = [
  'Art Gallery',
  'Amusement Park',
  'Auditorium',
  'Banquet halls',
  'Bars',
  'Clubs',
  'Pool Side',
  'Conference Rooms',
  'Farm Houses',
  'Hotels',
  'Party lawn',
  'Resort',
  'Restaurants',
  'Seminar Halls',
  'Theater',
  'Unique Venues',
  'Roof Top',
  'Gaming Zone',
  'Villas',
  'Pubs',
  'Meeting Rooms',
  'Boat / Yatch',
  'Vacation Homes',
  'Cafes',
  'Co-working spaces',
  'Business Centres',
  'Guest Houses',
  '5 Star Hotel',
  'Marriage Garden',
  'Wedding Hotels',
  'Marriage Lawn',
  'Wedding Resort',
  'Training Rooms',
  'Kids Play Area'
];

const NEAR_LOCATIONS = {
  'New Delhi': ['Connaught Place', 'India Gate', 'Red Fort', 'Karol Bagh', 'Paharganj'],
  'Mumbai': ['Bandra', 'Andheri', 'Juhu', 'Powai', 'Colaba', 'Marine Drive'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
  'Pune': ['Koregaon Park', 'Hinjewadi', 'Baner', 'Wakad', 'Kothrud'],
  'Gurgaon': ['Cyber City', 'Golf Course Road', 'Sohna Road', 'MG Road', 'Sector 14'],
  'Noida': ['Sector 18', 'Sector 62', 'Greater Noida', 'Sector 15', 'Sector 37']
};

export default function AdminAddVendor() {
  const router = useRouter();
  const [createVendorByAdmin, { isLoading }] = useCreateVendorByAdminMutation();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    vendorType: '',
    venueType: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    country: 'IN',
    state: '',
    city: '',
    nearLocation: '',
    customNearLocation: '',
    pinCode: '',
    address: '',
    serviceAreas: ''
  });
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      const stateCities = City.getCitiesOfState('IN', value);
      setCities(stateCities);
      setFormData(prev => ({ ...prev, state: value, city: '', nearLocation: '' }));
    } else if (name === 'city') {
      setFormData(prev => ({ ...prev, city: value, nearLocation: '' }));
    } else if (name === 'pinCode') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 6) {
        setFormData(prev => ({ ...prev, pinCode: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.businessType || !formData.contactName || 
        !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.businessType === 'vendor' && !formData.vendorType) {
      toast.error('Please select a vendor type');
      return;
    }

    if (formData.businessType === 'venue' && !formData.venueType) {
      toast.error('Please select a venue type');
      return;
    }

    try {
      const data = new FormData();
      // Add basic fields
      data.append('businessName', formData.businessName);
      data.append('businessType', formData.businessType);
      data.append('contactName', formData.contactName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('city', formData.city);
      data.append('pinCode', formData.pinCode);
      data.append('address', formData.address);
      
      // Add business type specific fields
      if (formData.businessType === 'vendor') {
        data.append('vendorType', formData.vendorType);
      } else if (formData.businessType === 'venue') {
        data.append('venueType', formData.venueType);
      }
      
      // Handle near location
      const finalNearLocation = formData.nearLocation === 'other' ? formData.customNearLocation : formData.nearLocation;
      if (finalNearLocation) {
        data.append('nearLocation', finalNearLocation);
      }
      
      // Create service areas from location
      const selectedState = states.find(s => s.isoCode === formData.state);
      const locationString = `${formData.city}, ${selectedState?.name || formData.state}, India`;
      data.append('serviceAreas', JSON.stringify([locationString]));
      data.append('isVerified', true);
      data.append('isApproved', true);
      data.append('termsAccepted', true);
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }
      
      await createVendorByAdmin(data).unwrap();
      
      toast.success('Vendor created successfully!');
      router.push('/admin/vendor_management');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create vendor');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Vendor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Business Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Business Type *</label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.businessType === 'vendor'}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  businessType: prev.businessType === 'vendor' ? '' : 'vendor',
                  vendorType: '',
                  venueType: ''
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Vendor Type</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.businessType === 'venue'}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  businessType: prev.businessType === 'venue' ? '' : 'venue',
                  vendorType: '',
                  venueType: ''
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Venue Type</span>
            </label>
          </div>
        </div>

        {/* Vendor Type Dropdown */}
        {formData.businessType === 'vendor' && (
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Type *</label>
            <select
              name="vendorType"
              value={formData.vendorType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select vendor type</option>
              {VENDOR_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Venue Type Dropdown */}
        {formData.businessType === 'venue' && (
          <div>
            <label className="block text-sm font-medium mb-1">Venue Type *</label>
            <select
              name="venueType"
              value={formData.venueType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select venue type</option>
              {VENUE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Contact Name *</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="IN">India</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Near Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Near Location</label>
          <select
            name="nearLocation"
            value={formData.nearLocation === 'other' ? 'other' : (NEAR_LOCATIONS[formData.city]?.includes(formData.nearLocation) ? formData.nearLocation : '')}
            onChange={(e) => {
              if (e.target.value === 'other') {
                setFormData(prev => ({ ...prev, nearLocation: 'other', customNearLocation: '' }));
              } else {
                setFormData(prev => ({ ...prev, nearLocation: e.target.value, customNearLocation: '' }));
              }
            }}
            className="w-full px-3 py-2 border rounded-md"
            disabled={!formData.city}
          >
            <option value="">Select Near Location (Optional)</option>
            {formData.city && NEAR_LOCATIONS[formData.city]?.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {formData.nearLocation === 'other' && (
            <input
              type="text"
              placeholder="Enter your near location"
              value={formData.customNearLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, customNearLocation: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md mt-2"
            />
          )}
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Pin Code *</label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="Enter 6-digit PIN code"
            className="w-full px-3 py-2 border rounded-md"
            maxLength={6}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Preview"
                className="h-16 w-16 rounded-full object-cover border"
              />
            )}
            <label
              htmlFor="profilePicture"
              className="cursor-pointer inline-block px-4 py-2 text-white text-sm font-medium rounded-md shadow transition"
              style={{ backgroundColor: '#0f4c81' }}
            >
              Choose File
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          {profilePicture && (
            <p className="mt-2 text-sm text-gray-500">{profilePicture.name}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/vendor_management')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: '#0f4c81' }}
          >
            {isLoading ? 'Creating...' : 'Create Vendor'}
          </button>
        </div>
      </form>
    </div>
  );
}