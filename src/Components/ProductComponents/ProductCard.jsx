// In your ProductCard component
import { useUserStore } from '../../store/useUserStore';

export const ProductCard = ({ product }) => {
  const { user, addToWishlist } = useUserStore();
  const isInWishlist = user?.wishlist?.includes(product._id);

  const handleWishlist = async () => {
    if (isInWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  return (
    <div className="product-card">
      {/* ... other product card content ... */}
      <button 
        onClick={handleWishlist}
        className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
      >
        {isInWishlist ? '❤️' : '♡'}
      </button>
    </div>
  );
};