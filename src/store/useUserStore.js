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
	// Add all your public routes here
  ];


export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,
	cart: null,
	wishlist: [],
	wishlistProducts: [],
	orders: [],
	  // In your store
_initialized: false,

init: async () => {
	const store = get();
	if (store._initialized) return;

	// Only check auth if we have a token
	if (localStorage.getItem('accessToken')) {
		await store.checkAuth();
	}
	set({ _initialized: true });
},


	
	signup: async ({ email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			toast.error("Passwords do not match");
			return false
		}

		try {
			const res = await axiosInstance.post("/auth/signup", {email, password });
			set({ user: res.data, loading: false });
			return true 
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred");
            set({loading: false})
			return false;
		}
	},
		// userStore.js
		login: async (email, password) => {
			set({ loading: true });
			try {
			  // 1. First authenticate
			  const loginResponse = await axiosInstance.post("/auth/login", { email, password });
			  
			  // 2. Immediately set the user data from login response if available
			  if (loginResponse.data.user) {
				set({
				  user: loginResponse.data.user,
				  loading: false
				});
				return true;
			  }
			  
			  // 3. Fallback to fetching full profile if not in login response
			  const { data } = await axiosInstance.get("/auth/profile");
			  
			  set({
				user: data.user,
				addresses: data.addresses || [],
				orders: data.orders || [],
				loading: false
			  });
			  
			  return true;
			} catch (error) {
			  // Clear all auth state on failure
			  set({ 
				loading: false,
				user: null,
				addresses: [],
				orders: [],
				checkingAuth: false
			  });
			  
			  // Show specific error messages
			  const errorMessage = error.response?.data?.message || 
								 (error.response?.status === 401 ? 
								  'Invalid email or password' : 
								  'Login failed. Please try again.');
			  
			  toast.error(errorMessage);
			  return false;
			}
		  },
	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},
	fetchUserData: async () => {
		try {
		  set({ loading: true });
		  const [userRes, cartRes, wishlistRes, ordersRes] = await Promise.all([
			axiosInstance.get('/auth/profile'),
			axiosInstance.get('/cart'),
			axiosInstance.get('/wishlist'),
			axiosInstance.get('/orders/myorders')
		  ]);
		  
	
		  set({
			user: userRes.data,
			cart: cartRes.data,
			wishlist: wishlistRes.data,
			orders: ordersRes.data,
			loading: false
		  });
		} catch (error) {
		  set({ loading: false });
		  console.error('Failed to fetch user data:', error);
		}
	  },
	
	  addToCart: async (productId, variant = null, quantity = 1) => {
		try {
		  set({ loading: true });
		  const res = await axiosInstance.post('/cart', {
			productId,
			variant,
			quantity
		  });
	
		  set(state => ({
			cart: res.data,
			loading: false
		  }));
		  toast.success('Added to cart');
		  return true;
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.message || 'Failed to add to cart');
		  return false;
		}
	  },
	  updateCartItem: async (itemId, quantity) => {
		try {
		  set({ loading: true });
		  const res = await axiosInstance.put(`/cart/${itemId}`, { quantity });
	
		  set(state => ({
			cart: res.data,
			loading: false
		  }));
		  return true;
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.message || 'Failed to update cart');
		  return false;
		}
	  },

	  removeFromCart: async (itemId) => {
		try {
		  set({ loading: true });
		  const res = await axiosInstance.delete(`/cart/${itemId}`);
	
		  set(state => ({
			cart: res.data,
			loading: false
		  }));
		  toast.success('Removed from cart');
		  return true;
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.message || 'Failed to remove item');
		  return false;
		}
	  },

	    // Wishlist Methods
  addToWishlist: async (productId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/wishlist', { productId });

      set(state => ({
        wishlist: res.data,
        loading: false
      }));
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  },

  removeFromWishlist: async (productId) => {
	try {
	  set({ loading: true });
  
	  const { data: updatedWishlist } = await axiosInstance.delete(`/user/wishlist/${productId}`);
	  console.log(typeof(productId))
	  console.log('Removing productId:', productId)
  
	  set(state => ({
		user: {
		  ...state.user,
		  wishlist: updatedWishlist
		},
		wishlistProducts: updatedWishlist,
		loading: false
	  }));
  
	  toast.success('Removed from wishlist');
	} catch (error) {
	  set({ loading: false });
	  toast.error(error.response?.data?.message || 'Failed to remove item');
	  throw error;
	}
  },
  
   // Order Methods
   createOrder: async (orderData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/orders', orderData);

      set(state => ({
        orders: [res.data, ...state.orders],
        cart: null, // Clear cart after order
        loading: false
      }));
      toast.success('Order placed successfully!');
      return res.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to place order');
      throw error;
    }
  },

 // Address Methods
 getAddresses: async () => {
    try {
      const res = await axiosInstance.get('/user/address');
      set(state => ({
        user: {
          ...state.user,
          addresses: res.data
        }
      }));
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get addresses');
      throw error;
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
      toast.success('Address added successfully');
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
  getOrders: async () => {
	try {
	  set({ loading: true });
	  const res = await axiosInstance.get('/orders/myorders');
	  set({ orders: res.data, loading: false });
	  return res.data;
	} catch (error) {
	  set({ loading: false });
	  throw error;
	}
  },
    // Magazine methods
	fetchMagazines: async () => {
		set({ loading: true });
		try {
		  const res = await api.get('/products/magazines');
		  set({ magazines: res.data, loading: false });
		} catch (error) {
		  set({ loading: false });
		  toast.error('Failed to load magazines');
		}
	  },
	  
	  fetchFeaturedMagazines: async () => {
		set({ loading: true });
		try {
		  const res = await api.get('/products/magazines/featured');
		  set({ featuredMagazines: res.data, loading: false });
		} catch (error) {
		  set({ loading: false });
		}
	},
	fetchWishlistProducts: async () => {
		try {
		  set({ loading: true });
		  const res = await axiosInstance.get('/user/wishlist/products');
		  set({ 
			wishlistProducts: res.data, // Store full products separately
			loading: false
		  });
		  return res.data;
		} catch (error) {
		  set({ loading: false });
		  toast.error('Failed to load wishlist products');
		  throw error;
		}
	  },
  checkAuth: async (force = false) => {
	// Skip if we already have a user and not forcing refresh
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
		checkingAuth: false,
		user: null, 
		loading: false,
	  });
	}
  },
  refreshToken: async () => {
	// Get current state without causing re-renders
	const currentState = get();
	
	// Prevent multiple simultaneous refresh attempts
	if (currentState.checkingAuth) {
	  return Promise.reject(new Error('Refresh already in progress'));
	}
  
	set({ checkingAuth: true });
	
	try {
	  const response = await axiosInstance.post("/auth/refresh-token", {}, {
		// Important: don't retry refresh token attempts
		_shouldRetry: false 
	  });
  
	  set({ checkingAuth: false });
	  return response.data;
	} catch (error) {
	  // Complete auth cleanup
	  set({ 
		user: null,
		addresses: [],
		orders: [],
		checkingAuth: false
	  });
	  
	  // Differentiate between network errors and invalid refresh tokens
	  if (error.response?.status === 401) {
		toast.error('Session expired. Please login again.');
	  }
	  
	  throw error;
	}
  },
      // Add this helper method
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  }
}));

// TODO: Implement the axiosInstance interceptors for refreshing access token

// axiosInstance interceptor for token refresh
let refreshPromise = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
	  if (error) {
		prom.reject(error);
	  } else {
		prom.resolve(token);
	  }
	});
	failedQueue = [];
  };

  

  axiosInstance.interceptors.response.use(
	response => response,
	async error => {
	  const originalRequest = error.config;
	  const currentPath = window.location.pathname;
    
	   // Skip auth checks for public routes
	   if (publicRoutes.some(route => {
		const routePattern = new RegExp('^' + route.replace(/:\w+/g, '\\w+') + '$');
		return routePattern.test(currentPath);
	  })) {
		return Promise.reject(error);
	  }
	  
	  // Only handle 401 errors and avoid infinite loops
	  if (error.response?.status !== 401 || originalRequest._retry) {
		return Promise.reject(error);
	  }
  
	  // If we're already refreshing, add to queue
	  if (isRefreshing) {
		return new Promise((resolve, reject) => {
		  failedQueue.push({ resolve, reject });
		}).then(() => {
		  return axiosInstance(originalRequest);
		}).catch(err => {
		  return Promise.reject(err);
		});
	  }
  
	  // Mark as retrying and start refresh
	  originalRequest._retry = true;
	  isRefreshing = true;
  
	  try {
		await useUserStore.getState().refreshToken();
		
		// Process queued requests
		processQueue(null);
		
		// Retry the original request
		return axiosInstance(originalRequest);
	  } catch (refreshError) {
		// Clear auth state if refresh fails
		useUserStore.getState().logout();
		
		// Reject all queued requests
		processQueue(refreshError);
		
		return Promise.reject(refreshError);
	  } finally {
		isRefreshing = false;
	  }
	}
  );



// Then call this when your app starts
useUserStore.getState().init();