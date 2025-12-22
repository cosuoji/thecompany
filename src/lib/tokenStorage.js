export const tokenStorage = {
  set(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccess() {
    return localStorage.getItem("accessToken");
  },

  getRefresh() {
    return localStorage.getItem("refreshToken");
  },

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
