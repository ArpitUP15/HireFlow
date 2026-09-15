import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach organization ID automatically
api.interceptors.request.use(
  (config) => {
    const organizationId =
      localStorage.getItem(
        "currentOrganizationId"
      );

    if (organizationId) {
      config.headers["x-organization-id"] =
        organizationId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API errors globally
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "Authentication required"
      );
    }

    return Promise.reject(error);
  }
);

export default api;