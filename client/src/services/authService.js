import api from "./api";

// Register
export const register = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};

// Current user
export const getMe = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};