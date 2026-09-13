import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token and load their data from backend
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("devsync_token");
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid token
        localStorage.removeItem("devsync_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    loading,
    login: async (...args) => setUser(await authService.login(...args)),
    register: async (data) => setUser(await authService.register(data)),
    logout: async () => {
      await authService.logout();
      setUser(null);
    },
    updateUser: (nextUser) => {
      setUser(nextUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
