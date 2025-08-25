import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const budgetApi = createApi({
  reducerPath: 'budgetApi',
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
  tagTypes: ['Budget'],
  endpoints: (builder) => ({
    // Get user's budget
    getUserBudget: builder.query({
      query: () => ({
        url: '/budget',
        method: 'GET',
      }),
      providesTags: ['Budget'],
    }),

    // Add a budget item
    addBudgetItem: builder.mutation({
      query: (itemData) => ({
        url: '/budget/item',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Update a budget item
    updateBudgetItem: builder.mutation({
      query: ({ itemId, itemData }) => ({
        url: `/budget/item/${itemId}`,
        method: 'PUT',
        body: itemData,
      }),
      invalidatesTags: ['Budget'],
    }),

    // Delete a budget item
    deleteBudgetItem: builder.mutation({
      query: (itemId) => ({
        url: `/budget/item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budget'],
    }),
  }),
});

export const {
  useGetUserBudgetQuery,
  useAddBudgetItemMutation,
  useUpdateBudgetItemMutation,
  useDeleteBudgetItemMutation,
} = budgetApi; 