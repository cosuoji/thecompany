import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import useShoeStore from '../../store/useShoeStore';

export const ProductGrid = () => {
  const { shoes, loading, error, fetchShoes } = useShoeStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    priceRange: [0, 10000000],
    materials: [],
    categories: [],
    widths: [],
    soles: [],
    lasts: []
  });

  useEffect(() => {
    fetchShoes();
  }, [fetchShoes]);

  // Extract all available filter options from shoes
  const allSizes = [...new Set(shoes.flatMap(shoe => shoe.sizeOptions))];
  const allColors = [...new Set(shoes.flatMap(shoe => 
    shoe.colorOptions.map(color => color.name)
  ))];
  const allMaterials = [...new Set(shoes.flatMap(shoe => 
    shoe.materialOptions.map(material => material.type)
  ))];
  const allCategories = [...new Set(shoes.flatMap(shoe => 
    shoe.categories.map(cat => cat.name)
  ))];
  const allWidths = [...new Set(shoes.flatMap(shoe => 
    shoe.widthOptions
  ))];
  const allSoles = [...new Set(shoes.flatMap(shoe => 
    shoe.soleOptions.map(sole => sole.name)
  ))];
  const allLasts = [...new Set(shoes.flatMap(shoe => 
    shoe.lastOptions.map(last => last.name)
  ))];

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const toggleAccordion = (accordion) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters(prev => ({
      ...prev,
      priceRange: newRange
    }));
  };

  const resetFilters = () => {
    setFilters({
      sizes: [],
      colors: [],
      priceRange: [0, 10000000],
      materials: [],
      categories: [],
      widths: [],
      soles: [],
      lasts: []
    });
  };

  // Filter shoes based on all active filters
  const filteredShoes = shoes.filter(shoe => {
    const shoePrice = shoe.discountedPrice || shoe.basePrice;
    const priceInRange = shoePrice >= filters.priceRange[0] && 
                        shoePrice <= filters.priceRange[1];
    const sizeMatch = filters.sizes.length === 0 || 
                     shoe.sizeOptions.some(size => filters.sizes.includes(size));
    const colorMatch = filters.colors.length === 0 || 
                      shoe.colorOptions.some(color => filters.colors.includes(color.name));
    const materialMatch = filters.materials.length === 0 || 
                         shoe.materialOptions.some(material => filters.materials.includes(material.type));
    const categoryMatch = filters.categories.length === 0 || 
                         shoe.categories.some(cat => filters.categories.includes(cat.name));
    const widthMatch = filters.widths.length === 0 || 
                      shoe.widthOptions.some(width => filters.widths.includes(width));
    const soleMatch = filters.soles.length === 0 || 
                     shoe.soleOptions.some(sole => filters.soles.includes(sole.name));
    const lastMatch = filters.lasts.length === 0 || 
                     shoe.lastOptions.some(last => filters.lasts.includes(last.name));
    
    return priceInRange && sizeMatch && colorMatch && materialMatch && 
           categoryMatch && widthMatch && soleMatch && lastMatch;
  });

  // Accordion filter sections
  const filterSections = [
    {
      id: 'price',
      title: 'Price Range',
      content: (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              ${filters.priceRange[0].toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-gray-500">
              ${filters.priceRange[1].toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="range"
              min="0"
              max="10000000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-full accent-[#4B371C]"
            />
            <input
              type="range"
              min="0"
              max="10000000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-full accent-[#4B371C]"
            />
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'Categories',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {allCategories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleFilterChange('categories', category)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'sizes',
      title: 'Sizes',
      content: (
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map(size => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => handleFilterChange('sizes', size)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">EU {size}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'widths',
      title: 'Widths',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {allWidths.map(width => (
            <label key={width} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.widths.includes(width)}
                onChange={() => handleFilterChange('widths', width)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{width}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'colors',
      title: 'Colors',
      content: (
        <div className="grid grid-cols-4 gap-2">
          {allColors.map(color => (
            <label key={color} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => handleFilterChange('colors', color)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'materials',
      title: 'Materials',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {allMaterials.map(material => (
            <label key={material} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={() => handleFilterChange('materials', material)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'soles',
      title: 'Soles',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {allSoles.map(sole => (
            <label key={sole} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.soles.includes(sole)}
                onChange={() => handleFilterChange('soles', sole)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{sole}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'lasts',
      title: 'Lasts',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {allLasts.map(last => (
            <label key={last} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.lasts.includes(last)}
                onChange={() => handleFilterChange('lasts', last)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{last}</span>
            </label>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Our Premium Footwear Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our handcrafted shoes made with the finest materials and attention to detail. 
            Each pair is designed for comfort, style, and durability.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500">
            Showing {filteredShoes.length} {filteredShoes.length === 1 ? 'item' : 'items'}
          </div>
          <button
            onClick={toggleFilter}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Filters
          </button>
        </div>

        {/* Filter Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Filter Products</h3>
                <button onClick={toggleFilter} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Accordion Filters */}
              <div className="space-y-2">
                {filterSections.map((section) => (
                  <div key={section.id} className="border-b border-gray-200">
                    <button
                      className="flex justify-between items-center w-full py-3 text-left text-sm font-medium text-gray-700 focus:outline-none"
                      onClick={() => toggleAccordion(section.id)}
                    >
                      <span>{section.title}</span>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${
                          activeAccordion === section.id ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeAccordion === section.id ? 'max-h-96 py-2' : 'max-h-0'
                      }`}
                    >
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={toggleFilter}
                  className="px-4 py-2 border bg-[#4B371C] border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredShoes.map(shoe => (
            <ProductCard 
              key={shoe._id} 
              product={shoe} 
              className="hover:shadow-lg transition-shadow duration-300"
            />
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredShoes.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              No shoes found matching your filters
            </h2>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-[#4B371C] text-white rounded-md hover:bg-[#5a452a]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};