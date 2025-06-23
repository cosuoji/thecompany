import { useState, useEffect } from 'react';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import useShoeStore from '../store/useShoeStore';


const ShoeUploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    categories: [],
    collections: [],
    colorOptions: [],
    sizeOptions: Array.from({ length: 8 }, (_, i) => 40 + i),
    widthOptions: ['Standard'],
    soleOptions: [],
    lastOptions: [],
    materialOptions: [],
    variants: []
  });


  const {options, fetchOptions, generateVariants} = useShoeStore()
  // Fetch all options on mount
  useEffect(() => {
    fetchOptions();
  }, []);

  // Handle image upload for color options
  const handleColorImageUpload = async (res, colorIndex) => {
    const updatedColors = [...formData.colorOptions];
    updatedColors[colorIndex].images = updatedColors[colorIndex].images || [];
    updatedColors[colorIndex].images.push({
      url: res.url,
      publicId: res.fileId,
      isPrimary: updatedColors[colorIndex].images.length === 0
    });
    
    setFormData({ ...formData, colorOptions: updatedColors });
    toast.success('Image uploaded!');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/shoes/shoes', formData);
      toast.success('Shoe product created successfully!');
      // Reset form or redirect
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Upload New Shoe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Product Name*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Base Price*</label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
              className="w-full p-3 border rounded-lg"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description*</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Categories & Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Categories</label>
            <select
              multiple
              value={formData.categories}
              onChange={(e) => setFormData({
                ...formData,
                categories: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full p-3 border rounded-lg h-auto min-h-[42px]"
            >
              {options.allCategories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Collections</label>
            <select
              multiple
              value={formData.collections}
              onChange={(e) => setFormData({
                ...formData,
                collections: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full p-3 border rounded-lg h-auto min-h-[42px]"
            >
              {options.allCollections.map(collection => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Color Options */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Color Options</h2>
          
          <div className="space-y-6">
            {formData.colorOptions.map((color, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-2">Color Name*</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => {
                        const updated = [...formData.colorOptions];
                        updated[index].name = e.target.value;
                        setFormData({...formData, colorOptions: updated});
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Hex Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hexCode}
                        onChange={(e) => {
                          const updated = [...formData.colorOptions];
                          updated[index].hexCode = e.target.value;
                          setFormData({...formData, colorOptions: updated});
                        }}
                        className="h-10 w-10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.hexCode}
                        onChange={(e) => {
                          const updated = [...formData.colorOptions];
                          updated[index].hexCode = e.target.value;
                          setFormData({...formData, colorOptions: updated});
                        }}
                        className="flex-1 p-2 border rounded"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2">Images</label>
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
                      <IKUpload
                        fileName={`shoe-${formData.name}-${color.name}-${Date.now()}.jpg`}
                        onSuccess={(res) => handleColorImageUpload(res, index)}
                        onError={() => toast.error('Image upload failed')}
                        className="hidden"
                        id={`color-upload-${index}`}
                      />
                      <label
                        htmlFor={`color-upload-${index}`}
                        className="inline-block px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Upload Image
                      </label>
                    </IKContext>
                  </div>
                </div>
                
                {/* Image previews */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {color.images?.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <IKImage
                        path={image.publicId}
                        transformation={[{
                          height: 100,
                          width: 100,
                          crop: 'fit'
                        }]}
                        className="h-24 w-24 object-cover rounded border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.colorOptions];
                            updated[index].images.splice(imgIndex, 1);
                            setFormData({...formData, colorOptions: updated});
                          }}
                          className="p-1 bg-white text-red-500 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formData.colorOptions];
                    updated.splice(index, 1);
                    setFormData({...formData, colorOptions: updated});
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove Color
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                colorOptions: [...formData.colorOptions, { name: '', hexCode: '#000000', images: [] }]
              })}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              + Add Color Option
            </button>
          </div>
        </div>

        {/* Other Variant Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Size Options */}
          <div>
            <h3 className="font-medium mb-2">Available Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => 36 + i).map(size => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sizeOptions.includes(size)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.sizeOptions, size]
                        : formData.sizeOptions.filter(s => s !== size);
                      setFormData({...formData, sizeOptions: updated});
                    }}
                  />
                  <span>EU {size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Width Options */}
          <div>
            <h3 className="font-medium mb-2">Available Widths</h3>
            <div className="space-y-2">
              {['Narrow', 'Standard', 'Wide', 'Extra Wide'].map(width => (
                <label key={width} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.widthOptions.includes(width)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.widthOptions, width]
                        : formData.widthOptions.filter(w => w !== width);
                      setFormData({...formData, widthOptions: updated});
                    }}
                  />
                  <span>{width}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Other Options */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Sole Types</h3>
              <select
                multiple
                value={formData.soleOptions}
                onChange={(e) => setFormData({
                  ...formData,
                  soleOptions: Array.from(e.target.selectedOptions, opt => opt.value)
                })}
                className="w-full p-2 border rounded"
              >
                {options.allSoles.map(sole => (
                  <option key={sole._id} value={sole._id}>
                    {sole.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Last Types</h3>
              <select
                multiple
                value={formData.lastOptions}
                onChange={(e) => setFormData({
                  ...formData,
                  lastOptions: Array.from(e.target.selectedOptions, opt => opt.value)
                })}
                className="w-full p-2 border rounded"
              >
                {options.allLasts.map(last => (
                  <option key={last._id} value={last._id}>
                    {last.name} ({last.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <select
                multiple
                value={formData.materialOptions}
                onChange={(e) => setFormData({
                  ...formData,
                  materialOptions: Array.from(e.target.selectedOptions, opt => opt.value)
                })}
                className="w-full p-2 border rounded"
              >
                {options.allMaterials.map(material => (
                  <option key={material._id} value={material._id}>
                    {material.name} ({material.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Variant Generation */}
        <div className="border-t pt-6">
          <button
            type="button"
            onClick={generateVariants}
            disabled={formData.colorOptions.length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Generate Variants ({formData.variants.length} generated)
          </button>
          
          {/* Variant summary */}
          {formData.variants.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Variant Summary</h3>
              <p>
                {formData.colorOptions.length} colors × 
                {formData.sizeOptions.length} sizes × 
                {formData.widthOptions.length} widths × 
                {formData.soleOptions.length} soles × 
                {formData.lastOptions.length} lasts × 
                {formData.materialOptions.length} materials
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total variants: {formData.variants.length}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={formData.variants.length === 0}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Create Shoe Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoeUploadForm;