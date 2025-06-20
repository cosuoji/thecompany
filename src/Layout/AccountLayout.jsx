import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const AccountLayout = () => {
  const location = useLocation();
  const { user, logout } = useUserStore();

  const navItems = [
    { path: '/account/profile', label: 'Profile' },
    { path: '/account/addresses', label: 'Addresses' },
    { path: '/account/orders', label: 'Order History' },
  ];

  return (
    <div className="min-h-screen  text-[#B6B09F]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[#1a1a1a] p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold text-[#EAE4D5] mb-6">My Account</h2>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-[#4B371C] text-[#EAE4D5]'
                        : 'text-[#B6B09F] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-[#B6B09F] hover:bg-[#2a2a2a] rounded-md transition-colors mt-4"
                >
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1a1a1a] p-6 rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;