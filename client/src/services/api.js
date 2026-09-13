import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed");

      // DO NOT remove a JWT from localStorage here.
      // HireFlow uses an HTTP-only cookie.
    }

    return Promise.reject(error);
  }
);
export default api;