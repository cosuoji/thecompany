import { useState } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import useShoeOptionsStore from '../../../store/useShoeOptionsStore';

const CollectionForm = () => {
  const { createCollection } = useShoeOptionsStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    season: '',
    year: new Date().getFullYear(),
    coverImage: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCollection(formData);
    setFormData({
      name: '',
      description: '',
      season: '',
      year: new Date().getFullYear(),
      coverImage: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (res) => {
    setFormData(prev => ({
      ...prev,
      coverImage: {
        url: res.url,
        publicId: res.fileId
      }
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Collection Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Season</option>
            {['Spring', 'Summer', 'Fall', 'Winter', 'Holiday'].map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Year*</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max="2030"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          {formData.coverImage ? (
            <div className="mt-2 relative">
              <img 
                src={formData.coverImage.url} 
                alt="Collection cover" 
                className="h-40 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ) : (
            <IKContext
              urlEndpoint="https://ik.imagekit.io/your-account"
              publicKey="your_public_key"
              authenticator={async () => {
                const response = await fetch('/auth/imagekit');
                return await response.json();
              }}
            >
              <IKUpload
                fileName={`collection-${Date.now()}.jpg`}
                onSuccess={handleImageUpload}
                onError={() => toast.error('Image upload failed')}
                className="hidden"
                id="collection-upload"
              />
              <label
                htmlFor="collection-upload"
                className="inline-block px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                Upload Cover Image
              </label>
            </IKContext>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Collection
        </button>
      </form>
    </div>
  );
};

export default CollectionForm;