// stores/useCartStore.js
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useCartStore = create((set, get) => ({
  cart: null,
  cartData: null, // Will store enriched cart data
  loading: false,
  currency: 'NGN',
  setCurrency: (currency) => set({ currency }),
  
  // Enhanced fetch cart with full product data
  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get('/cart');
      const enrichedCart = await get().fetchCartWithProductData(data);
      set({ 
        cart: data,
        cartData: enrichedCart,
        loading: false 
      });
      return enrichedCart;
    } catch (error) {
      set({ cart: null, cartData: null, loading: false });
      throw error;
    }
  },

  // Fetch detailed product data for each cart item
  fetchCartWithProductData: async (cart) => {
    if (!cart?.items?.length) return { ...cart, items: [] };
    
    try {
      const itemsWithData = await Promise.all(
        cart.items.map(async (item) => {
          if (!item.product) return item;
          
          let productData = null;
          try {
            const endpoint = item.productType === 'shoe' 
              ? `/shoes/${item.product}`
              : `/products/${item.product}`;
            
            const { data } = await axiosInstance.get(endpoint);
            productData = data;
          } catch (error) {
            console.error('Failed to fetch product details:', error);
          }
          
          return {
            ...item,
            product: productData 
              ? { 
                  ...item.product, 
                  details: productData,
                  images: productData.images || item.product.images 
                }
              : item.product
          };
        })
      );
      
      return {
        ...cart,
        items: itemsWithData
      };
    } catch (error) {
      console.error('Error enriching cart data:', error);
      return cart; // Return original cart if enrichment fails
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
        currency: get().currency
      });
      
      const enrichedCart = await get().fetchCartWithProductData(data);
      set({ 
        cart: data,
        cartData: enrichedCart,
        loading: false 
      });
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  },

  // Add shoes to cart with variant validation
  addToCartShoes: async (productId, variant = null, quantity = 1) => {
    set({ loading: true });
    try {
      if (!variant || !variant.color?._id || !variant.size) {
        throw new Error('Please select both color and size');
      }

      const { data } = await axiosInstance.post('/cart/shoes', {
        productId,
        variant,
        quantity,
        currency: get().currency
      });

      const enrichedCart = await get().fetchCartWithProductData(data);
      set({ 
        cart: data,
        cartData: enrichedCart,
        loading: false 
      });
      toast.success('Shoes added to cart!');
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || error.message || 'Failed to add shoes to cart');
      return false;
    }
  },
  
  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      const enrichedCart = await get().fetchCartWithProductData(data);
      set({ 
        cart: data,
        cartData: enrichedCart,
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  },
  
  // Remove item from cart
  removeFromCart: async (itemId) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.delete(`/cart/${itemId}`);
      const enrichedCart = await get().fetchCartWithProductData(data);
      set({ 
        cart: data,
        cartData: enrichedCart,
        loading: false 
      });
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
      set({ 
        cart: null, 
        cartData: null,
        loading: false 
      });
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
  },

  // Get enriched item count (using cartData)
  getEnrichedItemCount: () => {
    const { cartData } = get();
    if (!cartData?.items) return 0;
    return cartData.items.reduce((count, item) => count + item.quantity, 0);
  }
}));