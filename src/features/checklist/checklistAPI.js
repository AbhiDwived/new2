import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

export const checklistApi = createApi({
  reducerPath: 'checklistApi',
  baseQuery: fetchBaseQuery({
<<<<<<< HEAD
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:3000/api/proxy',
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
=======
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
      }
      return headers;
    },
  }),
  tagTypes: ['Checklist'],
  endpoints: (builder) => ({
    // Get user's checklist
    getUserChecklist: builder.query({
      query: () => ({
        url: '/checklist',
        method: 'GET',
      }),
      providesTags: ['Checklist'],
    }),

    // Add a new task
    addChecklistTask: builder.mutation({
      query: (task) => ({
        url: '/checklist/task',
        method: 'POST',
        body: { task },
      }),
      invalidatesTags: ['Checklist'],
    }),

    // Toggle task completion status
    toggleTaskCompletion: builder.mutation({
      query: (taskId) => ({
        url: `/checklist/task/${taskId}/toggle`,
        method: 'PUT',
      }),
      invalidatesTags: ['Checklist'],
    }),

    // Delete a task
    deleteChecklistTask: builder.mutation({
      query: (taskId) => ({
        url: `/checklist/task/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Checklist'],
    }),
  }),
});

export const {
  useGetUserChecklistQuery,
  useAddChecklistTaskMutation,
  useToggleTaskCompletionMutation,
  useDeleteChecklistTaskMutation,
} = checklistApi; 