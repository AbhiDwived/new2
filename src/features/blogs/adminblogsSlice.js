import { createSlice } from '@reduxjs/toolkit';

// Optional: if you want to persist some blog-related info in localStorage (e.g. last viewed blog id)
// You can skip localStorage here if not needed

const initialState = {
  blogs: [],           // list of blogs fetched
  currentBlog: null,   // single blog details
  loading: false,
  error: null,

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setBlogsSuccess: (state, action) => {
      state.blogs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setBlogsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },

    startCreateBlog: (state) => {
      state.createLoading = true;
      state.createError = null;
    },
    createBlogSuccess: (state, action) => {
      state.blogs.unshift(action.payload); // add new blog to start of list
      state.createLoading = false;
      state.createError = null;
    },
    createBlogFailure: (state, action) => {
      state.createLoading = false;
      state.createError = action.payload;
    },

    startUpdateBlog: (state) => {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateBlogSuccess: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      if(state.currentBlog && state.currentBlog._id === action.payload._id) {
        state.currentBlog = action.payload;
      }
      state.updateLoading = false;
      state.updateError = null;
    },
    updateBlogFailure: (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    },

    startDeleteBlog: (state) => {
      state.deleteLoading = true;
      state.deleteError = null;
    },
    deleteBlogSuccess: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      if (state.currentBlog && state.currentBlog._id === action.payload) {
        state.currentBlog = null;
      }
      state.deleteLoading = false;
      state.deleteError = null;
    },
    deleteBlogFailure: (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },

    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    }
  },
});

export const {
  setLoading,
  setBlogsSuccess,
  setBlogsFailure,
  setCurrentBlog,

  startCreateBlog,
  createBlogSuccess,
  createBlogFailure,

  startUpdateBlog,
  updateBlogSuccess,
  updateBlogFailure,

  startDeleteBlog,
  deleteBlogSuccess,
  deleteBlogFailure,

  clearError,
} = blogsSlice.actions;

export default blogsSlice.reducer;
