import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from "../lib/axios";
import { FaArrowLeft } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';
import SizeGuide from '../Components/SizeGuide';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PriceDisplay from '../Components/CurrencyComponents/PriceDisplay';
import { useUserStore } from '../store/useUserStore';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';



const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    color: 0,
    size: '',
    width: '',
    last: '',
    sole: '',
    material: ''
  });
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const {addToCartShoes} = useCartStore()
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const {
    user,
    addToWishlist,
    removeFromWishlist,
    wishlistProducts
  } = useUserStore();
  const { currency } = useCurrency();
  

  
  useDocumentTitle(`Store - ${product?.name} `)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get('/shoes');
        const foundProduct = response.data.find(p => p.slug === slug);
        
        if (!foundProduct) {
          setLoading(false);
          return;
        }
        
        const detailResponse = await axiosInstance.get(`/shoes/${foundProduct._id}`);
        setProduct(detailResponse.data);

        
        
        // Set default selections
        if (detailResponse.data) {
            setSelectedOptions(prev => ({
                ...prev,
                size: detailResponse.data.sizeOptions?.[0] || '',
                width: detailResponse.data.widthOptions?.[0] || '',
                last: detailResponse.data.lastOptions?.[0]?._id || '',
                sole: detailResponse.data.soleOptions?.[0]?._id || '',
                material: detailResponse.data.materialOptions?.[0]?._id || ''
              }));              
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const loadData = async () => {
      await fetchProduct(); // extract it to return the product
      await useUserStore.getState().fetchUserData();
    };
  
    loadData();

  }, [slug]);

  const [isWishlisted, setIsWishlisted] = useState(false);

useEffect(() => {
  if (product && wishlistProducts) {
    const match = wishlistProducts.some(p => p._id === product._id);
    setIsWishlisted(match);
  }
}, [product, wishlistProducts]);


  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }));
  };

  const handleAddToCart = () => {
    // Prepare the variant object
    const variant = {
      color: product.colorOptions[selectedOptions.color] || "",
      size: selectedOptions.size,
      width: selectedOptions.width,
      last: selectedOptions.last,
      sole: selectedOptions.sole,
      material: selectedOptions.material
    };



    // Add to cart logic here
    !user ? toast.error("Sign in to add to Cart") : addToCartShoes(product._id, variant, 1, currency)
    
    // You would typically call your addToCart function here
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Sign in to save to wishlist");
      return;
    }
  
    if (isWishlisted) {
      await removeFromWishlist(product._id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(product._id);
      setIsWishlisted(true);
    }
  };
  
  

  const currentColor = product?.colorOptions[selectedOptions.color];
  const currentImages = currentColor?.images || [];

  // Check if all required options are selected
  const allOptionsSelected = selectedOptions.size &&
                           product.colorOptions?.[selectedOptions.color]?._id &&
                           selectedOptions.width &&
                           selectedOptions.last &&
                           selectedOptions.sole &&
                           selectedOptions.material;


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B371C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 min-h-[60vh]">
        <h2 className="text-xl font-medium text-red-500">Error loading product</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#4B371C] text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 min-h-[60vh]">
        <h2 className="text-xl font-medium text-gray-500">Product not found</h2>
        <button
          onClick={() => navigate('/store')}
          className="mt-4 px-4 py-2 bg-[#4B371C] text-white rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      {/* Back Button */}
      <div className="flex justify-between items-center py-4 gap-4">
        <button 
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaArrowLeft /> Back to Store
        </button>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Product Images */}
        
        
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
            {currentImages[selectedImage] ? (
              <img
                src={currentImages[selectedImage].url}
                alt={`${product.name} - ${currentColor?.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {currentImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-gray-100 rounded overflow-hidden ${selectedImage === index ? 'ring-2 ring-[#4B371C]' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
        <div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <button
          onClick={handleWishlistToggle}
          className="text-[#4B371C] hover:text-[#6a5131] transition-colors"
          aria-label="Add to wishlist"
        >
          {isWishlisted ? (
            <FaHeart className="w-6 h-6 text-red-500" />
          ) : (
            <FaRegHeart className="w-6 h-6" />
          )}
        </button>
      </div>

          <div>
            <PriceDisplay
              price={product.basePrice}
              discountedPrice={product.discountedPrice}
              className="text-xl text-gray-900"
              originalPriceClass="text-gray-500"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-900">Color: {currentColor?.name}</h2>
            <div className="flex flex-wrap gap-2">
              {product.colorOptions.map((color, index) => (
                <button
                  key={color._id}
                  onClick={() => {
                    handleOptionChange('color', index);
                    setSelectedImage(0); // Reset to first image when color changes
                  }}
                  className={`w-10 h-10 rounded-full border-2 ${selectedOptions.color === index ? 'border-[#4B371C]' : 'border-transparent'}`}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

        {/* Size Selection */}
        <div className="space-y-2">
                <div className="flex justify-between items-center">
                <label htmlFor="size" className="text-sm font-medium text-gray-900">
                    Size*
                </label>
                <button 
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-sm text-[#4B371C] hover:underline"
                >
                    What's my size?
                </button>
                </div>
                <select
                id="size"
                value={selectedOptions.size}
                onChange={(e) => handleOptionChange('size', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4B371C] focus:border-[#4B371C] sm:text-sm rounded-md"
                required
                >
                <option value="">Select your size</option>
                {product.sizeOptions.map((size) => (
                    <option key={size} value={size}>
                    EU {size}
                    </option>
                ))}
                </select>
            </div>

          {/* Width Selection */}
          {product.widthOptions?.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium text-gray-900">
                Width
              </label>
              <select
                id="width"
                value={selectedOptions.width}
                onChange={(e) => handleOptionChange('width', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4B371C] focus:border-[#4B371C] sm:text-sm rounded-md"
              >
                {product.widthOptions.map((width) => (
                  <option key={width} value={width}>
                    {width}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Last Selection */}
          {product.lastOptions?.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="last" className="text-sm font-medium text-gray-900">
                Last Type
              </label>
              <select
                id="last"
                value={selectedOptions.last}
                onChange={(e) => handleOptionChange('last', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4B371C] focus:border-[#4B371C] sm:text-sm rounded-md"
              >
                {product.lastOptions.map((last) => (
                  <option key={last._id} value={last._id}>
                    {last.name} {last.code ? `(${last.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sole Selection */}
          {product.soleOptions?.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="sole" className="text-sm font-medium text-gray-900">
                Sole Type
              </label>
              <select
                id="sole"
                value={selectedOptions.sole}
                onChange={(e) => handleOptionChange('sole', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4B371C] focus:border-[#4B371C] sm:text-sm rounded-md"
              >
                {product.soleOptions.map((sole) => (
                  <option key={sole._id} value={sole._id}>
                    {sole.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Material Selection */}
          {product.materialOptions?.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="material" className="text-sm font-medium text-gray-900">
                Material
              </label>
              <select
                id="material"
                value={selectedOptions.material}
                onChange={(e) => handleOptionChange('material', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4B371C] focus:border-[#4B371C] sm:text-sm rounded-md"
              >
                {product.materialOptions.map((material) => (
                  <option key={material._id} value={material._id}>
                    {material.type} 
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-md transition-colors ${allOptionsSelected ? 'bg-[#4B371C] text-white hover:bg-[#5a452a]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!allOptionsSelected}
          >
            {allOptionsSelected ? 'Add to Cart' : 'Please select all options'}
          </button>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['description', 'details', 'material-care', 'delivery-returns'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-[#4B371C] text-[#4B371C]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'description' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
        {activeTab === 'details' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Construction</h3>
                <p className="text-gray-700">Goodyear welted for durability</p>
              </div>
              <div>
                <h3 className="font-medium">Fit</h3>
                <p className="text-gray-700">True to size with medium width</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'material-care' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Material & Care</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Upper Material</h3>
                <p className="text-gray-700">Premium full-grain leather</p>
              </div>
              <div>
                <h3 className="font-medium">Care Instructions</h3>
                <p className="text-gray-700">
                  Use a soft brush to remove dirt. Condition with leather cream monthly.
                  Avoid excessive water exposure.
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'delivery-returns' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Delivery & Returns</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-gray-700">
                  Free worldwide shipping. Typically delivered in 3-5 business days.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Returns</h3>
                <p className="text-gray-700">
                  30-day free returns. Items must be unworn and in original packaging.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#4B371C] text-white rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
          <p className="text-gray-600">
            Handcrafted with the finest materials for exceptional durability and comfort.
          </p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#4B371C] text-white rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Ethical Production</h3>
          <p className="text-gray-600">
            Fair wages and sustainable practices at every stage of production.
          </p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#4B371C] text-white rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Dedicated Support</h3>
          <p className="text-gray-600">
            Our shoe experts are available to help with sizing and care advice.
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center bg-[#4B371C] text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Wardrobe?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          These aren't just shoes - they're an investment in timeless style and craftsmanship.
        </p>
        <button
          onClick={handleAddToCart}
          className={`px-6 py-3 rounded-md transition-colors ${allOptionsSelected ? 'bg-white text-[#4B371C] hover:bg-gray-100' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!allOptionsSelected}
        >
          {allOptionsSelected ? 'Add to Cart Now' : 'Complete Your Selection'}
        </button>
      </div>

        {/* Size Guide Modal */}
        {isSizeGuideOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">Size Guide</h3>
              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <SizeGuide />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;