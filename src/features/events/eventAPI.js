import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().vendor?.token || localStorage.getItem('vendorToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    // Get all events for a vendor
    getVendorEvents: builder.query({
      query: ({ vendorId, month, year, status }) => ({
        url: `/events/${vendorId}`,
        method: 'GET',
        params: { month, year, status }
      }),
      providesTags: ['Events']
    }),

    // Get upcoming events
    getUpcomingEvents: builder.query({
      query: ({ vendorId, limit = 10 }) => ({
        url: `/events/${vendorId}/upcoming`,
        method: 'GET',
        params: { limit }
      }),
      providesTags: ['Events']
    }),

    // Get events by date range
    getEventsByDateRange: builder.query({
      query: ({ vendorId, startDate, endDate }) => ({
        url: `/events/${vendorId}/range`,
        method: 'GET',
        params: { startDate, endDate }
      }),
      providesTags: ['Events']
    }),

    // Get single event
    getEventById: builder.query({
      query: ({ vendorId, eventId }) => ({
        url: `/events/${vendorId}/${eventId}`,
        method: 'GET'
      }),
      providesTags: ['Events']
    }),

    // Create new event
    createEvent: builder.mutation({
      query: ({ vendorId, eventData }) => ({
        url: `/events/${vendorId}`,
        method: 'POST',
        body: eventData
      }),
      invalidatesTags: ['Events']
    }),

    // Update event
    updateEvent: builder.mutation({
      query: ({ vendorId, eventId, eventData }) => ({
        url: `/events/${vendorId}/${eventId}`,
        method: 'PUT',
        body: eventData
      }),
      invalidatesTags: ['Events']
    }),

    // Delete event
    deleteEvent: builder.mutation({
      query: ({ vendorId, eventId }) => ({
        url: `/events/${vendorId}/${eventId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Events']
    })
  })
});

export const {
  useGetVendorEventsQuery,
  useGetUpcomingEventsQuery,
  useGetEventsByDateRangeQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation
} = eventApi; 