import { useEffect, useState, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useCurrency } from '../context/CurrencyContext';
import { FaLock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useShoeStore from '../store/useShoeStore';
import PaystackComponent from '../Components/PaystackComponent';

const Checkout = () => {
  const { cart, cartData, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user?.profile?.firstName || '',
    lastName: user?.user?.profile?.lastName || '',
    email: user?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    shippingMethod: 'standard',
  });
  const { fetchShoeById } = useShoeStore();
  const [shoeComponentsMap, setShoeComponentsMap] = useState({});
  const isFormValid = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'address',
      'city',
      "state",
      'country',
      'zipCode'
    ];
  
    return requiredFields.every(field => formData[field]?.trim() !== '');
  };
  


  // Calculate totals
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shippingCost = formData.shippingMethod === 'express' ? 15 : 5;
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate('/store');
      return;
    }
  
    // Fetch shoe component details for each shoe item
    cart.items.forEach((item) => {
      if (item.productType === 'shoe') {
        getProductDetails(item);
      }
    });
  }, [cart, navigate]);

  


  const getProductImage = (item) => {
    if (item.productType === 'magazine') {
      const coverImage = item.product?.details?.magazineData?.coverImage.url;
      return typeof coverImage === 'string' ? coverImage : coverImage?.url;
    }
    return item.variant?.color?.images?.[0]?.url || '/placeholder-product.jpg';
  };

  
  const getComponentName = (id, componentType, productId) => {
    if (!id || !shoeComponentsMap[productId]) return 'Not specified';
  
    const collection = shoeComponentsMap[productId][componentType];
    if (!Array.isArray(collection)) return 'Unknown';
  
    const component = collection.find(comp => comp._id === id || comp.id === id);
    return component?.name || 'Unknown';
  };
  

  const getProductDetails = async (item) => {
    if (item.productType !== 'shoe') return;
  
    // Avoid re-fetching if already fetched
    if (shoeComponentsMap[item.product]) return;

  
    try {
      const data = await fetchShoeById(item.product);
      setShoeComponentsMap(prev => ({
        ...prev,
        [item.product]: {
          soles: data.soleOptions,
          lasts: data.lastOptions,
          materials: data.materialOptions
        }
      }));
    } catch (error) {
      console.error('Failed to fetch shoe components:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4B371C] hover:underline mr-6"
        >
          <FaArrowLeft /> Back to Cart
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <form className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country*</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code*</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-[#4B371C] focus:border-[#4B371C]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded hover:border-[#4B371C] cursor-pointer">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleInputChange}
                    className="text-[#4B371C] focus:ring-[#4B371C]"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">Standard Shipping</span>
                    <span className="block text-sm text-gray-600">5-7 business days</span>
                    <span className="block text-sm font-medium">{formatPrice(5)}</span>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded hover:border-[#4B371C] cursor-pointer">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleInputChange}
                    className="text-[#4B371C] focus:ring-[#4B371C]"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">Express Shipping</span>
                    <span className="block text-sm text-gray-600">2-3 business days</span>
                    <span className="block text-sm font-medium">{formatPrice(15)}</span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-[#F8F5F0] p-6 rounded-lg h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {cartData?.items?.map(item => {
              const imageUrl = getProductImage(item);
              
              return (
                <div key={item._id} className="flex items-start border-b pb-4">
                  <div className="w-16 h-16 flex-shrink-0 mr-4">
                    <img 
                      src={imageUrl}
                      alt={item.product?.details?.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
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
                        <p className="text-gray-600">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-gray-600">× {item.quantity}</p>
                    </div>
                    
                    {/* Shoe Customization Details */}
                    {item.productType === 'shoe' && item.variant && (
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Color: {item.variant.color?.name}</p>
                        <p>Size: {item.variant.size}</p>
                        <p>Last: {getComponentName(item.variant.last, 'lasts', item.product.details._id)}</p>
                        <p>Material: {getComponentName(item.variant.material, 'materials', item.product.details._id)}</p>
                        <p>Sole: {getComponentName(item.variant.sole, 'soles', item.product.details._id)}</p>
                        <p>Width: {item.variant.width}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Totals */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <PaystackComponent
            products={cart?.items}
            totalAmount={total}
            formData={formData}
            disabled={!isFormValid()}
          />


        

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your personal data will be used to process your order and for other purposes described in our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;