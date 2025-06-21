import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';


const WishlistPage = () => {
  const { products, isLoading, error, removeFromWishlist } = useWishlist();
  const {addToCart} = useCartStore()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EAE4D5]"></div>
      </div>
    );
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };


const handleRemove = async (productId) => {
  try {
    await removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to remove');
  }
};


  if (error) {
    return (
      <div className="text-red-500 p-4">
        Failed to load wishlist: {error.message}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-[#EAE4D5] text-[#0a0a0a] rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#EAE4D5] mb-6">My Wishlist</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#B6B09F] text-lg mb-4">Your wishlist is empty</p>
          <Link 
            to="/store" 
            className="inline-block px-6 py-2 bg-[#EAE4D5] text-[#0a0a0a] font-medium rounded-lg hover:bg-[#f0e5d8] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/product/${product._id}`} className="block">
                <div className="h-48 bg-[#1a1a1a] flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[#B6B09F]">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[#EAE4D5] font-medium mb-1 truncate">{product.name}</h3>
                  <p className="text-[#B6B09F] text-sm mb-2">{product.brand}</p>
                  <p className="text-[#EAE4D5] font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <div className="p-4 pt-0 flex justify-between gap-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 py-2 bg-[#4B371C] text-[#EAE4D5] rounded hover:bg-[#5a452a] transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="p-2 text-[#B6B09F] hover:text-[#EAE4D5] transition-colors"
                  aria-label="Remove from wishlist"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;