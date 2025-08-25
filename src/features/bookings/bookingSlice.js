import { createSlice } from '@reduxjs/toolkit';
import { bookingApi } from './bookingAPI';

const initialState = {
  bookings: [],
  totalPlanned: 0,
  totalSpent: 0,
  totalBookingsCount: 0,
  selectedBooking: null,
  loading: false,
  error: null,
  availableVendors: [],
  vendorPackages: [],
  filters: {
    vendorId: '',
    eventType: '',
    dateRange: null,
  }
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    resetBookingState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle getUserBookings
      .addMatcher(
        bookingApi.endpoints.getUserBookings.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        bookingApi.endpoints.getUserBookings.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.bookings = action.payload.data.bookings;
          state.totalPlanned = action.payload.data.totalPlanned;
          state.totalSpent = action.payload.data.totalSpent;
          state.totalBookingsCount = action.payload.data.totalBookingsCount;
        }
      )
      .addMatcher(
        bookingApi.endpoints.getUserBookings.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      // Handle getAvailableVendors
      .addMatcher(
        bookingApi.endpoints.getAvailableVendors.matchFulfilled,
        (state, action) => {
          state.availableVendors = action.payload.data;
        }
      )
      // Handle createBooking
      .addMatcher(
        bookingApi.endpoints.createBooking.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        bookingApi.endpoints.createBooking.matchFulfilled,
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        bookingApi.endpoints.createBooking.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      // Handle deleteBooking
      .addMatcher(
        bookingApi.endpoints.deleteBooking.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        bookingApi.endpoints.deleteBooking.matchFulfilled,
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        bookingApi.endpoints.deleteBooking.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const {
  setSelectedBooking,
  clearSelectedBooking,
  setFilters,
  clearFilters,
  resetBookingState,
} = bookingSlice.actions;

// Selectors
export const selectBookings = (state) => state.booking.bookings;
export const selectTotalPlanned = (state) => state.booking.totalPlanned;
export const selectTotalSpent = (state) => state.booking.totalSpent;
export const selectTotalBookingsCount = (state) => state.booking.totalBookingsCount;
export const selectSelectedBooking = (state) => state.booking.selectedBooking;
export const selectBookingLoading = (state) => state.booking.loading;
export const selectBookingError = (state) => state.booking.error;
export const selectAvailableVendors = (state) => state.booking.availableVendors;
export const selectBookingFilters = (state) => state.booking.filters;

export default bookingSlice.reducer; 