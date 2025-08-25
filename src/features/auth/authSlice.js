import { createSlice } from "@reduxjs/toolkit";

// Check if token is valid (optional enhancement for JWTs)
const isTokenValid = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

// Load user and token from localStorage
const loadUserFromStorage = () => {
  if (typeof window === "undefined") {
    // Running on server – no localStorage
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    };
  }
  const token = window.localStorage.getItem("token") ?? "";
  const refreshToken = window.localStorage.getItem("refreshToken") ?? "";
  const userStr = window.localStorage.getItem("user") ?? "";

  let user = null;

  try {
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (_) {
    console.warn("Invalid JSON in localStorage for user:", userStr);
    localStorage.removeItem("user");
  }

  const isValid = token && user && user.id && isTokenValid(token);

  return {
    user: isValid ? user : null,
    token: isValid ? token : null,
    refreshToken: isValid ? refreshToken : null,
    isAuthenticated: isValid,
  };
};

const { user, token, refreshToken, isAuthenticated } = loadUserFromStorage();

const initialState = {
  user,
  token,
  refreshToken,
  isAuthenticated,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      if (token && isTokenValid(token)) {
        state.token = token;
        state.refreshToken = refreshToken;
        state.user = user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
    startUpdateProfile: (state) => {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateProfileSuccess: (state, action) => {
      state.user = action.payload;
      state.updateLoading = false;
      state.updateError = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateProfileFailure: (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
      state.updateError = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
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
} = authSlice.actions;

export default authSlice.reducer;