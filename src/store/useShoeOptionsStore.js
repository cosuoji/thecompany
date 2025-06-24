import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axios';

const useShoeOptionsStore = create((set) => ({
  // State for all options
  categories: [],
  colors: [],
  materials: [],
  soles: [],
  lasts: [],
  collections: [],
  loading: false,
  error: null,

  // Fetch all options
  fetchAllOptions: async () => {
    set({ loading: true });
    try {
      const [categories, colors, materials, soles, lasts, collections] = await Promise.all([
        axiosInstance.get('/shoes/categories'),
        axiosInstance.get('/shoes/colors'),
        axiosInstance.get('/shoes/materials'),
        axiosInstance.get('/shoes/soles'),
        axiosInstance.get('/shoes/lasts'),
        axiosInstance.get('/shoes/collections')
      ]);
      
      set({
        categories: categories.data,
        colors: colors.data,
        materials: materials.data,
        soles: soles.data,
        lasts: lasts.data,
        collections: collections.data,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to load options');
    }
  },

  // Category methods
  createCategory: async (categoryData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/categories', categoryData);
      set(state => ({
        categories: [...state.categories, data],
        loading: false
      }));
      toast.success('Category created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create category');
      throw error;
    }
  },

  // Color methods
  createColor: async (colorData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/colors', colorData);
      set(state => ({
        colors: [...state.colors, data],
        loading: false
      }));
      toast.success('Color option created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create color');
      throw error;
    }
  },

  // Sole methods
  createSole: async (soleData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/soles', soleData);
      set(state => ({
        soles: [...state.soles, data],
        loading: false
      }));
      toast.success('Sole option created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create sole');
      throw error;
    }
  },

  // Last methods
  createLast: async (lastData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/lasts', lastData);
      set(state => ({
        lasts: [...state.lasts, data],
        loading: false
      }));
      toast.success('Last option created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create last');
      throw error;
    }
  },

  // Material methods
  createMaterial: async (materialData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/materials', materialData);
      set(state => ({
        materials: [...state.materials, data],
        loading: false
      }));
      toast.success('Material option created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create material');
      throw error;
    }
  },

  // Collection methods
  createCollection: async (collectionData) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.post('/shoes/collections', collectionData);
      set(state => ({
        collections: [...state.collections, data],
        loading: false
      }));
      toast.success('Collection created!');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.response?.data?.message || 'Failed to create collection');
      throw error;
    }
  }

  // Add update/delete methods as needed...
}));

export default useShoeOptionsStore;