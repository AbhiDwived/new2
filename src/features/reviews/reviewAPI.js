import { api } from '@/services/api';

export const reviewAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendorReviews: builder.query({
      query: (vendorId) => `/reviews/vendor/${vendorId}`,
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, ...reviewData }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
    }),
    getVendorsReviewStats: builder.query({
      query: (vendorIds) => {
        const validVendorIds = vendorIds.filter(id => id && id.trim() !== '');
        if (validVendorIds.length === 0) {
          throw new Error('No valid vendor IDs provided');
        }
        return `/reviews/stats?vendorIds=${validVendorIds.join(',')}`;
      },
    }),
    getReportedReviews: builder.query({
      query: () => '/reviews/reported',
    }),
    reportReview: builder.mutation({
      query: ({ reviewId, reason }) => ({
        url: `/reviews/${reviewId}/report`,
        method: 'PATCH',
        body: { reason },
      }),
    }),
    approveReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/approve`,
        method: 'PATCH',
      }),
      transformResponse: (response) => {
        if (response?.message) return response;
        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data?.message) return { error: response.data.message };
        return { error: 'Failed to approve review.' };
      },
    }),
    adminDeleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/admin/${reviewId}`,
        method: 'DELETE',
      }),
    }),
    getAllReviews: builder.query({
      query: () => '/reviews/all',
    }),
    holdReview: builder.mutation({
      query: ({ reviewId, reason }) => ({
        url: `/reviews/${reviewId}/hold`,
        method: 'PATCH',
        body: { reason },
      }),
      transformResponse: (response) => {
        if (response?.message) return response;
        return response;
      },
      transformErrorResponse: (response) => {
        if (response?.data?.message) return { error: response.data.message };
        return { error: 'Failed to put review on hold.' };
      },
    }),
  }),
});

export const { useGetVendorReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation, useGetVendorsReviewStatsQuery, useGetReportedReviewsQuery, useReportReviewMutation, useApproveReviewMutation, useAdminDeleteReviewMutation, useGetAllReviewsQuery, useHoldReviewMutation } = reviewAPI;
