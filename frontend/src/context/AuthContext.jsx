import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    login: async (...args) => setUser(await authService.login(...args)),
    register: async (data) => setUser(await authService.register(data)),
    logout: () => {
      authService.logout();
      setUser(null);
    },
    updateUser: (nextUser) => {
      localStorage.setItem("devsync_mock_user", JSON.stringify(nextUser));
      setUser(nextUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
