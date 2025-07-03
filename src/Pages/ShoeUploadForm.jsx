import { useState, useEffect } from 'react';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { toast } from 'react-hot-toast';
import useShoeStore from '../store/useShoeStore';


const ShoeUploadForm = () => {
  const {
    options,
    fetchOptions,
    generateVariants,
    createShoe, 
    loading,
     error
  } = useShoeStore();
  
  const [coverImage, setCoverImage] = useState(null);


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

  
  useEffect(() => {
    fetchOptions().then(() => {
    });
  }, [fetchOptions]);



  //Submit form

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data in correct format
      const submissionData = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        categories: formData.categories,
        collections: formData.collections,
        coverImage: coverImage ? {
          url: coverImage.url,
          publicId: coverImage.publicId
        } : null,
      
        colorOptions: formData.colorOptions.map(color => ({
          name: color.name,
          hexCode: color.hexCode,
          images: color.images || []
        })),
      
        sizeOptions: formData.sizeOptions,
        widthOptions: formData.widthOptions,
      
        soleOptions: formData.soleOptions.map(soleId => {
          const sole = options.soles.find(s => s._id === soleId);
          return {
            name: sole?.name || `Sole ${soleId}`,
            description: sole?.description || ''
          };
        }),
      
        lastOptions: formData.lastOptions.map(lastId => {
          const last = options.lasts.find(l => l._id === lastId);
          return {
            name: last?.name || `Last ${lastId}`,
            description: last?.description || '',
            image: last?.image || '',
            code: last?.code || "",
          };
        }),
      
        materialOptions: formData.materialOptions.map(materialId => {
          const material = options.materials.find(m => m._id === materialId);
          return {
            name: material?.name || 'Unnamed Material',
            type: material?.type || 'Leather',
            sustainabilityRating: material?.sustainabilityRating || 0
          };
        })
      };
      
      const response = await createShoe(submissionData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shoe');
    }
  };

  // Generate variants when options change
  useEffect(() => {
    if (formData.colorOptions.length > 0) {
      const variants = generateVariants({
        colorOptions: formData.colorOptions,
        sizeOptions: formData.sizeOptions,
        widthOptions: formData.widthOptions,
        soleOptions: formData.soleOptions,
        lastOptions: formData.lastOptions,
        materialOptions: formData.materialOptions
      });
      setFormData(prev => ({ ...prev, variants }));
    }
  }, [
    formData.colorOptions,
    formData.sizeOptions,
    formData.widthOptions,
    formData.soleOptions,
    formData.lastOptions,
    formData.materialOptions,
    generateVariants
  ]);

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


  // In your component
  const handleGenerateVariants = () => {
    const variants = generateVariants({
      colorOptions: formData.colorOptions,
      sizeOptions: formData.sizeOptions,
      widthOptions: formData.widthOptions,
      soleOptions: formData.soleOptions,
      lastOptions: formData.lastOptions,
      materialOptions: formData.materialOptions
    });
    
    setFormData(prev => ({
      ...prev,
      variants
    }));
  };


  if (loading) {
    return <div>Loading options...</div>;
  }

  if (error) {
    return <div>Error loading options: {error.message}</div>;
  }

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
        {/* Cover Image */}
        <div>
          <label className="block mb-2 font-medium">Cover Image*</label>
          <IKUpload
            fileName={`shoe-cover-${formData.name}-${Date.now()}.jpg`}
            onSuccess={(res) => setCoverImage({
              url: res.url,
              publicId: res.fileId
            })}
            onError={() => toast.error('Cover image upload failed')}
            className="hidden"
            id="cover-upload"
          />
          
          <div className="flex items-center gap-4">
            <label
              htmlFor="cover-upload"
              className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              {coverImage ? 'Change Cover' : 'Upload Cover'}
            </label>
            
            {coverImage && (
              <div className="relative group">
                <IKImage
                  src={coverImage.url}
                  transformation={[{ height: 100, width: 100, crop: 'fit' }]}
                  urlEndpoint="https://ik.imagekit.io/ldhzgky9pk"
                  className="h-24 w-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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
              {options?.categories?.map(category => (
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
              {options?.collections?.map(collection => (
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
                </div>
                </div>
                
                {/* Image previews */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {color?.images?.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <IKImage
                        src={image.url}
                        transformation={[{
                          height: 100,
                          width: 100,
                          crop: 'fit'
                        }]}
                         urlEndpoint="https://ik.imagekit.io/ldhzgky9pk"
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
                {options?.soles?.map(sole => (
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
                {options?.lasts?.map(last => (
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
                {options?.materials?.map(material => (
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