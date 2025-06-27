// hooks/useRedirect.js
import { useLocation, useNavigate } from 'react-router-dom';

export const useRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setRedirect = () => {
    localStorage.setItem('redirectPath', location.pathname);
  };

  const redirect = () => {
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath');
    navigate(redirectPath);
  };

  return { setRedirect, redirect };
};