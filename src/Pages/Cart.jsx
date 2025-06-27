import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import CurrencySwitcher from '../components/CurrencyComponents/CurrencySwitcher';
import useShoeStore from '../store/useShoeStore';
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from '../store/useUserStore';

const CartPage = () => {
  const { cart, cartData, updateCartItem, removeFromCart, fetchCart, fetchCartWithProductData } = useCartStore();
  const {getSingleShoe} = useShoeStore();
  const {fetchMagazine} = useProductStore()
  const { currency, formatPrice } = useCurrency();
  const [disabled, setDisabled] = useState(true)
  const {user} = useUserStore()

  useEffect(() => {
    fetchCart();
    fetchCartWithProductData()
    user ? setDisabled(false) : null
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

  const getProductImage = (item) => {
    if (item.productType === 'magazine') {
     
      const coverImage = item.product?.details?.magazineData?.coverImage.url;
      return typeof coverImage === 'string' ? coverImage : coverImage?.url;
    }

    return item.variant.color.images[0]?.url || '/placeholder-product.jpg';
  };

  

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {cartData?.items?.length > 0 ? (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartData.items.map((item) => {
              const imageUrl = getProductImage(item);
              
              return (
                <div key={`${item._id}-${item.quantity}`} className="flex items-start border-b pb-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 mr-4">
                    <img 
                      src={imageUrl}
                      alt={item.product?.details?.name || 'Product image'}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.jpg';
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {item.product?.details?.name}
                          {item.productType === 'magazine' && (
                            <span className="text-gray-600 ml-2">
                              (Issue #{item.product.details.magazineData?.issueNumber})
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {formatPrice(item.price)}
                        </p>
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
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <Link to="/checkout">
                <button
                  disabled={disabled}
                  className="w-full bg-[#4B371C] text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                >
                  CHECKOUT
                </button>
                </Link>
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
            className="mt-4 inline-block px-6 py-2 bg-[#4B371C] text-[#E6DACD] rounded hover:bg-[#3a2b15] transition-colors"
          >
            Browse Store
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;