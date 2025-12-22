import axios from "axios";
import { useUserStore } from "../store/useUserStore";


const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true, // send cookies to the server
});


const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/products',
  '/product/:id',
  '/magazine',
  '/blog',
  '/store',
  "/store/shoes/:slug"
];



const isPublicRoute = (url) => {
  return publicRoutes.some((route) => {
    const regex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
    return regex.test(url);
  });
};

  

export const setupAxiosInterceptor = () => {
  // 1) REQUEST interceptor (new)
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axiosInstance.post('/auth/refresh-token', {}, { _shouldRetry: false });
        return axiosInstance(original);
      } catch {
        useUserStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);


 // 2) RESPONSE interceptor (your existing one)
  axiosInstance.interceptors.response.use(
	(res) => res,
	async (error) => {
	  const originalRequest = error.config;
	  const url = new URL(originalRequest.url, window.location.origin).pathname;

	  if (originalRequest._shouldRetry === false) {
		return Promise.reject(error);
	  }

	  if (
		error.response?.status === 401 &&
		!originalRequest._retry &&
		!isPublicRoute(url)
	  ) {
		originalRequest._retry = true;
		try {
		  await useUserStore.getState().refreshToken();
		  return axiosInstance(originalRequest);
		} catch (refreshError) {
		  await useUserStore.getState().logout();
		  return Promise.reject(refreshError);
		}
	  }
	  return Promise.reject(error);
	}
  );
};
if (!axiosInstance.interceptors.response.handlers.length)
setupAxiosInterceptor();

export { axiosInstance as default};


  
