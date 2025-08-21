import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserStore } from "../../store/useUserStore";
import SEO from '../SEO';

const ProfilePage = () => {
  const { user, updateProfile } = useUserStore();
  const [isDisabled, setDisabled] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });




  // Update formData when user is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.user?.profile?.firstName || '',
        lastName: user?.user?.profile?.lastName || '',
        email: user?.user?.email || '',
        phone: user?.user?.profile?.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return <div className="text-[#B6B09F]">Loading profile...</div>;
  }

  return (
    <div>
             <SEO 
              title="My Profile"
              description="My Olu The Maker Profile"
              url="https://yourdomain.com/blog"
            />
      <h1 className="text-2xl font-bold text-[#EAE4D5] mb-6">Profile Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#EAE4D5] mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#EAE4D5] mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
