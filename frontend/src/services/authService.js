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
    try {
      const response = await api.get("/auth/me");
      return mapUser(response.data.user);
    } catch (error) {
      return null;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user } = response.data;

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
      const { user } = response.data;

      return mapUser(user);
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      throw new Error(message);
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      const response = await api.post("/auth/google", { idToken });
      return mapUser(response.data.user);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Google sign-in failed. Please try again.";
      throw new Error(message);
    }
  },

  loginWithGithub: async (idToken) => {
    try {
      const response = await api.post("/auth/github", { idToken });

      return mapUser(response.data.user);

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "GitHub sign-in failed. Please try again.";

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
      // The backend clears the HttpOnly authentication cookies.
    }
  },
};

export default authService;
