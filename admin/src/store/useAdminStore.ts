import { create } from "zustand";
import api from "../services/api";

interface AdminStats {
  users: number;
  deliveries: number;
  activeDeliveries: number;
  totalBalance: number;
  totalEscrow: number;
}

interface ActivityFeed {
  recentUsers: any[];
  recentDeliveries: any[];
}

interface AdminState {
  stats: AdminStats | null;
  activities: ActivityFeed | null;
  users: any[];
  deliveries: any[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  fetchAllDeliveries: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  activities: null,
  users: [],
  deliveries: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/admin/stats");
      set({ stats: data.stats, activities: data.activities });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch admin stats" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/admin/users");
      set({ users: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllDeliveries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/admin/deliveries");
      set({ deliveries: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch deliveries" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
