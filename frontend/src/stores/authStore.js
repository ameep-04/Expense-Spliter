import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
      });
      const { token, user } = response.data;
      set({ token, user, isLoading: false });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      set({ token, user, isLoading: false });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
