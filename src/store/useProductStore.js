// stores/useProductStore.js
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
export const useProductStore = create((set, get) => ({
  products: [],
  magazines: [],
  featuredMagazines: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    count: 0
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post('/products', productData);
      
      // Update the store state with the new product
      set(state => ({
        products: [...state.products, data],
        magazines: productData.productType === 'magazine' 
          ? [...state.magazines, data] 
          : state.magazines,
        loading: false
      }));
      
      return data;
    } catch (error) {
      set({ 
        loading: false,
        error: error.response?.data?.message || 'Failed to create product'
      });
      throw error;
    }
  },

  
  // Fetch all products (with optional filtering)
  fetchProducts: async (options = {}) => {
    set({ loading: true, error: null });
    try {
      const { keyword, page = 1, productType } = options;
      const { data } = await axiosInstance.get('/products', {
        params: { keyword, pageNumber: page, productType }
      });
      
      set({
        loading: false,
        products: data.products,
        pagination: {
          page: data.page,
          pages: data.pages,
          count: data.count
        }
      });
      
      // Special handling for magazines
      if (productType === 'magazine') {
        set({ magazines: data.products });
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch products' 
      });
    }
  },
  
  // Fetch single product by ID
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      set({ 
        currentProduct: data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Product not found' 
      });
    }
  },
  
  // Fetch featured magazines
  fetchFeaturedMagazines: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get('/products', {
        params: { productType: 'magazine', featured: true }
      });
      set({ 
        featuredMagazines: data.products, 
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch magazines' 
      });
    }
  },
  
  // Search products
  searchProducts: async (keyword) => {
    return get().fetchProducts({ keyword });
  },
  
  // Get related products (for product pages)
  fetchRelatedProducts: async (productId, category) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get('/products', {
        params: { category, limit: 4, exclude: productId }
      });
      return data.products;
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      return [];
    } finally {
      set({ loading: false });
    }
  }
}));