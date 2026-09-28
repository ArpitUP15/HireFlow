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

/*
|--------------------------------------------------------------------------
| Organization Header
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const rawOrganizationId =
      localStorage.getItem(
        "currentOrganizationId"
      );

    if (
      rawOrganizationId &&
      rawOrganizationId !== "null" &&
      rawOrganizationId !== "undefined"
    ) {
      const organizationId =
        rawOrganizationId.trim();

      if (
        /^[a-fA-F0-9]{24}$/.test(
          organizationId
        )
      ) {
        config.headers[
          "x-organization-id"
        ] = organizationId;
      } else {
        localStorage.removeItem(
          "currentOrganizationId"
        );
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
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

export default api;