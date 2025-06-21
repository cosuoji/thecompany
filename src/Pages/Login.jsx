import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added Link import
import { useUserStore } from '../store/useUserStore';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [error, setError] = useState(null);

  const { login, loading, user} = useUserStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
   try{
    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success('Logged in successfully!');
      navigate(location.state?.from || '/account', { replace: true });
    }

    if (!success) {
      setError('Invalid credentials');
    }
  } catch (err) {
    setError(err.message);
  }
    
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#B6B09F] px-6 md:px-20 py-20 space-y-14 animate-fadeUp">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#EAE4D5] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#EAE4D5] mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#B6B09F]/30 rounded-lg text-[#EAE4D5] focus:outline-none focus:border-[#EAE4D5]"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 px-4 py-2 ${loading ? 'bg-[#B6B09F]' : 'bg-[#EAE4D5]'} text-[#0a0a0a] font-medium rounded-lg transition-colors duration-200`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Added signup link */}
        <div className="text-center pt-4">
          <p className="text-[#B6B09F]">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              state={{ from: location.state?.from }}
              className="text-[#EAE4D5] hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;