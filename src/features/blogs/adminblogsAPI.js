import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminBlogsApi = createApi({
  reducerPath: 'adminBlogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/admin/blog',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => '/getallblogs',
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ _id }) => ({ type: 'Blog', id: _id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),

    searchBlogs: builder.query({
      query: (keyword) => `/search?keyword=${encodeURIComponent(keyword)}`,
      providesTags: ['Blog'],
    }),

    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/create',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    getBlogById: builder.query({
      query: (id) => `/getblog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    getBlogBySlug: builder.query({
      query: (slug) => `/getblog-slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/updateblog/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedBlog } = await queryFulfilled;
          
          dispatch(
            adminBlogsApi.util.updateQueryData('getBlogById', id, (draft) => {
              Object.assign(draft, updatedBlog);
            })
          );
          
          dispatch(
            adminBlogsApi.util.updateQueryData('getAllBlogs', undefined, (draft) => {
              if (draft?.blogs) {
                const index = draft.blogs.findIndex(blog => blog._id === id);
                if (index !== -1) {
                  draft.blogs[index] = updatedBlog;
                }
              }
            })
          );
        } catch {
          // If the update fails, the invalidatesTags will handle cache invalidation
        }
      },
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/deleteblog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    getBlogsByCategory: builder.query({
      query: (categoryName) => `/category/${encodeURIComponent(categoryName)}`,
      providesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useSearchBlogsQuery,
  useCreateBlogMutation,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogsByCategoryQuery,
} = adminBlogsApi;
