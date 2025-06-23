import { useState, useEffect } from 'react';
import useShoeOptionsStore from '../../store/useShoeOptionsStore';

const CategoryForm = () => {
  const { 
    createCategory,
    categories,
    fetchCategories 
  } = useShoeOptionsStore();
  
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createCategory({ 
        name, 
        parent: parent || null 
      });
      setName('');
      setParent('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Parent Category</label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">None (Top Level)</option>
            {categories
              .filter(cat => !cat.parent)
              .map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;