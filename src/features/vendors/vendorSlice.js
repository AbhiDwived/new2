import { createSlice } from '@reduxjs/toolkit';

// Load vendor from localStorage if available
const loadVendorFromStorage = () => {
  try {
    const vendorStr = "" // "" // localStorage.getItem('vendor');
    const token = "" // localStorage.getItem('vendorToken');
    const refreshToken = "" //localStorage.getItem('vendorRefreshToken');
    const parsed = vendorStr ? JSON.parse(vendorStr) : null;
    if (parsed?._id && !parsed.id) {
      parsed.id = parsed._id;
    }
    return {
      vendor: parsed,
      token,
      refreshToken,
      isAuthenticated: !!token
    };
  } catch (e) {
    console.error("Failed to parse vendor data:", e);
    return {
      vendor: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false
    };
  }
};

const initialState = {
  ...loadVendorFromStorage(),
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorCredentials: (state, action) => {
      let { token, refreshToken, vendor } = action.payload;

      // Ensure the vendor object always has role: 'vendor'
      if (vendor && vendor.role !== 'vendor') {
        vendor = { ...vendor, role: 'vendor' };
      }

      state.token = token;
      state.refreshToken = refreshToken;
      state.vendor = vendor;
      state.isAuthenticated = true;

      localStorage.setItem('vendorToken', token);
      localStorage.setItem('vendorRefreshToken', refreshToken);
      localStorage.setItem('vendor', JSON.stringify(vendor));
    },
    logoutVendor: (state) => {
      state.vendor = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorRefreshToken');
      localStorage.removeItem('vendor');
    },
    clearVendorError: (state) => {
      state.error = null;
    },
  },
});

export const { setVendorCredentials, logoutVendor, clearVendorError } = vendorSlice.actions;

export default vendorSlice.reducer;