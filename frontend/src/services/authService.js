import api from "./api";

// Helper: Map backend user format to frontend format
const mapUser = (backendUser) => ({
  id: backendUser._id || backendUser.id,
  name: backendUser.fullname || backendUser.name,
  email: backendUser.email,
  role: backendUser.role || "DEVELOPER",
  color: backendUser.color || "#6d5dfc",
  subscription: backendUser.subscription,
});

export const authService = {
  getCurrentUser: async () => {
    const token = localStorage.getItem("devsync_token");
    if (!token) return null;

    try {
      const response = await api.get("/auth/me");
      return mapUser(response.data.user);
    } catch (error) {
      // Token is invalid/expired, clear it
      localStorage.removeItem("devsync_token");
      return null;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;

      // Store token for future requests
      localStorage.setItem("devsync_token", accessToken);

      return mapUser(user);
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const response = await api.post("/auth/register", {
        fullname: name,
        email,
        password,
      });
      const { user, accessToken } = response.data;

      // Store token for future requests
      localStorage.setItem("devsync_token", accessToken);

      return mapUser(user);
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      // Try to notify backend of logout
      await api.post("/auth/logout");
    } catch (error) {
      // Continue even if logout endpoint fails
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear token from frontend
      localStorage.removeItem("devsync_token");
    }
  },
};

export default authService;
