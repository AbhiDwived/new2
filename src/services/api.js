import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { setVendorCredentials, logoutVendor } from '@/features/vendors/vendorSlice';
// import { setCredentials as setAdminCredentials, logout as logoutAdmin } from '@/features/admin/adminSlice';

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:3000/api/proxy',
  credentials: 'include', // Required for cookies
  prepareHeaders: (headers, { getState }) => {
    // Add required headers for CORS
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    // Get token from localStorage (set by NextAuth)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Origin', window.location.origin);
    }

    // Fallback to Redux tokens for vendor/admin
    const vendorToken = getState().vendor?.token;
    const adminToken = getState().adminAuth?.token;
    
    if (vendorToken) {
      headers.set('Authorization', `Bearer ${vendorToken}`);
    } else if (adminToken) {
      headers.set('Authorization', `Bearer ${adminToken}`);
    }

    return headers;
  },
});

// Extended base query with refresh/reauth logic and error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const state = api.getState();

  if (result.error && result.error.status === 401) {

    
    const refreshEndpoint = determineRefreshEndpoint(state);
    const refreshToken = getRefreshToken(state);
    
    if (refreshEndpoint && refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        { 
          url: refreshEndpoint,
          method: 'POST',
          body: { refreshToken }
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {

        // Store the new token
        const userType = determineUserType(state);
        switch (userType) {
          case 'user':
            api.dispatch(setCredentials(refreshResult.data));
            break;
          case 'vendor':
            api.dispatch(setVendorCredentials(refreshResult.data));
            break;
          case 'admin':
            api.dispatch(setAdminCredentials(refreshResult.data));
            break;
        }

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {

        // Logout based on user type
        switch (determineUserType(state)) {
          case 'user':
            api.dispatch(logout());
            break;
          case 'vendor':
            api.dispatch(logoutVendor());
            break;
          case 'admin':
            api.dispatch(logoutAdmin());
            break;
        }
      }
    } else {

      // No refresh token available, logout immediately
      switch (determineUserType(state)) {
        case 'user':
          api.dispatch(logout());
          break;
        case 'vendor':
          api.dispatch(logoutVendor());
          break;
        case 'admin':
          api.dispatch(logoutAdmin());
          break;
      }
    }
  }
  return result;
};

// Helper functions
const determineUserType = (state) => {
  if (state.auth.isAuthenticated) return 'user';
  if (state.vendor.isAuthenticated) return 'vendor';
  if (state.adminAuth.isAuthenticated) return 'admin';
  return null;
};

const determineRefreshEndpoint = (state) => {
  const userType = determineUserType(state);
  switch (userType) {
    case 'user':
      return '/user/refresh-token';
    case 'vendor':
      return '/vendor/refresh-token';
    case 'admin':
      return '/admin/refresh-token';
    default:
      return null;
  }
};

const getRefreshToken = (state) => {
  const userType = determineUserType(state);
  switch (userType) {
    case 'user':
      return localStorage.getItem('refreshToken');
    case 'vendor':
      return localStorage.getItem('vendorRefreshToken');
    case 'admin':
      return localStorage.getItem('adminRefreshToken');
    default:
      return null;
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Vendor',
    'Vendors',
    'Auth',
    'Inquiry',
    'Review',
    'Blog',
    'Community',
    'WeddingVenue',
    'WeddingVendor',
    'Bride',
    'Groom',
    'Budget',
    'Checklist',
    'Guest',
    'Subscription',
    'Booking',
  ],
  endpoints: () => ({}),
});

// Export the api instance for use in other files
export const api = apiSlice;
