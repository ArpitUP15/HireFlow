import axios from "axios";


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api =
  axios.create({
    baseURL:
      import.meta.env.VITE_API_URL ||
      "http://localhost:5001/api",

    withCredentials: true,

    headers: {
      "Content-Type":
        "application/json",
    },
  });


// =====================================================
// REQUEST INTERCEPTOR
//
// Adds organization ID ONLY when one exists.
// Public landing-page APIs work without it.
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

  (error) =>
    Promise.reject(error)
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.warn(
        "Authentication required:",
        error.response?.data
          ?.message
      );
    }


    return Promise.reject(
      error
    );
  }
);


// =====================================================
// EXPORT
// =====================================================

export default api;