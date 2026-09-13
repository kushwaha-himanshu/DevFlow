import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("devsync_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, clear token as it's invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem("devsync_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
