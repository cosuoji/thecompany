import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import toast from 'react-hot-toast';
import { useUserStore } from '../../store/useUserStore';
import SEO from '../SEO';

const WishlistPage = () => {
  const { fullInfo, isLoading, error, removeFromWishlist } = useWishlist();
  const { fetchUserData, user } = useUserStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EAE4D5]"></div>
      </div>
    );
  }


  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      await fetchUserData();
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                  <SEO 
              title="My Wishlist"
              description="My WishList"
              url="https://yourdomain.com/blog"
            />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#EAE4D5]">My Wishlist</h1>
        {fullInfo.length > 0 && (
          <span className="text-[#B6B09F]">
            {fullInfo.length} {fullInfo.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
      
      {fullInfo.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 text-[#B6B09F]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-[#B6B09F] text-lg mb-4">Your wishlist is empty</p>
          <Link 
            to="/store" 
            className="inline-block px-6 py-2 bg-[#EAE4D5] text-[#0a0a0a] font-medium rounded-lg hover:bg-[#f0e5d8] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[#3a3a3a] font-medium text-[#B6B09F]">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Price</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          
          {/* Wishlist Items */}
          {fullInfo.map((product) => (
            <div key={product._id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-[#3a3a3a] hover:bg-[#333333] transition-colors">
              {/* Product Info */}
              <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-[#1a1a1a] rounded-md overflow-hidden">
                  {product.coverImage ? (
                    <img 
                      src={product.coverImage.url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#B6B09F] text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                      to={`/store/shoes/${product?.slug}`}
                    className="block text-[#EAE4D5] font-medium hover:underline truncate"
                  >
                    {product.name}
                  </Link>
                  {product.brand && (
                    <p className="text-[#B6B09F] text-sm truncate">{product.brand}</p>
                  )}
                  {/* Mobile Price */}
                  <div className="md:hidden mt-1 text-[#EAE4D5] font-bold">
                    ₦{product?.basePrice?.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    }) || '0.00'}
                  </div>
                </div>
              </div>
              
              {/* Desktop Price */}
              <div className="hidden md:block col-span-3 text-center text-[#EAE4D5] font-bold">
                ₦{product?.basePrice?.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) || '0.00'}
              </div>
              
              {/* Actions */}
              <div className="col-span-12 md:col-span-3 flex justify-end gap-3">    
                <button
                  onClick={() => handleRemove(product._id)}
                  className="p-2 text-[#B6B09F] hover:text-red-500 transition-colors"
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