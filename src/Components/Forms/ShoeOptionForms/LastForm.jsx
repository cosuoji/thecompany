import { useState } from 'react';
import useShoeOptionsStore from '../../../store/useShoeOptionsStore';

const LastForm = () => {
  const { createLast } = useShoeOptionsStore();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    toeShape: 'Round',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLast(formData);
    setFormData({
      code: '',
      name: '',
      toeShape: 'Round',
      description: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Last</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Last Code*</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="e.g., L-2023-RD"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="e.g., Round Toe Dress Last"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Toe Shape*</label>
          <select
            name="toeShape"
            value={formData.toeShape}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {['Round', 'Square', 'Pointed', 'Almond'].map(shape => (
              <option key={shape} value={shape}>{shape}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Details about the last shape and usage"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Last
        </button>
      </form>
    </div>
  );
};

export default LastForm;