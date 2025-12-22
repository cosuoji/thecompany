import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { tokenStorage } from "../lib/tokenStorage";

let isRefreshing = false;

export const useUserStore = create((set, get) => ({
  user: null,
  cart: null,
  wishlist: [],
  wishlistProducts: [],
  addresses: [],
  orders: [],
  loading: false,
  checkingAuth: true,

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



  // 🔁 Refresh token (used by axios interceptor)
  // refreshToken: async () => {
  //   if (isRefreshing) {
  //     return Promise.reject(new Error("Refresh already in progress"));
  //   }

  //   isRefreshing = true;
  //   set({ checkingAuth: true });

  //   try {
  //     await axiosInstance.post(
  //       "/auth/refresh-token",
  //       {},
  //       { _shouldRetry: false }
  //     );
  //   } catch (err) {
  //     set({
  //       user: null,
  //       cart: null,
  //       wishlist: [],
  //       orders: [],
  //     });
  //     throw err;
  //   } finally {
  //     isRefreshing = false;
  //     set({ checkingAuth: false });
  //   }
  // },

  // ✅ LOGIN
login: async (email, password) => {
  set({ loading: true });

  try {
    const res = await axiosInstance.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    if (isIOS() && res.data?.refreshToken) {
      tokenStorage.set(
        res.data.accessToken,
        res.data.refreshToken
      );
    }

    if (res.data?._id) {
      await get().fetchUserData();
      set({ loading: false });
      return true;
    }

    throw new Error("Login failed");
  } catch (err) {
    set({ user: null, loading: false });
    console.log(err)
    toast.error(err?.response?.data?.message || "Invalid credentials");
    return false;
  }
},


  // ✅ SIGNUP
  signup: async (formData) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post(
        "/auth/signup",
        formData,
        { withCredentials: true }
      );

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

  tokenStorage.clear();

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
    
  
}));


