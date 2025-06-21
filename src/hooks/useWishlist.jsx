// hooks/useWishlist.js
import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';

export const useWishlist = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 1. Fetch ONCE on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get('/user/wishlist/products');
        setProducts(res.data);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch wishlist products', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // ❌ NO dependency on user?.wishlist!

  // ✅ 2. Remove locally + call backend
  const removeFromWishlist = async (productId) => {
    await axiosInstance.delete(`/user/wishlist/${productId}`);
    // ✅ Update local products state only
    setProducts((prev) => prev.filter(p => p._id !== productId));
  };

  return {
    products,
    isLoading,
    error,
    removeFromWishlist
  };
};
