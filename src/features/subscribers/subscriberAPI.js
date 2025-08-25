import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscriberApi = createApi({
  reducerPath: 'subscriberApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Subscribers'],
  endpoints: (builder) => ({
    getAllSubscribers: builder.query({
      query: () => '/subscriber/all',
      providesTags: ['Subscribers']
    }),
    subscribe: builder.mutation({
      query: (email) => ({
        url: '/subscriber/subscribe',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Subscribers']
    }),
    unsubscribe: builder.mutation({
      query: (email) => ({
        url: '/subscriber/unsubscribe',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Subscribers']
    }),
    updateSubscriberStatus: builder.mutation({
      query: ({ subscriberId, isActive }) => ({
        url: `/subscriber/${subscriberId}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Subscribers']
    }),
    deleteSubscriber: builder.mutation({
      query: (subscriberId) => ({
        url: `/subscriber/${subscriberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscribers']
    }),
  }),
});

export const {
  useGetAllSubscribersQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} = subscriberApi; 