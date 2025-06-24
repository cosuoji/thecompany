// hooks/useWishlist.js
import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';

export const useWishlist = () => {
  const [products, setProducts] = useState([]);
  const [fullInfo, setFullInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch basic wishlist products
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/user/wishlist/products', {
          withCredentials: true,
        });
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Fetch detailed product info when products change
  useEffect(() => {
    const fetchFullProductDetails = async () => {
      if (products.length === 0) return;
      console.log(products)
      try {
        setIsLoading(true);
        const requests = products.map(product => 
          axiosInstance.get(`/shoes/${product.toString()}`, {
            withCredentials: true,
          })
          
        );
        
        const responses = await Promise.all(requests);
        const detailedProducts = responses.map(res => res.data);
        
        setFullInfo(detailedProducts);
      } catch (err) {
        console.error('Failed to fetch detailed product info:', err);
        // You might want to setError here or handle differently
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullProductDetails();
  }, [products]);


  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/user/wishlist/${productId}`, {
        withCredentials: true,
      });
      // Update both products and fullInfo states
      setProducts(products.filter(p => p._id !== productId));
      setFullInfo(fullInfo.filter(p => p._id !== productId));
    } catch (err) {
      throw err;
    }
  };

  return { 
    products, 
    fullInfo, 
    isLoading, 
    error, 
    removeFromWishlist 
  };
};