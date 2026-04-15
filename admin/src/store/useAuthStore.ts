import { create } from "zustand";
import api from "../services/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("haulr_admin_token"),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await api.post("/users/login", { email, password });
    if (data.user?.role !== "admin") {
      throw new Error("Access denied: admin only");
    }
    localStorage.setItem("haulr_admin_token", data.token);
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("haulr_admin_token");
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  checkAuth: async () => {
    const token = localStorage.getItem("haulr_admin_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { data } = await api.get("/users/me");
      if (data.role !== "admin") throw new Error("Not admin");
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("haulr_admin_token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
