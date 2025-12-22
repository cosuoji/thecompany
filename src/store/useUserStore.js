import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance, { setupAxiosInterceptor } from "../lib/axios";


export const useUserStore = create((set, get) => ({
  user: null,
  cart: null,
  wishlist: [],
  wishlistProducts: [],
  addresses: [],
  orders: [],
  loading: false,
  checkingAuth: true,


    init: async () => {
    const store = get();
    if (store._initialized) return;

    setupAxiosInterceptor();
    try {
      await store.checkAuth();
    } catch {
      set({ user: null });
    }
    set({ _initialized: true });
  },

  // ✅ Check auth on app load
checkAuth: async () => {
  set({ checkingAuth: true });

  try {
    await get().fetchUserData();
  } catch {
    set({ user: null });
  } finally {
    set({ checkingAuth: false });
  }
},




  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/login', {email, password}, {
        withCredentials: true,
        _shouldRetry: false,
      });
         // --- NEW TEST CODE ---
    const isMobileSafari =
      /iP(hone|od|ad)/.test(navigator.userAgent) &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent);

    await new Promise(r => setTimeout(r, 300)); // small delay so browser can set cookie
    const hasCookie = document.cookie.includes('refreshToken=');
    if (isMobileSafari && !hasCookie && res.data.refreshToken) {
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
  
      await get().fetchUserData();
      set({ loading: false });
      return true;
  
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  },
  


  // ✅ SIGNUP
// ✅ SIGNUP
  signup: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData, { withCredentials: true });

      // iOS fallback
      if (/iP(hone|od|ad)/.test(navigator.userAgent) && res.data?.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      if (res.data?._id) {
        await get().fetchUserData();
        toast.success("Signup successful!");
        set({ loading: false });
        return true;
      }

      throw new Error("Signup failed");
    } catch (err) {
      set({ user: null, loading: false });
      toast.error(err?.response?.data?.message || "Signup failed");
      return false;
    }
  },

  // 🚪 LOGOUT
logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (_) {}

  set({
    user: null,
    cart: null,
    addresses: [],
    orders: [],
  });
},


  // 👤 FETCH USER DATA
fetchUserData: async () => {
  try {
    const userRes = await axiosInstance.get("/auth/profile");

    set({ user: userRes.data });

    // secondary data — failures shouldn't log user out
    const [cart, wishlist, orders] = await Promise.allSettled([
      axiosInstance.get("/cart"),
      axiosInstance.get("/user/wishlist/products"),
      axiosInstance.get("/orders/myorders"),
    ]);

    set({
      cart: cart.status === "fulfilled" ? cart.value.data : null,
      wishlist: wishlist.status === "fulfilled" ? wishlist.value.data : [],
      orders: orders.status === "fulfilled" ? orders.value.data : [],
      loading: false,
    });
  } catch (err) {
    // ONLY auth failure logs out
    set({
      user: null,
      cart: null,
      wishlist: [],
      orders: [],
      loading: false,
    });
    throw err;
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

    refreshToken: async () => {
  try {
    // mobile Safari fallback
    const fallbackToken = localStorage.getItem('refreshToken');
    if (fallbackToken) {
      await axiosInstance.post(
        '/auth/refresh-token',
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${fallbackToken}` },
        }
      );
    } else {
      await axiosInstance.post(
        '/auth/refresh-token',
        {},
        { withCredentials: true }
      );
    }
  } catch (err) {
    localStorage.removeItem('refreshToken');
    await get().logout();
    throw err;
  }
},
  
    
  
}));


