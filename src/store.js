import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authReducer from '@/features/auth/authSlice';
import vendorReducer from '@/features/vendors/vendorSlice';
import adminReducer from '@/features/admin/adminSlice';
import budgetReducer from '@/features/budget/budgetSlice';
import bookingReducer from '@/features/bookings/bookingSlice';
import checklistReducer from '@/features/checklist/checklistSlice';
import savedVendorReducer from '@/features/savedVendors/savedVendorSlice';
import guestReducer from '@/features/guests/guestSlice';

// Import RTK Query APIs
import { apiSlice } from '@/services/api';
import { vendorApi } from '@/features/vendors/vendorAPI';
import { authApi } from '@/features/auth/authAPI';
import { adminApi } from '@/features/admin/adminAPI';
import { blogsApi } from '@/features/blogs/blogsAPI';
import { adminBlogsApi } from '@/features/blogs/adminblogsAPI';
import { budgetApi } from '@/features/budget/budgetAPI';
import { checklistApi } from '@/features/checklist/checklistAPI';
import { savedVendorApi } from '@/features/savedVendors/savedVendorAPI';
import { guestApi } from '@/features/guests/guestAPI';
import { subscriberApi } from '@/features/subscribers/subscriberAPI';
import { eventApi } from '@/features/events/eventAPI';


export const store = configureStore({
  reducer: {
    // Regular slices
    auth: authReducer,
    vendor: vendorReducer,
    adminAuth: adminReducer,
    budget: budgetReducer,
    booking: bookingReducer,
    checklist: checklistReducer,
    savedVendor: savedVendorReducer,
    guest: guestReducer,

    // RTK Query API slices
    [apiSlice.reducerPath]: apiSlice.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [adminBlogsApi.reducerPath]: adminBlogsApi.reducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [checklistApi.reducerPath]: checklistApi.reducer,
    [savedVendorApi.reducerPath]: savedVendorApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [subscriberApi.reducerPath]: subscriberApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat([
      apiSlice.middleware,
      vendorApi.middleware,
      authApi.middleware,
      adminApi.middleware,
      blogsApi.middleware,
      adminBlogsApi.middleware,
      budgetApi.middleware,
      checklistApi.middleware,
      savedVendorApi.middleware,
      guestApi.middleware,
      subscriberApi.middleware,
      eventApi.middleware,

    ]),
});

setupListeners(store.dispatch);

export default store;
