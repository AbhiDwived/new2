import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { endpoint }) => {
      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        'getAllVendors',
        'getAllPublicVendors'
      ];

      // Skip adding token for public endpoints
      if (publicEndpoints.includes(endpoint)) {
        return headers;
      }

      // Only access localStorage on the client side
      if (typeof window !== 'undefined') {
        // Try to get admin token first
        const adminToken = localStorage.getItem('adminToken');
        // Fallback to regular token if admin token is not available
        const token = adminToken || localStorage.getItem('token');
        
        if (token) {
          console.log('Using token for admin API call:', token.substring(0, 10) + '...');
          headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('No token found for admin API call');
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register Admin
    registerAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/register',
        method: 'POST',
        body: data,
      }),
    }),

    // Login Admin
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify Admin OTP
    verifyAdminOtp: builder.mutation({
      query: ({ adminId, otp }) => ({
        url: '/admin/admin_verify_otp',
        method: 'POST',
        body: { adminId, otp },
      }),
    }),

    // Resend Admin OTP
    resendAdminOtp: builder.mutation({
      query: ({ adminId }) => ({
        url: '/admin/resend_admin_otp',
        method: 'POST',
        body: { adminId },
      }),
    }),

    // Update Admin Profile
    updateAdminProfile: builder.mutation({
      query: ({ adminId, profileData }) => ({
        url: `/admin/update/${adminId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),

    // ✅ Get All Users
    getAllUsers: builder.query({
      query: () => '/admin/all_users',
    }),

    // ✅ Delete User by Admin
    deleteUserByAdmin: builder.mutation({
      query: ({ userId }) => ({
        url: `/admin/delete-user/${userId}`,
        method: 'DELETE',
      }),
    }),

    // ✅ Get All Vendors (Public endpoint)
    getAllVendors: builder.query({
      query: () => '/admin/all_vendors',
      // This endpoint doesn't require authentication for viewing vendors
    }),

    // Get Latest Vendors By Type
    getLatestVendorsByType: builder.query({
      query: () => '/admin/latest_vendors_by_type',
    }),

    // Approve Vendor
    approveVendor: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/admin/approve/${vendorId}`,
        method: 'PUT',
      }),
      // Invalidate the pending vendors cache after successful approval
      invalidatesTags: ['PendingVendors'],
    }),

    // Get Pending Vendors
    getPendingVendors: builder.query({
      query: () => '/admin/pending_vendor',
      // Add tag to the query
      providesTags: ['PendingVendors'],
    }),

    // Delete Vendor
    deleteVendorByAdmin: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/admin/delete-vendor/${vendorId}`,
        method: 'DELETE',
      }),
      // Invalidate the pending vendors cache after successful deletion
      invalidatesTags: ['PendingVendors'],
    }),

    // Create Vendor by Admin
    createVendorByAdmin: builder.mutation({
      query: (vendorData) => ({
        url: '/admin/create-vendor',
        method: 'POST',
        body: vendorData,
      }),
    }),

    // ✅ Activity Endpoints — UPDATED to use /activity instead of /admin
    getRecentActivities: builder.query({
      query: () => '/activity/recent', // ✅ Updated
    }),

    getActivityStats: builder.query({
      query: () => '/activity/stats', // ✅ Updated
    }),

    searchActivities: builder.query({
      query: (query) => `/activity/search?query=${encodeURIComponent(query)}`, // ✅ Updated
    }),

    deleteActivity: builder.mutation({
      query: ({ id }) => ({
        url: `/activity/activity/${id}`, // ✅ Use consistent naming
        method: 'DELETE',
      }),
    }),

    bulkDeleteActivities: builder.mutation({
      query: (body) => ({
        url: '/activity/bulk-delete', // ✅ Updated
        method: 'POST',
        body,
      }),
    }),

       //UserContact---Get
       getAllMessage: builder.query({
        query: ({ page = 1, limit = 10 }) => ({
          url: "/user/contacts",
          method: "GET",
          params: { page, limit },
        }),
      }),

    // Get vendor counts by location
    getVendorCountsByLocation: builder.query({
      query: (location) => `/admin/vendor-counts/${location}`,
    }),

    // Ride management endpoints
    getAllRides: builder.query({
      query: () => '/admin/rides',
      providesTags: ['Rides'],
    }),

    createRide: builder.mutation({
      query: (rideData) => ({
        url: '/admin/rides',
        method: 'POST',
        body: rideData,
      }),
      invalidatesTags: ['Rides'],
    }),

    updateRide: builder.mutation({
      query: ({ rideId, ...rideData }) => ({
        url: `/admin/rides/${rideId}`,
        method: 'PUT',
        body: rideData,
      }),
      invalidatesTags: ['Rides'],
    }),

    deleteRide: builder.mutation({
      query: ({ rideId }) => ({
        url: `/admin/rides/${rideId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rides'],
    }),

    getRidesByVendor: builder.query({
      query: (vendorId) => `/admin/rides/vendor/${vendorId}`,
      providesTags: ['Rides'],
    }),

  }),
});

// Export hooks
export const {
  useRegisterAdminMutation,
  useGetAllMessageQuery,
  useLoginAdminMutation,
  useVerifyAdminOtpMutation,
  useResendAdminOtpMutation,
  useUpdateAdminProfileMutation,

  useGetAllUsersQuery,
  useDeleteUserByAdminMutation,

  useGetAllVendorsQuery,
  useGetLatestVendorsByTypeQuery,
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,
  useCreateVendorByAdminMutation,

  // ✅ Activity Hooks
  useGetRecentActivitiesQuery,
  useGetActivityStatsQuery,
  useSearchActivitiesQuery,
  useDeleteActivityMutation,
  useBulkDeleteActivitiesMutation,

  useGetVendorCountsByLocationQuery,

  // Ride management hooks
  useGetAllRidesQuery,
  useCreateRideMutation,
  useUpdateRideMutation,
  useDeleteRideMutation,
  useGetRidesByVendorQuery,
} = adminApi;
