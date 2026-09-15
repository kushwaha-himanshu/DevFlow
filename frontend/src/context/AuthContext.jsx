import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The browser automatically sends the HttpOnly authentication cookie.
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
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
    loginWithGoogle: async (idToken) =>
      setUser(await authService.loginWithGoogle(idToken)),

    loginWithGithub: async (idToken) =>
      setUser(await authService.loginWithGithub(idToken)),

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
