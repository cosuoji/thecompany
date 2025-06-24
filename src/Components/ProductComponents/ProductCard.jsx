import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProductCard = ({ product, className = '' }) => {
  const { user, addToWishlist, removeFromWishlist, fetchUserData } = useUserStore();
  const [selectedColor, setSelectedColor] = useState(0); // Using index instead of ID
  const [isWishlisted, setIsWishlisted] = useState(user?.wishlist?.includes(product._id));

  const currentColor = product?.colorOptions[selectedColor];
  const primaryImage = currentColor?.images?.[0];

  useEffect(() => {
    setIsWishlisted(user?.wishlist?.includes(product._id));
  }, [user?.wishlist, product._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
      await fetchUserData()
    } catch (error) {
      if(!user) toast.error("Please login")
      console.error("Wishlist error:", error);
    }
  };

  const handleColorChange = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(index);
  };

  // Calculate displayed price
  const price = product?.basePrice != null
  ? product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : '0.00';

  return (
    <Link 
      to={`/products/${product?.slug || product?._id}`}
      className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group block ${className}`}
    >
      {/* Wishlist Button */}
      <button
      onClick={handleWishlist}
      className={`absolute top-2 right-2 z-10 p-2 rounded-full  hover:scale-110 transition-transform ${
        isWishlisted ? 'text-red-500' : 'text-black-400'
      }`}
    >
      {isWishlisted ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            className="w-full h-full object-cover"
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate">{product?.name}</h3>
        <p className="font-bold text-xl mb-3">₦{price}</p>

        {/* Color Options */}
        {product?.colorOptions?.length > 1 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {product.colorOptions.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => handleColorChange(index, e)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === index 
                      ? 'border-gray-900 scale-110' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};