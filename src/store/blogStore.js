// store/blogStore.js
import { create } from 'zustand';
import axiosInstance from '../lib/axios';


const useBlogStore = create((set) => ({
  blogs: [],
  currentBlog: null,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,

  // Fetch all blogs and then paginante
  fetchBlogs: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/blogs?page=${page}&limit=${limit}`);
      set({
        blogs: data.blogs,
        currentPage: data.page,
        totalPages: data.pages,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // Fetch single blog by slug
  fetchBlogBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/blogs/${slug}`);
      set({ currentBlog: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Create new blog
  createBlog: async (blogData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/blogs', blogData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        transformRequest: [(data) => JSON.stringify(data)], // Ensure proper JSON
      });
  
      const newBlog = response.data;
      
      set((state) => ({ 
        blogs: [newBlog, ...state.blogs], 
        loading: false 
      }));
      
      return newBlog;
      
    } catch (err) {
      let errorMessage = 'Failed to create blog';
      
      if (err.response) {
        console.error('Server response:', {
          status: err.response.status,
          data: err.response.data
        });
        errorMessage = err.response.data?.error || err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'No response from server - check your connection';
      } else {
        console.error('Request setup error:', err.message);
        errorMessage = `Request error: ${err.message}`;
      }
      
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  // store/blogStore.js
searchBlogs: async (query) => {
  set({ loading: true, error: null });
  try {
    const { data } = await axiosInstance.get(`/blogs/search?q=${encodeURIComponent(query)}`);
    set({
      blogs: data,
      currentPage: 1,
      totalPages: 1,
      loading: false,
    });
  } catch (err) {
    set({
      error: err.response?.data?.message || err.message,
      loading: false,
    });
  }
},

  // Delete a blog by slug
  deleteBlog: async (slug) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/blogs/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.slug !== slug),
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      return false;
    }
  },
}));

export default useBlogStore;
