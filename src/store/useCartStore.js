// stores/useCartStore.js
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  
  // Fetch user's cart
  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get('/cart');
      set({ cart: data, loading: false });
    } catch (error) {
      set({ cart: null, loading: false });
    }
  },
  
  // Add item to cart (handles both products and magazines)
  addToCart: async (productId, productType = 'product', variant = null, quantity = 1) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/cart', {
        productId,
        productType,
        variant,
        quantity,
      });
      
      set({ cart: data, loading: false });
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  },

// In your useUserStore or cart store
addToCartShoes: async (productId, variant = null, quantity = 1) => {
  set({ loading: true });
  try {
    // Validate required shoe variant properties
    console.log(variant.color)
    if (!variant || !variant.color._id || !variant.size) {
      throw new Error('Please select both color and size');
    }

    const { data } = await axiosInstance.post('/cart/shoes', {
      productId,
      variant,
      quantity
    });

    // Update both cart and optimistic UI updates
    set(state => ({
      cart: data,
      loading: false,
      // Optional: Update shoe-specific state if needed
      selectedShoeOptions: {
        ...state.selectedShoeOptions,
        [productId]: variant
      }
    }));

    toast.success('Shoes added to cart!');
    return true;
  } catch (error) {
    set({ loading: false });
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to add shoes to cart';
    toast.error(errorMessage);
    return false;
  }
},
  
  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    set(state => ({
      ...state,
      loading: true,
      // Preserve image references during update
      cart: state.cart && {
        ...state.cart,
        items: state.cart.items.map(item => 
          item._id === itemId 
            ? { ...item, quantity, product: item.product } // Keep product reference
            : item
        )
      }
    }));
  
    try {
      const { data } = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      set({ cart: data, loading: false });
    } catch (error) {
      set(state => ({ ...state, loading: false }));
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  },
  
  // Remove item from cart
    // useCartStore.js
    removeFromCart: async (itemId) => {
      set({ loading: true });
      try {
        console.log('Attempting to remove item:', itemId);
        
        const { data } = await axiosInstance.delete(`/cart/${itemId}`);
        
        console.log('Updated cart:', data);
        set({ cart: data, loading: false });
        toast.success('Item removed from cart');
      } catch (error) {
        console.error('Remove item error:', {
          error: error.response?.data,
          itemId
        });
        set({ loading: false });
        toast.error(error.response?.data?.message || 'Failed to remove item');
      }
    },
  
  // Clear entire cart
  clearCart: async () => {
    set({ loading: true });
    try {
      await axiosInstance.delete('/cart/clear');
      set({ cart: null, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  },
  
  // Calculate cart totals
  getCartTotal: () => {
    const { cart } = get();
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // Get item count
  getItemCount: () => {
    const { cart } = get();
    if (!cart?.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}));