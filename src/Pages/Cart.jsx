import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { FaTrash, FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useUserStore } from '../store/useUserStore';
import useShoeStore from '../store/useShoeStore';
import useDocumentTitle from '../hooks/useDocumentTitle';


const CartPage = () => {
  const { cart, cartData, updateCartItem, removeFromCart, fetchCart, fetchCartWithProductData } = useCartStore();
  const { currency, formatPrice } = useCurrency();
  const { user } = useUserStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {fetchShoeById} = useShoeStore()
  const [shoeComponents, setShoeComponents] = useState({
    soles: [],
    lasts: [],
    materials: []
  });


 useEffect(() => {
  if (user) {
    fetchCart();
    if (cart?.items?.length) fetchCartWithProductData();
  }
}, [user, cart?.items?.length]);

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

  const handleViewDetails = async (item) => {
    if (item.productType === 'shoe') {

      const data = await fetchShoeById(item.product.details._id)
      const soles = data.soleOptions
      const lasts = data.lastOptions
      const materials = data.materialOptions
      setShoeComponents({soles, lasts, materials})
      setSelectedProduct(item);
      setShowModal(true);
    }
   
  };

  const getComponentName = (id, componentType) => {
    if (!id) return 'Not specified';
 
    const collection = shoeComponents[componentType];
   
    if (!collection) return 'Unknown';
    
    const component = Array.isArray(collection) 
      ? collection.find(item => item._id === id || item.id === id)
      : null;
      
    return component?.name || 'Unknown';
  };



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{selectedProduct.product?.details?.name}</h3>
            
            <div className="mb-4">
              <img 
                src={getProductImage(selectedProduct)} 
                alt={selectedProduct.product?.details?.name}
                className="w-full h-48 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            
            <div className="space-y-2">
              <p><span className="font-semibold">Price:</span> {formatPrice(selectedProduct.price)}</p>
              <p><span className="font-semibold">Quantity:</span> {selectedProduct.quantity}</p>
              {selectedProduct.variant && (
                <>
                  <p><span className="font-semibold">Color:</span> {selectedProduct.variant.color.name}</p>
                  <p><span className="font-semibold">Size:</span> {selectedProduct.variant.size}</p>
                  <p><span className="font-semibold">Last:</span> {getComponentName(selectedProduct.variant.last, "lasts")}</p>
                  <p><span className="font-semibold">Material:</span> {getComponentName(selectedProduct.variant.material, "materials")}</p>
                  <p><span className="font-semibold">Sole:</span> {getComponentName(selectedProduct.variant.sole, "soles")}</p>
                  <p><span className="font-semibold">Width:</span> {selectedProduct.variant.width}</p>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-[#4B371C] text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cartData?.items?.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {cartData.items.map((item) => {
              const imageUrl = getProductImage(item);
              
              return (
                <div key={`${item._id}-${item.quantity}`} className="flex items-start border-b pb-4">
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

                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {item.product?.details?.name}
                          {item.productType === 'shoe' && (
                            <button 
                              onClick={() => handleViewDetails(item)}
                              className="ml-2 text-gray-500 hover:text-gray-700 relative group"
                              aria-label="View product details"
                            >
                              <FaInfoCircle className="text-sm" />
                              <span className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -bottom-6 -left-1 whitespace-nowrap">
                                View details of order
                              </span>
                            </button>
                          )}
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

          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <Link to={user ? "/checkout" : "/login"}>
                  <button
                    className="w-full bg-[#4B371C] text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                  >
                    {user ? "Checkout Securely" : "Login to Checkout"}
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