import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';


const useShoeStore = create((set, get) => ({
    // State
    shoes: [],
    currentShoe: null,
    loading: false,
    error: null,
    options: {
      categories: [],
      colors: [],
      materials: [],
      soles: [],
      lasts: [],
      collections: []
    },
  
    // Fetch all shoes
    fetchShoes: async () => {
      set({ loading: true });
      try {
        const { data } = await axiosInstance.get('/shoes');
        set({ shoes: data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error('Failed to fetch shoes');
      }
    },
  
    // Get single shoe
    fetchShoeById: async (id) => {
      set({ loading: true });
      try {
        const { data } = await axiosInstance.get(`/shoes/${id}`);
        set({ currentShoe: data, loading: false });
        return data;
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error('Failed to fetch shoe details');
      }
    },

    

  
    // Create shoe
    createShoe: async (shoeData) => {
      set({ loading: true });
      try {
        const { data } = await axiosInstance.post('/shoes', shoeData);
        set(state => ({
          shoes: [...state.shoes, data],
          loading: false
        }));
        toast.success('Shoe created successfully!');
        return data;
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.response?.data?.message || 'Failed to create shoe');
        console.log(error.response?.data?.message)
        throw error;
      }
    },
  
    // Update shoe
    updateShoe: async (id, updates) => {
      set({ loading: true });
      try {
        const { data } = await axiosInstance.put(`/shoes/${id}`, updates);
        set(state => ({
          shoes: state.shoes.map(shoe => 
            shoe._id === id ? data : shoe
          ),
          currentShoe: data,
          loading: false
        }));
        toast.success('Shoe updated successfully!');
        return data;
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.response?.data?.message || 'Failed to update shoe');
        throw error;
      }
    },
  
    // Delete shoe
    deleteShoe: async (id) => {
      set({ loading: true });
      try {
        await axiosInstance.delete(`/shoes/${id}`);
        set(state => ({
          shoes: state.shoes.filter(shoe => shoe._id !== id),
          loading: false
        }));
        toast.success('Shoe deleted successfully!');
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.response?.data?.message || 'Failed to delete shoe');
        throw error;
      }
    },
  
     // Unified Options Management
     fetchOptions: async () => {
      set({ loading: true, options: { ...get().options, loading: true } });
      try {
        
        const endpoints = [
          '/shoes/categories',
          '/shoes/colors',
          '/shoes/materials',
          '/shoes/soles',
          '/shoes/lasts',
          '/shoes/collections'
        ];
    
        // Debug: Log each endpoint before request
        endpoints.forEach(endpoint => console.log(`Will fetch: ${endpoint}`));
        
        const responses = await Promise.all(
          endpoints.map(endpoint => axiosInstance.get(endpoint))
        );
    
        // Debug: Log raw responses
      //  console.log('Raw responses:', responses);
        
        const [categories, colors, materials, soles, lasts, collections] = responses;
    
        set({
          options: {
            categories: categories.data || [],
            colors: colors.data || [],
            materials: materials.data || [],
            soles: soles.data || [],
            lasts: lasts.data || [],
            collections: collections.data || [],
            loading: false,
            error: null
          },
          loading: false
        });
    
        //console.log('Options updated:', get().options); // Verify state update
      } catch (error) {
        console.error('Full fetch error:', error); // Detailed error log
        console.error('Error response:', error.response); // Axios specific info
        
        set({
          error: error.message,
          loading: false,
          options: { ...get().options, error: error.message, loading: false }
        });
        toast.error('Failed to load options');
      }
    },
  
    // Generate variants (client-side)
    generateVariants: (options) => {
      const {
        colorOptions = [],
        sizeOptions = [],
        widthOptions = ['Standard'],
        soleOptions = [],
        lastOptions = [],
        materialOptions = []
      } = options;
  
      const variants = [];
      
      // Just use the indices as temporary references
      colorOptions.forEach((color, colorIdx) => {
        sizeOptions.forEach(size => {
          widthOptions.forEach(width => {
            soleOptions.forEach((sole, soleIdx) => {
              lastOptions.forEach((last, lastIdx) => {
                materialOptions.forEach((material, materialIdx) => {
                  variants.push({
                    // Temporary references using indices
                    color: `color-${colorIdx}`,
                    size,
                    width,
                    soleType: `sole-${soleIdx}`,
                    lastType: `last-${lastIdx}`,
                    material: `material-${materialIdx}`,
                    stock: 0,
                    priceAdjustment: 0,
                    sku: `TEMP-SH-${colorIdx}-${size}-${width.charAt(0)}`
                  });
                });
              });
            });
          });
        });
      });
      
      return variants;
    }
  }));


export const generateId = () => {
  // A simple function to generate random IDs for frontend use
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};


  
  export default useShoeStore;