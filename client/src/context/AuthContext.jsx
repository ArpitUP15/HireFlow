import { useEffect, useState } from "react";

import AuthContext from "./AuthContextValue";

import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  getMe
} from "../services/authService";

export const AuthProvider = ({
  children
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // --------------------------------------
  // Load current user
  // --------------------------------------

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();

        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // --------------------------------------
  // Login
  // --------------------------------------

  const login = async (
    email,
    password
  ) => {
    const response =
      await loginRequest({
        email,
        password
      });

    setUser(response.user);

    return response;
  };

  // --------------------------------------
  // Register
  // --------------------------------------

  const register = async (
    userData
  ) => {
    const response =
      await registerRequest(userData);

    setUser(response.user);

    return response;
  };

  // --------------------------------------
  // Logout
  // --------------------------------------

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};