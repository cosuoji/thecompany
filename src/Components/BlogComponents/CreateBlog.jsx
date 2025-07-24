import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiImage, FiType, FiUpload } from 'react-icons/fi';
import { IKImage, IKContext, IKUpload } from 'imagekitio-react';
import useBlogStore from '../../store/blogStore';
import { useUserStore } from '../../store/useUserStore';
import { slugify } from '../../utils/slugify';
import { PullQuote } from './PullQuote';


const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headerImageUrl: '',
    innerImageForFeaturedUrl: '',
    featured: false,
    author: '',
    category: '',
    contentBlocks: [],
    tags: []
  });

  const { createBlog } = useBlogStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ImageKit upload handlers
  const onHeaderImageUploadSuccess = (res) => {
    console.log(res.url)
    setFormData(prev => ({ ...prev, headerImageUrl: res.url }));
  };

  const onFeaturedImageUploadSuccess = (res) => {
    setFormData(prev => ({ ...prev, innerImageForFeaturedUrl: res.url }));
  };

  const onImageBlockUploadSuccess = (res, index) => {
    updateContentBlock(index, { 
      src: res.url,
      alt: formData.contentBlocks[index].alt || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.headerImageUrl) {
        throw new Error('Please fill all required fields');
      }
  
      // Prepare the data object
      const blogData = {
        title: formData.title,
        magazineIssue: formData.magazineIssue || "",
        description: formData.description,
        headerImage: formData.headerImageUrl,
        innerImageForFeatured: formData.innerImageForFeaturedUrl,
        featured: formData.featured,
        author: formData.author,
        category: formData.category,
        slug: slugify(formData.title),
        tags: formData.tags,
        contentBlocks: formData.contentBlocks,
        publishedAt: new Date().toISOString()
      };
  
      // Debug the data before sending
      console.log('Submitting:', JSON.stringify(blogData, null, 2));
  
      const newBlog = await createBlog(blogData, user.token);
      navigate(`/blog`);
      
    } catch (err) {
      console.error('Submission error:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Content Block Handlers
  const addTextBlock = () => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type: 'text', content: '' }
      ]
    }));
  };

  const addImageBlock = () => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type: 'image', src: '', alt: '', layout: 'default', caption: '' }
      ]
    }));
  };

  const addPullQuoteBlock = () => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type: 'pull-quote', text: '' }
      ]
    }));
  };

  // Add this new function to create a side-by-side image block
  const addSideBySideImagesBlock = () => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { 
          type: 'side-by-side-images', 
          images: [
            { src: '', alt: '', caption: '' },
            { src: '', alt: '', caption: '' }
          ]
        }
      ]
    }));
  };



  const updateContentBlock = (index, updates) => {
    setFormData(prev => {
      const updatedBlocks = [...prev.contentBlocks];
      updatedBlocks[index] = { ...updatedBlocks[index], ...updates };
      return { ...prev, contentBlocks: updatedBlocks };
    });
  };

  const removeContentBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== index)
    }));
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      
      <IKContext
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/ldhzgky9pk"}
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Post Information</h2>
            
            <div>
              <label className="block mb-2 font-medium">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">What Magazine Issue is this for?</label>
              <input
                type="text"
                name="magazineIssue"
                value={formData.magazineIssue}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg min-h-[100px]"
                required
              />
            </div>

            {/* Header Image Upload */}
            <div>
              <label className="block mb-2 font-medium">Header Image*</label>
              <IKUpload
                fileName={`header-${Date.now()}`}
                onSuccess={onHeaderImageUploadSuccess}
                onError={(err) => {
                  console.error('Upload Error Details:', {
                    message: err.message,
                    name: err.name,
                    stack: err.stack
                  });
                  alert('Image upload failed. Please try again.');
                }}
                onUploadStart={() => console.log('Upload started')}
                onUploadProgress={(progress) => console.log('Progress:', progress)}
                className="hidden"
                id="headerImageUpload"
              />
              <label
                htmlFor="headerImageUpload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                <FiUpload /> Upload
              </label>
              {formData.headerImageUrl && (
                <div className="mt-2">
                  <IKImage
                    src={formData.headerImageUrl}
                    transformation={[{ height: 200, width: 300 }]}
                    className="h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block mb-2 font-medium">Featured Image</label>
              <IKUpload
                fileName={`featured-${Date.now()}`}
                onSuccess={onFeaturedImageUploadSuccess}
                onError={(err) => {
                  console.error('Upload Error Details:', {
                    message: err.message,
                    name: err.name,
                    stack: err.stack
                  });
                  alert('Image upload failed. Please try again.');
                }}
                onUploadStart={() => console.log('Upload started')}
                onUploadProgress={(progress) => console.log('Progress:', progress)}
                className="hidden"
                id="featuredImageUpload"
              />
              <label
                htmlFor="featuredImageUpload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                <FiUpload /> Upload
              </label>
              {formData.innerImageForFeaturedUrl && (
                <div className="mt-2">
                  <IKImage
                    src={formData.innerImageForFeaturedUrl}
                    transformation={[{ height: 200, width: 300 }]}
                    className="h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-2 font-medium">Author*</label>
                <input
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block mb-2 font-medium">Featured Post?</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span>Feature this post</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim());
                  setFormData(prev => ({ ...prev, tags }));
                }}
                className="w-full p-3 border rounded-lg"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* Category Section */}
          <div>
            <label className="block mb-2 font-medium">Category*</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select a category</option>
              <option value="news">News</option>
              <option value="masters-of-the-craft">Masters Of The Craft</option>
              <option value="moving-hands">Moving Hands</option>
              <option value="our-advice">Our Advice</option>
            </select>
          </div>

          {/* Content Blocks */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Blocks</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addTextBlock}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FiType /> Add Text
                </button>
                <button
                  type="button"
                  onClick={addImageBlock}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FiImage /> Add Image
                </button>
                <button
                    type="button"
                    onClick={addPullQuoteBlock}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FiPlus /> Add Pull Quote
                  </button>
                  <button
                    type="button"
                    onClick={addSideBySideImagesBlock}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FiImage /> Add Side-by-Side Images
                  </button>
              </div>
            </div>

            {formData.contentBlocks.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                Click the buttons above to start building your post
              </div>
            )}

            {formData.contentBlocks.map((block, index) => (
              <div key={index} className="border p-4 rounded-lg relative group">
                <button
                  type="button"
                  onClick={() => removeContentBlock(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove block"
                >
                  <FiTrash2 />
                </button>

                {block.type === 'text' ? (
                  <div>
                    <label className="block mb-2 font-medium">Text Content*</label>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateContentBlock(index, { content: e.target.value })}
                      className="w-full p-3 border rounded-lg min-h-[150px]"
                      required
                      placeholder="Write your content here..."
                    />
                  </div>
                ) : block.type === 'image' ? (
                  <div className="space-y-4">
                    {/* Your existing image block UI */}
                    <div>
                      <label className="block mb-2 font-medium">Image*</label>
                      <IKUpload
                        fileName={`content-${Date.now()}-${index}`}
                        onSuccess={(res) => onImageBlockUploadSuccess(res, index)}
                        className="hidden"
                        id={`imageUpload-${index}`}
                      />
                      <label
                        htmlFor={`imageUpload-${index}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                      >
                        <FiUpload /> Upload Image
                      </label>
                      {block.src && (
                        <div className="mt-2">
                          <IKImage
                            src={block.src}
                            transformation={[{ height: 200, width: 300 }]}
                            className="h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Layout*</label>
                      <select
                        value={block.layout}
                        onChange={(e) => updateContentBlock(index, { layout: e.target.value })}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="default">Default</option>
                        <option value="full">Full Width</option>
                        <option value="sideBySide">Side by Side</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Caption (optional)</label>
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => updateContentBlock(index, { caption: e.target.value })}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Caption text..."
                      />
                    </div>
                  </div>
                ) : block.type === 'side-by-side-images' ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Side-by-Side Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {block.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="space-y-2">
                          <div>
                            <label className="block mb-1 font-medium">Image {imgIndex + 1}*</label>
                            <IKUpload
                              fileName={`side-image-${index}-${imgIndex}-${Date.now()}`}
                              onSuccess={(res) => {
                                const updatedImages = [...block.images];
                                updatedImages[imgIndex] = { 
                                  ...updatedImages[imgIndex], 
                                  src: res.url 
                                };
                                updateContentBlock(index, { images: updatedImages });
                              }}
                              className="hidden"
                              id={`sideImageUpload-${index}-${imgIndex}`}
                            />
                            <label
                              htmlFor={`sideImageUpload-${index}-${imgIndex}`}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm"
                            >
                              <FiUpload /> Upload Image {imgIndex + 1}
                            </label>
                            {image.src && (
                              <div className="mt-2">
                                <IKImage
                                  src={image.src}
                                  transformation={[{ height: 200, width: 300 }]}
                                  className="h-32 object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block mb-1 font-medium">Alt Text*</label>
                            <input
                              type="text"
                              value={image.alt}
                              onChange={(e) => {
                                const updatedImages = [...block.images];
                                updatedImages[imgIndex] = { 
                                  ...updatedImages[imgIndex], 
                                  alt: e.target.value 
                                };
                                updateContentBlock(index, { images: updatedImages });
                              }}
                              className="w-full p-2 border rounded-lg text-sm"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-1 font-medium">Caption</label>
                            <input
                              type="text"
                              value={image.caption}
                              onChange={(e) => {
                                const updatedImages = [...block.images];
                                updatedImages[imgIndex] = { 
                                  ...updatedImages[imgIndex], 
                                  caption: e.target.value 
                                };
                                updateContentBlock(index, { images: updatedImages });
                              }}
                              className="w-full p-2 border rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 font-medium">Pull Quote Text*</label>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateContentBlock(index, { content: e.target.value })}
                      className="w-full p-3 border rounded-lg min-h-[100px]"
                      required
                      placeholder="Enter your pull quote text..."
                    />
                    <div className="mt-4 p-4 border-l-4 border-gray-400 bg-gray-50">
                      <PullQuote text={block.content || '[Pull quote preview]'} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>


          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : 'Publish Post'}
            </button>
          </div>
        </form>
      </IKContext>
    </div>
  );
};

export default CreateBlog;