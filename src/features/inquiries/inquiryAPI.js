import { api } from '@/services/api';

export const inquiryAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create inquiry for logged-in users
    createInquiry: builder.mutation({
      query: (data) => ({
        url: '/inquiries',
        method: 'POST',
        body: data,
      }),
    }),

    // Create anonymous inquiry (no login required)
    createAnonymousInquiry: builder.mutation({
      query: (data) => ({
        url: '/inquiries/anonymous',
        method: 'POST',
        body: data,
      }),
    }),

    // Get vendor inquiries (vendor dashboard)
    getVendorInquiries: builder.query({
      query: (vendorId) => `/inquiries/vendor/${vendorId}`,
      providesTags: ['Inquiries'],
    }),

    // Reply to inquiry (vendor)
    replyToInquiry: builder.mutation({
      query: (data) => ({
        url: '/inquiries/reply',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inquiries'],
    }),

    // Get all anonymous inquiries for a vendor
    getAnonymousInquiries: builder.query({
      query: (vendorId) => `/inquiries/anonymous/${vendorId}`,
      providesTags: ['AnonymousInquiries'],
    }),
  }),
});

export const {
  useCreateInquiryMutation,
  useCreateAnonymousInquiryMutation,
  useGetVendorInquiriesQuery,
  useReplyToInquiryMutation,
  useGetAnonymousInquiriesQuery,
} = inquiryAPI;
