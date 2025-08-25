import { createSlice } from "@reduxjs/toolkit";

// Optional: Check if JWT token is valid
const isTokenValid = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

// Load admin and token from localStorage
const loadAdminFromStorage = () => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem("token");
    const refreshToken = window.localStorage.getItem("adminRefreshToken");
    const adminStr = window.localStorage.getItem("admin");

    let admin = null;

    try {
      if (adminStr && adminStr !== "undefined") {
        admin = JSON.parse(adminStr);
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_) {
      console.warn("Invalid JSON in localStorage for admin:");
      localStorage.removeItem("admin");
    }

    const isValid = token && admin && admin.id && isTokenValid(token);

    return {
      admin: isValid ? admin : null,
      token: isValid ? token : null,
      refreshToken: isValid ? refreshToken : null,
      isAuthenticated: isValid,
    };
  }
  return {
    admin: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const { admin, token, refreshToken, isAuthenticated } = loadAdminFromStorage();

const initialState = {
  admin,
  token,
  refreshToken,
  isAuthenticated,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken, admin } = action.payload;
      if (token && isTokenValid(token)) {
        state.token = token;
        state.refreshToken = refreshToken;
        state.admin = admin;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", token);
        localStorage.setItem("adminRefreshToken", refreshToken);
        localStorage.setItem("admin", JSON.stringify(admin));
      } else {
        state.token = null;
        state.refreshToken = null;
        state.admin = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("admin");
      }
    },
    startUpdateProfile: (state) => {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateProfileSuccess: (state, action) => {
      state.admin = action.payload;
      state.updateLoading = false;
      state.updateError = null;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },
    updateProfileFailure: (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
      state.updateError = null;
      localStorage.removeItem("token");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("admin");
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  startUpdateProfile,
  updateProfileSuccess,
  updateProfileFailure,
  clearUpdateError,
} = adminSlice.actions;

export default adminSlice.reducer;
