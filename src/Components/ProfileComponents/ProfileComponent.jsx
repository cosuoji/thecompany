import { useUserStore } from "../../store/useUserStore";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useDocumentTitle from "../../hooks/useDocumentTitle";

 
const ProfilePage = () => {
  const { user, updateProfile } = useUserStore();
  const [isDisabled, setDisabled] = useState(true);

  useDocumentTitle(`Profile - ${user?.profile?.firstName} ${user?.profile?.lastName} |`)

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold text-[#EAE4D5] mb-6">Profile Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#EAE4D5] mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled={isDisabled}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
          />
        </div>
        
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-[#EAE4D5] text-[#0a0a0a] font-medium rounded-lg hover:bg-[#f0e5d8] transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;