import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
  getMe,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Check the current authentication status of the user.
   */
  const checkAuth = async () => {
    try {
      const response = await getMe();

      if (response?.success && response?.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log in an existing user with credentials.
   */
  const login = async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    if (response?.success && response?.user) {
      setUser(response.user);
    }

    return response;
  };

  /**
   * Register a new user account.
   */
  const register = async (userData) => {
    const response = await registerUser(userData);

    if (response?.success && response?.user) {
      setUser(response.user);
    }

    return response;
  };

  /**
   * Log out the currently authenticated user.
   */
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  // Run initial authentication check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;