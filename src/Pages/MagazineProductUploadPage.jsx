import { useState, useEffect } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../store/useProductStore';

const MagazineUploadPage = () => {
  const { loading, error, fetchProducts } = useProductStore();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 100,
    productType: 'magazine',
    magazineData: {
      issueNumber: '',
      publishDate: new Date().toISOString().split('T')[0],
      pages: 0,
      isFeatured: false,
      coverImage: { url: '', publicId: '' }
    }
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('magazineData.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        magazineData: {
          ...prev.magazineData,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle image upload success
  const handleImageSuccess = (res) => {
    setFormData(prev => ({
      ...prev,
      magazineData: {
        ...prev.magazineData,
        coverImage: {
          url: res.url,
          publicId: res.fileId
        }
      }
    }));
    toast.success('Cover image uploaded!');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the store directly instead of getState()
      await useProductStore.getState().createProduct(formData);
      toast.success('Magazine created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        price: 0,
        description: '',
        stock: 100,
        productType: 'magazine',
        magazineData: {
          issueNumber: '',
          publishDate: new Date().toISOString().split('T')[0],
          pages: 0,
          isFeatured: false,
          coverImage: { url: '', publicId: '' }
        }
      });
      
      // Refresh the magazine list
      useProductStore.getState().fetchProducts({ type: 'magazine' });
    } catch (err) {
      toast.error(err.message || 'Failed to create magazine');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Upload New Magazine</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Magazine Title*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Issue Number*</label>
            <input
              type="number"
              name="magazineData.issueNumber"
              value={formData.magazineData.issueNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Price and Stock Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Price (₦)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Pages*</label>
            <input
              type="number"
              name="magazineData.pages"
              value={formData.magazineData.pages}
              onChange={handleChange}
              min="1"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Stock Quantity*</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Cover Image*</label>
          {formData.magazineData.coverImage.url ? (
            <div className="mt-2">
              <img 
                src={formData.magazineData.coverImage.url} 
                alt="Cover preview" 
                className="h-64 object-contain rounded-lg border"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  magazineData: {
                    ...prev.magazineData,
                    coverImage: { url: '', publicId: '' }
                  }
                }))}
                className="mt-2 text-red-600 text-sm"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <IKContext
            urlEndpoint="https://ik.imagekit.io/ldhzgky9pk"
            publicKey="public_Y9ne/saJW/xkRygZ4ZR/GXn6W9Q="
            authenticator={async () => {
             try {
               const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/imagekit`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });
        
              // First check if response exists
              if (!response) {
                throw new Error('No response from server');
              }
        
              // Check for empty response
              const text = await response.text();
              if (!text) {
                throw new Error('Empty response from server');
              }
        
              // Try to parse JSON
              let data;
              try {
                data = JSON.parse(text);
              } catch (parseError) {
                console.error('Failed to parse JSON:', text);
                throw new Error('Invalid JSON response');
              }
        
              // Verify required fields
              if (!data.token || !data.signature || !data.expire) {
                console.error('Missing auth fields:', data);
                throw new Error('Incomplete authentication data');
              }
        
              return data;
            } catch (error) {
              console.error('Authentication failed:', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
              });
              throw error;
            }
          }}
        >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <IKUpload
                  fileName={`magazine-${formData.magazineData.issueNumber || 'new'}.jpg`}
                  onSuccess={handleImageSuccess}
                  onError={() => toast.error('Image upload failed')}
                  className="hidden"
                  id="cover-upload"
                />
                <label 
                  htmlFor="cover-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-600 font-medium">Click to upload</span>
                  <span className="text-gray-500 text-sm">or drag and drop</span>
                  <span className="text-gray-400 text-xs">JPG, PNG (Max 5MB)</span>
                </label>
              </div>
            </IKContext>
          )}
        </div>

        {/* Description and Features */}
        <div>
          <label className="block text-gray-700 mb-2">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="magazineData.isFeatured"
            checked={formData.magazineData.isFeatured}
            onChange={handleChange}
            id="isFeatured"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-gray-700">
            Feature this magazine on homepage
          </label>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-gray-700 mb-2">Publish Date</label>
          <input
            type="date"
            name="magazineData.publishDate"
            value={formData.magazineData.publishDate}
            onChange={handleChange}
            className="w-full md:w-1/3 p-3 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !formData.magazineData.coverImage.url}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading || !formData.magazineData.coverImage.url
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Publishing Magazine...' : 'Publish Magazine'}
          </button>
        </div>

        {error && (
          <div className="text-red-500 mt-2 text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default MagazineUploadPage;