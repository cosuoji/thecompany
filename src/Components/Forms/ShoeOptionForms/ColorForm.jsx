import { useState } from 'react';
import useShoeOptionsStore from '../../../store/useShoeOptionsStore';

const ColorForm = () => {
  const { createColor } = useShoeOptionsStore();
  const [name, setName] = useState('');
  const [hexCode, setHexCode] = useState('#000000');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createColor({ name, hexCode });
    setName('');
    setHexCode('#000000');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Color</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Color Code</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              className="h-10 w-10 cursor-pointer"
            />
            <input
              type="text"
              value={hexCode}
              onChange={(e) => setHexCode(e.target.value)}
              className="flex-1 p-2 border rounded"
              pattern="^#[0-9A-Fa-f]{6}$"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Color
        </button>
      </form>
    </div>
  );
};

export default ColorForm;