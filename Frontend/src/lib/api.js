import axios from "axios";
import { toast } from "sonner";

// Create axios instance with default config
const api = axios.create({  
  baseURL: import.meta.env.VITE_API_URL || "https://seva-kendra-backend.vercel.app/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Extract error message from response
    let errorMessage = "An error occurred";

    if (error.response) {
      // Server responded with error status
      const { data, status, config } = error.response;

      if (status === 401) {
        // Handle unauthorized access
        errorMessage = data?.message || "Session expired. Please login again.";
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(new Error(errorMessage));
      }

      // Extract error message from various possible formats
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage =
          typeof data.error === "string" ? data.error : data.error.message;
      } else if (typeof data === "string") {
        errorMessage = data;
      } else if (status === 404) {
        errorMessage = `Route not found: ${config.method?.toUpperCase()} ${config.url}`;
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (status >= 400 && status < 500) {
        errorMessage = data?.message || "Request failed. Please check your input.";
      }

      // Log error details for debugging
      console.error("API Error:", {
        status,
        url: config.url,
        method: config.method,
        message: errorMessage,
        data,
      });
    } else if (error.request) {
      // Request made but no response received
      errorMessage = "Network error. Please check your connection.";
      console.error("Network Error:", error.request);
    } else {
      // Error in request setup
      errorMessage = error.message || "Failed to make request";
      console.error("Request Setup Error:", error.message);
    }

    // Show error toast
    toast.error(errorMessage);

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
