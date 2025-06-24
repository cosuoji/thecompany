import { useState } from 'react';
import useShoeOptionsStore from '../../../store/useShoeOptionsStore';

const MaterialForm = () => {
  const { createMaterial } = useShoeOptionsStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('Leather');
  const [isRecycled, setIsRecycled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMaterial({ 
      name, 
      type,
      sustainabilityData: { isRecycled }
    });
    setName('');
    setType('Leather');
    setIsRecycled(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Material</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Type*</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {['Leather', 'Synthetic', 'Textile', 'Rubber', 'Suede'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recycled"
            checked={isRecycled}
            onChange={(e) => setIsRecycled(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="recycled" className="ml-2 text-sm">
            Made from recycled materials
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Material
        </button>
      </form>
    </div>
  );
};

export default MaterialForm;