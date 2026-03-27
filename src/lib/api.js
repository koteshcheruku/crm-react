import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach access token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized responses and refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if the refresh token endpoint itself returns a 401
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Request a new access token
        const res = await axios.post("/api/auth/refresh", { refreshToken });

        if (res.status === 200) {
          const newAccessToken = res.data.accessToken;

          // Update tokens in local storage
          localStorage.setItem("accessToken", newAccessToken);

          // If the backend rotates the refresh token, store that too
          if (res.data.refreshToken) {
            localStorage.setItem("refreshToken", res.data.refreshToken);
          }

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If the refresh token is expired or invalid, log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("crm-auth");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
