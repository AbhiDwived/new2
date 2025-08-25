import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1', // Updated URL with v1 prefix
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),

    //getUserProfile
    getUserProfile: builder.query({
      query: () => `user/UserProfile`,
    }),

    // Get specific user profile by ID
    getUserProfileById: builder.query({
      query: (userId) => {
        console.log('Fetching user profile for ID:', userId);
        return {
          url: `user/profile/${userId}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => {
        console.log('User profile API response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('User profile API error:', response);
        return response;
      }
    }),

    // Verify OTP after registration
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    // Resend OTP for registration
    resendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // Resend OTP for password reset
    resendPasswordResetOtp: builder.mutation({
      query: ({ userId }) => ({
        url: "/user/resend-password-reset-otp",
        method: "POST",
        body: { userId },
      }),
    }),

    // Login User
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/user/forgot_password",
        method: "POST",
        body: emailData,
      }),
    }),

    // Verify OTP for password reset
    verifyPasswordReset: builder.mutation({
      query: ({ userId, otp }) => ({
        url: "/user/verify_password_reset",
        method: "POST",
        body: { userId, otp },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: "/user/reset_password",
        method: "POST",
        body: { userId, newPassword },
      }),
    }),

    // Update Password
    updatePassword: builder.mutation({
      query: ({ userId, currentPassword, newPassword }) => ({
        url: `/user/update-password/${userId}`,
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    // Update Profile
    updateProfile: builder.mutation({
      query: ({ userId, profileData }) => ({
        url: `/user/update-profile/${userId}`,
        method: "PUT",
        body: profileData,
      }),
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/user/delete/${userId}`,
        method: "DELETE",
      }),
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
    // User Inquiries
    getUserInquiries: builder.mutation({
      query: (userId) => ({
        url: "/user/getuser_inquiryList",
        method: "POST",
        body: { userId },
      }),
    }),

    //add user Inquiry


    addUserInquiryMessage: builder.mutation({
      query: ({ userId, vendorId, message, name, phone, email, weddingDate }) => ({
        url: `/user/userInquiryMessage/${userId}`,
        method: "POST",
        body: {
          vendorId,
          message,
          name,
          phone,
          email,
          weddingDate,
        },
      }),

    }),





    //UserContact---POST
    submitContactForm: builder.mutation({
      query: (userData) => ({
        url: "/user/contact",
        method: "POST",
        body: userData,
      }),
    }),

    
  }),
});

// Export hooks for usage in components
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResendPasswordResetOtpMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useVerifyPasswordResetMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
  useGetUserInquiriesMutation,
  // useSendUserReplyMutation,
  useSubmitContactFormMutation,
  useGetUserProfileQuery,
  useGetUserProfileByIdQuery,
  useAddUserInquiryMessageMutation,
} = authApi;
