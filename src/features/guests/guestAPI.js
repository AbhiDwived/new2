import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const guestApi = createApi({
  reducerPath: 'guestApi',
  baseQuery: fetchBaseQuery({
<<<<<<< HEAD
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:3000/api/proxy',
    prepareHeaders: async (headers) => {
      const { getSession } = await import('next-auth/react');
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
  tagTypes: ['Guest'],
  endpoints: (builder) => ({
    // Get all guests for the current user
    getUserGuests: builder.query({
      query: () => ({
        url: '/guest',
        method: 'GET',
      }),
      providesTags: ['Guest'],
    }),

    // Add a new guest
    addGuest: builder.mutation({
      query: (guestData) => ({
        url: '/guest',
        method: 'POST',
        body: guestData,
      }),
      invalidatesTags: ['Guest'],
    }),

    // Update guest information
    updateGuest: builder.mutation({
      query: ({ guestId, ...guestData }) => ({
        url: `/guest/${guestId}`,
        method: 'PUT',
        body: guestData,
      }),
      invalidatesTags: ['Guest'],
    }),

    // Update only guest status
    updateGuestStatus: builder.mutation({
      query: ({ guestId, status }) => ({
        url: `/guest/${guestId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Guest'],
    }),

    // Delete a guest
    deleteGuest: builder.mutation({
      query: (guestId) => ({
        url: `/guest/${guestId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Guest'],
    }),
  }),
});

export const {
  useGetUserGuestsQuery,
  useAddGuestMutation,
  useUpdateGuestMutation,
  useUpdateGuestStatusMutation,
  useDeleteGuestMutation,
} = guestApi; 