import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const savedVendorApi = createApi({
  reducerPath: 'savedVendorApi',
  baseQuery: fetchBaseQuery({
<<<<<<< HEAD
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:3000/api/proxy',
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
=======
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      }
      return headers;
    },
  }),
  tagTypes: ['SavedVendors'],
  endpoints: (builder) => ({
    // Get all saved vendors
    getSavedVendors: builder.query({
      query: () => ({
        url: '/saved-vendors',
        method: 'GET',
      }),
      providesTags: ['SavedVendors'],
    }),

    // Save a vendor
    saveVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/saved-vendors/${vendorId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SavedVendors'],
    }),

    // Unsave a vendor
    unsaveVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/saved-vendors/${vendorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedVendors'],
    }),

    // Check if a vendor is saved
    checkVendorSaved: builder.query({
      query: (vendorId) => ({
        url: `/saved-vendors/check/${vendorId}`,
        method: 'GET',
      }),
      providesTags: (result, error, vendorId) => [{ type: 'SavedVendors', id: vendorId }],
    }),
  }),
});

export const {
  useGetSavedVendorsQuery,
  useSaveVendorMutation,
  useUnsaveVendorMutation,
  useCheckVendorSavedQuery,
} = savedVendorApi; 