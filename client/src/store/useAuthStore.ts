import { create } from "zustand";
import api from "../services/api";

type Role = "customer" | "vendor" | "hauler" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  kycStatus?: "unverified" | "pending" | "verified" | "rejected";
  nin?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  vehicleImages?: string[];
  avatar?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  loginAction: (credentials: any) => Promise<User>;
  register: (payload: any) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; otp?: string }>;
  resetPassword: (data: any) => Promise<{ message: string }>;
  updateProfile: (data: any) => Promise<User>;
  updateBankDetails: (data: any) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("haulr_token"),
  isAuthenticated: !!localStorage.getItem("haulr_token"),
  isLoading: false,

  login: (token, user) => {
    localStorage.setItem("haulr_token", token);
    set({ user, token, isAuthenticated: true });
  },

  loginAction: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/users/login", credentials);
      const token = data.token || data.accessToken;
      
      localStorage.setItem("haulr_token", token);
      
      const { data: userProfile } = await api.get("/users/me");
      set({ user: userProfile, token, isAuthenticated: true });
      return userProfile;
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/users/register", payload);
      const token = data.token || data.accessToken;
      
      localStorage.setItem("haulr_token", token);
      
      const { data: userProfile } = await api.get("/users/me");
      set({ user: userProfile, token, isAuthenticated: true });
      return userProfile;
    } catch (err: any) {
      // Extract specific validation errors if they exist
      if (err.response?.data?.errors) {
        const specificErrors = err.response.data.errors.map((e: any) => e.message).join(", ");
        throw new Error(`${err.response.data.message}: ${specificErrors}`);
      }
      const message = err.response?.data?.message || "Registration failed";
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("haulr_token");
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/";
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/users/me");
      set({ user: data, isAuthenticated: true });
    } catch (_) {
      set({ user: null, isAuthenticated: false, token: null });
      localStorage.removeItem("haulr_token");
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (data) => {
    set({ isLoading: true });
    try {
      const { data: responseData } = await api.post("/users/reset-password", data);
      return responseData;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (payload: any) => {
    set({ isLoading: true });
    try {
      const { data } = await api.patch("/users/profile", payload);
      set({ user: data.user });
      return data.user;
    } catch (err: any) {
      const message = err.response?.data?.message || "Profile update failed";
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateBankDetails: async (payload: any) => {
    set({ isLoading: true });
    try {
      const { data } = await api.patch("/users/bank-details", payload);
      set({ user: data.user });
      return data.user;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update bank details";
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
