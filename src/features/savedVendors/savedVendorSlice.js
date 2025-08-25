import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  count: 0,
  loading: false,
  error: null,
};

const savedVendorSlice = createSlice({
  name: 'savedVendor',
  initialState,
  reducers: {
    // Set saved vendors
    setSavedVendors: (state, action) => {
      state.vendors = action.payload.vendors || [];
      state.count = action.payload.count || 0;
      state.loading = false;
      state.error = null;
    },
    
    // Add a vendor to saved list (optimistic update)
    addSavedVendor: (state, action) => {
      state.vendors.unshift(action.payload);
      state.count += 1;
    },
    
    // Remove a vendor from saved list (optimistic update)
    removeSavedVendor: (state, action) => {
      const vendorId = action.payload;
      state.vendors = state.vendors.filter(vendor => vendor.id !== vendorId);
      state.count -= 1;
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
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetSavedVendorState: () => initialState,
  },
});

export const {
  setSavedVendors,
  addSavedVendor,
  removeSavedVendor,
  setLoading,
  setError,
  clearError,
  resetSavedVendorState,
} = savedVendorSlice.actions;

export default savedVendorSlice.reducer; 