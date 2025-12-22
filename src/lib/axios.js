import axios from "axios";
import { useUserStore } from "../store/useUserStore";
import { tokenStorage } from "./tokenStorage"; // ✅ REQUIRED

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const setupAxiosInterceptor = () => {
  // 1) REQUEST interceptor (new)
  axiosInstance.interceptors.request.use((cfg) => {
    const hasCookie = document.cookie.includes('accessToken=');
    if (!hasCookie) {
      const fb = localStorage.getItem('refreshToken');
      if (fb) cfg.headers['Authorization'] = `Bearer ${fb}`;
    }
    return cfg;
  });

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
          await useAuthStore.getState().refreshToken();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await useAuthStore.getState().logout();
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
