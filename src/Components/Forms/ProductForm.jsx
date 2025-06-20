import { useState } from "react";

// components/ProductForm.jsx
export const ProductForm = ({ type = 'regular' }) => {
    const [formData, setFormData] = useState({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      productType: type,
      // Magazine-specific fields
      magazineData: type === 'magazine' ? {
        issueNumber: '',
        publishDate: new Date(),
        pages: 0,
        isFeatured: false,
        coverImage: { url: '', publicId: '' }
      } : null,
      // Regular product fields
      variants: []
    });
  
    // Common form handlers
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    // Magazine image upload handler
    const handleImageUpload = (res) => {
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
    };
  
    // Submit handler works for both types
    const handleSubmit = async (e) => {
      e.preventDefault();
      await axios.post('/api/products', formData);
      // Success handling
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {/* Common fields */}
        <input name="name" value={formData.name} onChange={handleChange} />
        <input name="price" type="number" value={formData.price} onChange={handleChange} />
        
        {/* Magazine-specific fields */}
        {formData.productType === 'magazine' && (
          <>
            <input 
              name="magazineData.issueNumber"
              value={formData.magazineData.issueNumber}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                magazineData: {
                  ...prev.magazineData,
                  issueNumber: e.target.value
                }
              }))}
            />
            
            <IKUpload
              fileName={`magazine-${formData.magazineData.issueNumber}.jpg`}
              onSuccess={handleImageUpload}
            />
          </>
        )}
        
        <button type="submit">Save Product</button>
      </form>
    );
  };