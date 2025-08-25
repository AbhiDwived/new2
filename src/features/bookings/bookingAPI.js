import { apiSlice } from '../../services/api.js';

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bookings (Admin)
    getAllBookings: builder.query({
      query: () => '/booking/all',
      providesTags: ['Booking'],
    }),

    // Get user's bookings
    getUserBookings: builder.query({
      query: () => '/booking',
      providesTags: ['Booking'],
    }),

    // Get a single booking by ID
    getBookingById: builder.query({
      query: (bookingId) => `/booking/${bookingId}`,
      providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/booking',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Update a booking
    updateBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/booking/${bookingId}`,
        method: 'PUT',
        body: bookingData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        'Booking',
      ],
    }),

    // Delete a booking
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),

    // Get available vendors for booking
    getAvailableVendors: builder.query({
      query: (category) => ({
        url: '/booking/vendors',
        params: category ? { category } : undefined,
      }),
      providesTags: ['Vendors'],
    }),
  }),
});

// Export the booking API
export const bookingApiSlice = bookingApi;

export const {
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetAvailableVendorsQuery,
} = bookingApi; 