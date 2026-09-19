import axios from "axios";


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {

    const organizationId =
      localStorage.getItem(
        "currentOrganizationId"
      );


    if (organizationId) {

      config.headers[
        "x-organization-id"
      ] = organizationId;
    }


    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (!error.response) {

      console.error(
        "HireFlow API is unavailable:",
        error.message
      );
    }


    if (
      error.response?.status === 401
    ) {

      console.warn(
        "Authentication required."
      );
    }


    return Promise.reject(error);
  }
);


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;