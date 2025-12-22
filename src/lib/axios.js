import axios from "axios";
import { useUserStore } from "../store/useUserStore";
import { tokenStorage } from "./tokenStorage"; // ✅ REQUIRED

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const isIOS = () =>
  /iP(hone|od|ad)/.test(navigator.userAgent);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

/* ----------------------------------
   REQUEST INTERCEPTOR (iOS SUPPORT)
---------------------------------- */
axiosInstance.interceptors.request.use(config => {
  if (isIOS()) {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ----------------------------------
   RESPONSE INTERCEPTOR (REFRESH)
---------------------------------- */
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axiosInstance.post(
          "/auth/refresh-token",
          {
            // ✅ iOS fallback
            refreshToken: isIOS()
              ? tokenStorage.getRefresh()
              : undefined,
          },
          { _retry: true }
        );

        // ✅ Store new tokens on iOS
        if (isIOS() && res.data?.accessToken) {
          tokenStorage.set(
            res.data.accessToken,
            res.data.refreshToken
          );
        }

        processQueue();
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        useUserStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
