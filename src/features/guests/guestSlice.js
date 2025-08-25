import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  guests: [],
  loading: false,
  error: null,
};

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    // Set all guests
    setGuests: (state, action) => {
      state.guests = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a guest (optimistic update)
    addGuest: (state, action) => {
      state.guests.unshift(action.payload);
    },

    // Update a guest (optimistic update)
    updateGuest: (state, action) => {
      const { _id, ...updatedData } = action.payload;
      const existingGuest = state.guests.find(guest => guest._id === _id);
      if (existingGuest) {
        Object.assign(existingGuest, updatedData);
      }
    },

    // Update just a guest's status (optimistic update)
    updateGuestStatus: (state, action) => {
      const { guestId, status } = action.payload;
      const existingGuest = state.guests.find(guest => guest._id === guestId);
      if (existingGuest) {
        existingGuest.status = status;
      }
    },

    // Remove a guest (optimistic update)
    removeGuest: (state, action) => {
      const guestId = action.payload;
      state.guests = state.guests.filter(guest => guest._id !== guestId);
    },

    // Set loading state
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Set error state
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset state
    resetGuestState: () => initialState,
  },
});

export const {
  setGuests,
  addGuest,
  updateGuest,
  updateGuestStatus,
  removeGuest,
  setLoading,
  setError,
  clearError,
  resetGuestState,
} = guestSlice.actions;

export default guestSlice.reducer; 