import { useState } from 'react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('size');

  // Size conversion data
  const sizeData = [
    { eu: 36, uk: 3, us: 5 },
    { eu: 37, uk: 4, us: 6 },
    { eu: 38, uk: 5, us: 7 },
    { eu: 39, uk: 6, us: 8 },
    { eu: 40, uk: 7, us: 9 },
    { eu: 41, uk: 8, us: 10 },
    { eu: 42, uk: 9, us: 11 },
    { eu: 43, uk: 10, us: 12 },
    { eu: 44, uk: 11, us: 13 },
  ];

  return (
    <div className="max-w-md mx-auto pt-2 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'size'
              ? 'text-[#4B371C] border-b-2 border-[#4B371C]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('size')}
        >
          What's my size
        </button>
        <button
          className={`flex-1 py-3 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'measurement'
              ? 'text-[#4B371C] border-b-2 border-[#4B371C]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('measurement')}
        >
          Measurement guide
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'size' ? (
          <div>
            <h3 className="text-lg font-medium mb-4">Size Conversion Chart</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EU
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UK
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      US
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sizeData.map((size, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {size.eu}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {size.uk}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {size.us}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">How to Measure Your Foot</h3>
            <p className="text-gray-600 mb-4">
              To find the perfect size, use a measuring tape to measure yourself following the steps explained below. We recommend that you keep the measuring tape loose and that you size up if you are in-between sizes.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-gray-700">
              <li>Place the tip of your bare foot against the wall.</li>
              <li>Place your foot on a piece of paper on a flat and solid surface and draw a line at the tip of your biggest toe using a pencil.</li>
              <li>Measure the length between the two lines.</li>
              <li>Refer to the chart below to find the corresponding shoe size.</li>
            </ol>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Foot Length to Size Chart</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Foot Length (cm)</th>
                    <th className="text-left py-2">EU Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">22.5-23.0</td>
                    <td className="py-2">36</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">23.0-23.5</td>
                    <td className="py-2">37</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">23.5-24.0</td>
                    <td className="py-2">38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">24.0-24.5</td>
                    <td className="py-2">39</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">24.5-25.0</td>
                    <td className="py-2">40</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeGuide;