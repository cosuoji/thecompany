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
  orders: [],
  addresses: [],
  loading: false,
  checkingAuth: true,
  _initialized: false,

  init: async () => {
    const store = get();
    if (store._initialized) return;

    setupAxiosInterceptor();
    const hasToken = localStorage.getItem('accessToken');

    if (hasToken) {
      try {
        await store.checkAuth();
      } catch (_) {
        // fallback
      }
    } else {
      set({ checkingAuth: false });
    }

    set({ _initialized: true });
  },

  checkAuth: async (force = false) => {
    if (get().user && !force) {
      set({ checkingAuth: false });
      return;
    }

    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({
        user: res.data.user,
        addresses: res.data.addresses || [],
        orders: res.data.orders || [],
        checkingAuth: false
      });
    } catch (error) {
      set({
        user: null,
        addresses: [],
        orders: [],
        checkingAuth: false
      });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return Promise.reject('Refresh already in progress');
    set({ checkingAuth: true });

    try {
      const res = await axiosInstance.post("/auth/refresh-token", {}, {
        _shouldRetry: false
      });
      set({ checkingAuth: false });
      return res.data;
    } catch (err) {
      set({
        user: null,
        checkingAuth: false,
        cart: null,
        addresses: [],
        orders: [],
      });
      toast.error('Session expired. Please login again.');
      throw err;
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const userData = res.data.user;

      if (userData) {
        set({ user: userData, loading: false });
        return true;
      }

      const profile = await axiosInstance.get("/auth/profile");
      set({ user: profile.data.user, loading: false });
      return true;
    } catch (err) {
      set({ user: null, loading: false, checkingAuth: false });
      toast.error(err.response?.data?.message || "Login failed");
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
      const [user, cart, wishlist] = await Promise.all([
        axiosInstance.get('/auth/profile'),
        axiosInstance.get('/cart'),
        axiosInstance.get('/user/wishlist/products')
      ]);
      set({
        user: user.data,
        cart: cart.data,
        wishlist: wishlist.data,
        loading: false
      });
    } catch (err) {
      set({ loading: false });
      console.error('fetchUserData failed:', err);
    }
  },

  // All other methods (cart, wishlist, orders, address, etc.) remain unchanged...
  // You can reuse your own versions directly here.
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
  axiosInstance.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;
      const currentPath = window.location.pathname;

      const isPublic = publicRoutes.some(route =>
        new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$').test(currentPath)
      );

      if (isPublic) return Promise.reject(error);

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await useUserStore.getState().refreshToken();
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        useUserStore.getState().logout();
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

// Call `init()` at app start
useUserStore.getState().init();
