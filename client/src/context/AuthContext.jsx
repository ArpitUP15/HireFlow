import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  register as registerUser,
  login as loginUser,
  logout as logoutUser,
  getMe,
} from "../services/authService.js";


export const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [
    user,
    setUser,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);


  // ===================================================
  // CHECK AUTHENTICATION
  // ===================================================

  useEffect(() => {

    const checkAuthentication =
      async () => {

        try {

          const response =
            await getMe();


          if (
            response?.success &&
            response?.user
          ) {

            setUser(
              response.user
            );

            setIsAuthenticated(
              true
            );

          } else {

            setUser(null);

            setIsAuthenticated(
              false
            );
          }

        } catch (error) {

          setUser(null);

          setIsAuthenticated(
            false
          );

        } finally {

          setLoading(false);
        }
      };


    checkAuthentication();

  }, []);


  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    userData
  ) => {

    const response =
      await registerUser(
        userData
      );


    if (
      !response?.success ||
      !response?.user
    ) {
      throw new Error(
        response?.message ||
          "Registration failed"
      );
    }


    setUser(
      response.user
    );

    setIsAuthenticated(
      true
    );


    return response;
  };


  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (
    email,
    password
  ) => {

    const response =
      await loginUser({
        email,
        password,
      });


    if (
      !response?.success ||
      !response?.user
    ) {
      throw new Error(
        response?.message ||
          "Login failed"
      );
    }


    setUser(
      response.user
    );

    setIsAuthenticated(
      true
    );


    return response;
  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {

    try {

      await logoutUser();

    } finally {

      setUser(null);

      setIsAuthenticated(
        false
      );

      localStorage.removeItem(
        "currentOrganizationId"
      );
    }
  };


  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    user,

    loading,

    isAuthenticated,

    register,

    login,

    logout,

    setUser,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};