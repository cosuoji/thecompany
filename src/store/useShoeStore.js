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
        await axiosInstance.delete(`/api/shoes/${id}`);
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
  

  
    // Generate variants (client-side)
    generateVariants: (options) => {
      const { colorOptions, sizeOptions, widthOptions, soleOptions, lastOptions, materialOptions } = options;
      const variants = [];
      
      colorOptions.forEach(color => {
        sizeOptions.forEach(size => {
          widthOptions.forEach(width => {
            soleOptions.forEach(sole => {
              lastOptions.forEach(last => {
                materialOptions.forEach(material => {
                  variants.push({
                    color: color._id,
                    size,
                    width,
                    soleType: sole._id,
                    lastType: last._id,
                    material: material._id,
                    stock: 0,
                    priceAdjustment: 0,
                    sku: `SH-${color.name.slice(0,2)}-${size}-${width.charAt(0)}`
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
  
  export default useShoeStore;