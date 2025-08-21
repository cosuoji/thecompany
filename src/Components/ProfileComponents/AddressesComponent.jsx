import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { toast } from 'react-hot-toast';
import SEO from '../SEO';


const AddressesPage = () => {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUserStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    isDefault: false
  });


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        await addAddress(formData);
        toast.success('Address added successfully');
      }
      setIsFormOpen(false);
      setEditingAddress(null);
      setFormData({
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        isDefault: false
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsFormOpen(true);
  };

  return (
    <div>
            <SEO 
              title="My Addresses"
              description="Addresses"
              url="https://yourdomain.com/blog"
            />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#EAE4D5]">My Addresses</h1>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingAddress(null);
          }}
          className="px-4 py-2 bg-[#4B371C] text-[#EAE4D5] rounded-lg hover:bg-[#5a452c] transition-colors"
        >
          Add New Address
        </button>
      </div>

      {/* Address Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#EAE4D5]">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingAddress(null);
                }}
                className="text-[#B6B09F] hover:text-[#EAE4D5]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Address Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#EAE4D5] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#EAE4D5] mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#EAE4D5] mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="w-4 h-4 text-[#4B371C] rounded focus:ring-[#4B371C]"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-[#EAE4D5]">
                  Set as default address
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full mt-4 px-6 py-2 bg-[#EAE4D5] text-[#0a0a0a] font-medium rounded-lg hover:bg-[#f0e5d8] transition-colors"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      {user?.addresses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 ${address.isDefault ? 'border-[#4B371C]' : 'border-[#B6B09F]/30'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#EAE4D5] capitalize">{address.type}</h3>
                  {address.isDefault && (
                    <span className="inline-block px-2 py-1 text-xs bg-[#4B371C] text-[#EAE4D5] rounded-md mt-1">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-[#B6B09F] hover:text-[#EAE4D5]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(address._id)}
                    className="text-[#B6B09F] hover:text-[#EAE4D5]"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-[#B6B09F]">{address.street}</p>
              <p className="text-[#B6B09F]">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-[#B6B09F]">{address.country}</p>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address._id)}
                  className="mt-3 text-sm text-[#4B371C] hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#B6B09F]">
          <p>You haven't added any addresses yet.</p>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;