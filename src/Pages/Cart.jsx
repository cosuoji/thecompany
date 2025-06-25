import { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const calculateTotal = () => {
    return cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  // Stable image URL getter
  const getProductImage = (item) => {
    // Handle magazine cover image (now properly checks for object/string)
    if (item.product?.productType === 'magazine') {
      const coverImage = item.product?.magazineData?.coverImage;
      return typeof coverImage === 'string' ? coverImage : coverImage?.url;
    }
    //console.log(item.variant.color.images[0].url)
    // Handle regular product image
    return item.variant.color.images[0].url
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-left">Cart</h1>
      
      {cart?.items?.length > 0 ? (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => {
              const imageUrl = getProductImage(item);
              return (
                <div key={`${item._id}-${item.quantity}`} className="flex items-start border-b pb-4">
                  {/* Product Image with stable rendering */}
                  <div className="w-20 h-20 flex-shrink-0 mr-4">
                    {imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={item.product?.name || 'Product image'}
                        className="w-full h-full object-cover rounded"
                        key={`img-${imageUrl}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.jpg';
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {item.product?.name}
                          {item.product?.productType === 'magazine' && (
                            <span className="text-gray-600 ml-2">
                              (Issue #{item.product.magazineData?.issueNumber})
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600">₦{item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center mx-2">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₦{calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  disabled
                  className=" bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                >
                  CHECKOUT
                </button>
                <Link 
                  to="/store" 
                  className="block text-center underline hover:underline mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <Link 
            to="/store" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Browse Store
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;