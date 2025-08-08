import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/products',
  '/product/:id',
  '/magazine',
  '/blog',
  '/store',
  "/store/shoes/:slug"
];

export const useUserStore = create((set, get) => ({
  user: null,
  cart: null,
  wishlist: [],
  wishlistProducts: [],
  addresses: [],
  orders: [],
  loading: false,
  checkingAuth: true,
  _initialized: false,

  init: async () => {
    const store = get();
    if (store._initialized) return;
  
    setupAxiosInterceptor();
  
    try {
      await store.checkAuth(); // Always try to check auth
    } catch (err) {
      set({ user: null, checkingAuth: false });
    }
  
    set({ _initialized: true });
  },
  
  checkAuth: async (force = false) => {
    console.log("🔍 Starting checkAuth");
  
    if (get().user && !force) {
      console.log("✅ Already authenticated user");
      set({ checkingAuth: false });
      return;
    }
  
    set({ checkingAuth: true });
    console.log("🔄 checkingAuth set to true");
  
    try {
      await get().fetchUserData(); // This may fail
      console.log("✅ fetchUserData succeeded");
    } catch (err) {
      console.error("❌ fetchUserData failed in checkAuth:", err);
      set({ user: null, checkingAuth: false });
    } finally {
      console.log("🟢 Reached finally block in checkAuth");
      set({ checkingAuth: false });
    }
  },  
  

  refreshToken: async () => {
    const state = get();
    if (state.checkingAuth || isRefreshing) {
      return Promise.reject(new Error("Refresh already in progress"));
    }
  
    set({ checkingAuth: true });
    isRefreshing = true;
  
    try {
      const res = await axiosInstance.post("/auth/refresh-token", {}, {
        _shouldRetry: false // prevent infinite loop
      });
  
      return res.data;
    } catch (err) {
      console.error("❌ Refresh token failed", err);
      // Force logout if refresh fails
      set({
        user: null,
        cart: null,
        wishlist: [],
        orders: [],
      });
      throw err;
    } finally {
      isRefreshing = false;
      set({ checkingAuth: false });
    }
  },  

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      // iOS cookie-block fallback
    await new Promise(r => setTimeout(r, 300));
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const hasCookie = document.cookie.includes('refreshToken=');
    if (isIOS && !hasCookie && res.data?.refreshToken) {
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
      if (res.data?._id) {
        // ✅ After successful login, fetch full user-related data including orders
        await get().fetchUserData(); // call the fetchUserData from the store

        set({ loading: false });
        return true;
      }

      toast.error("Login failed: No user data returned.");
      return false;
  
    } catch (err) {
      set({ user: null, loading: false, checkingAuth: false });
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  },
  
  signup: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);

      // iOS cookie-block fallback
      await new Promise(r => setTimeout(r, 300));
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      const hasCookie = document.cookie.includes('refreshToken=');
      if (isIOS && !hasCookie && res.data?.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
  
      if (res.data?._id) {
        // ✅ Make a quick call to check cookies are now valid
        await axiosInstance.get("/auth/profile"); // force cookie sync
  
        // ✅ Now fetch full user data
        await get().fetchUserData();
  
        toast.success("Signup successful! Please update your profile information");
        set({ loading: false });
  
        return true;
      }
  
      toast.error("Signup failed: No user data returned.");
      set({ loading: false });
      return false;
  
    } catch (err) {
      set({ user: null, loading: false, checkingAuth: false });
      toast.error(err.response?.data?.message || "Signup failed");
      return false;
    }
  },
  
  
  
  

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      
    } catch (_) {}
    set({ user: null, cart: null, addresses: [], orders: [] });
  },
  fetchUserData: async () => {
    try {
      set({ loading: true });
  
      const promises = [
        axiosInstance.get('/auth/profile'),
        axiosInstance.get('/cart'),
        axiosInstance.get('/user/wishlist/products'),
      ];
  
      if (get().orders.length === 0) {
        promises.push(axiosInstance.get('/orders/myorders'));
      } else {
        promises.push(Promise.resolve({ data: get().orders }));
      }
  
      const [user, cart, wishlist, orders] = await Promise.all(promises);
  
      set({
        user: user.data,
        cart: cart.data,
        wishlist: wishlist.data,
        orders: orders.data,
        loading: false,
      });
    } catch (err) {
      console.error('❌ fetchUserData error:', err);
    set({
      user: null,
      cart: null,
      wishlist: [],
      orders: [],
      loading: false,
    });
    throw err; // allow checkAuth to catch it
  }
  },
  addToWishlist: async (productId) => {
    try {
      set({ loading: true });
      
      // Optimistic update
      set(state => ({
      user: {
        ...state.user,
        wishlist: [...(state.user?.wishlist || []), productId]
      },
      wishlistProducts: [
        ...state.wishlistProducts,
        { _id: productId } // Temporary placeholder until we fetch full product
      ]
      }));
    
      const res = await axiosInstance.post('/user/wishlist', { productId });
    
      // Proper update after API response
      set({
      wishlist: res.data,
      loading: false
      });
    
      // Fetch updated user data to ensure everything is in sync
      await get().fetchUserData();
      
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      // Rollback on error
      set(state => ({
      user: {
        ...state.user,
        wishlist: state.user?.wishlist?.filter(id => id !== productId)
      },
      wishlistProducts: state.wishlistProducts.filter(p => p._id !== productId),
      loading: false
      }));
      
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
    },
    removeFromWishlist: async (productId) => {
    try {
      set({ loading: true });
      
      // Optimistic update
      set(state => ({
      user: {
        ...state.user,
        wishlist: state.user?.wishlist?.filter(id => id !== productId)
      },
      wishlistProducts: state.wishlistProducts.filter(p => p._id !== productId)
      }));
    
      const { data: updatedWishlist } = await axiosInstance.delete(`/user/wishlist/${productId}`);
    
      // Proper update after API response
      set({
      wishlist: updatedWishlist,
      loading: false
      });
    
      // Fetch updated user data to ensure everything is in sync
      await get().fetchUserData();
      
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      // Rollback on error
      set(state => ({
      user: {
        ...state.user,
        wishlist: [...(state.user?.wishlist || []), productId]
      },
      wishlistProducts: [
        ...state.wishlistProducts,
        { _id: productId } // Temporary placeholder
      ],
      loading: false
      }));
      
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return false;
    }
    },
    addAddress: async (addressData) => {
      try {
        set({ loading: true });
        const res = await axiosInstance.post('/user/address', addressData);
  
        set(state => ({
          user: {
            ...state.user,
            addresses: res.data
          },
          loading: false
        }));
        return res.data;
      } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || 'Failed to add address');
        throw error;
      }
    },
  
    updateAddress: async (addressId, addressData) => {
      try {
        set({ loading: true });
        const res = await axiosInstance.put(`/user/address/${addressId}`, addressData);
  
        set(state => ({
          user: {
            ...state.user,
            addresses: res.data
          },
          loading: false
        }));
        toast.success('Address updated successfully');
        return res.data;
      } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || 'Failed to update address');
        throw error;
      }
    },
  
    deleteAddress: async (addressId) => {
      try {
        set({ loading: true });
        const res = await axiosInstance.delete(`/user/address/${addressId}`);
  
        set(state => ({
          user: {
            ...state.user,
            addresses: res.data
          },
          loading: false
        }));
        toast.success('Address deleted successfully');
        return res.data;
      } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || 'Failed to delete address');
        throw error;
      }
    },
  
    updateProfile: async (profileData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put('/user/profile', profileData);
      set(state => ({
      user: {
        ...state.user,
        ...res.data
      },
      loading: false
      }));
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
    },
  
    setDefaultAddress: async (addressId) => {
      try {
        set({ loading: true });
        const res = await axiosInstance.put(`/user/address/${addressId}/set-default`);
  
        set(state => ({
          user: {
            ...state.user,
            addresses: res.data
          },
          loading: false
        }));
        toast.success('Default address updated');
        return res.data;
      } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || 'Failed to set default address');
        throw error;
      }
    },
    forgotPassword: async (email) => {
      try {
        const res = await axiosInstance.post('/auth/forgot-password', { email });
        toast.success(res.data.message || 'Reset link sent to your email');
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send reset link');
        throw err;
      }
    },
    
    resetPassword: async (token, password) => {
      try {
        const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
        toast.success(res.data.message || 'Password reset successfully');
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Reset failed');
        throw err;
      }
    },
    
  
}));

// Axios Interceptor Setup
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

function setupAxiosInterceptor() {
  // 1) REQUEST interceptor (new)
  axiosInstance.interceptors.request.use((cfg) => {
    const hasCookie = document.cookie.includes('accessToken=');
    if (!hasCookie) {
      const fb = localStorage.getItem('refreshToken');
      if (fb) cfg.headers['Authorization'] = `Bearer ${fb}`;
    }
    return cfg;
  });

  axiosInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;
      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url === '/auth/refresh-token'
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await useUserStore.getState().refreshToken();
        return axiosInstance(originalRequest);
      } catch (err) {
        console.warn("🔁 Token refresh failed, logging out...");
        useUserStore.getState().logout();
        return Promise.reject(err);
      }
    }
  );
}

// Call `init()` at app start
useUserStore.getState().init();
