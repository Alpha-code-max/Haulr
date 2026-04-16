import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base backend URL
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("haulr_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === "/login";
      // Skip auto-redirect for background auth checks (checkAuth on app load)
      const isAuthCheck = error.config?.headers?.["X-Auth-Check"] === "true";

      if (!isLoginPage && !isAuthCheck) {
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false
        });
        localStorage.removeItem("haulr_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
