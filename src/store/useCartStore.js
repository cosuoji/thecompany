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
        quantity
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
  
  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    if (quantity < 1) return;
    
    set({ loading: true });
    try {
      const { data } = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      set({ cart: data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  },
  
  // Remove item from cart
  removeFromCart: async (itemId) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.delete(`/cart/${itemId}`);
      set({ cart: data, loading: false });
      toast.success('Item removed from cart');
    } catch (error) {
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