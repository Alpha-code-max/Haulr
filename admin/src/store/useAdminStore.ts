import { create } from "zustand";
import api from "../services/api";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  kycStatus?: string;
  createdAt?: string;
  avatar?: string;
  nin?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
}

export interface AdminDelivery {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  deliveryFee?: number;
  platformFee?: number;
  itemDescription?: string;
  itemWeight?: string;
  referenceImage?: string;
  podImage?: string;
  createdAt?: string;
  updatedAt?: string;
  vendorId?: { _id: string; name: string; phone?: string };
  customerId?: { _id: string; name: string; phone?: string };
  haulerId?: { _id: string; name: string; phone?: string };
}

interface AdminStats {
  users: number;
  deliveries: number;
  activeDeliveries: number;
  totalBalance: number;
  totalEscrow: number;
}

interface ActivityFeed {
  recentUsers: AdminUser[];
  recentDeliveries: AdminDelivery[];
}

interface AdminState {
  stats: AdminStats | null;
  activities: ActivityFeed | null;
  users: AdminUser[];
  deliveries: AdminDelivery[];
  isLoading: boolean;
  usersLoading: boolean;
  deliveriesLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  fetchAllDeliveries: () => Promise<void>;
  promoteUser: (email: string, role: "admin" | "super_admin") => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  activities: null,
  users: [],
  deliveries: [],
  isLoading: false,
  usersLoading: false,
  deliveriesLoading: false,
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
    set({ usersLoading: true, error: null });
    try {
      const { data } = await api.get("/admin/users");
      set({ users: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ usersLoading: false });
    }
  },

  fetchAllDeliveries: async () => {
    set({ deliveriesLoading: true, error: null });
    try {
      const { data } = await api.get("/admin/deliveries");
      set({ deliveries: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch deliveries" });
    } finally {
      set({ deliveriesLoading: false });
    }
  },

  promoteUser: async (email, role) => {
    const { data } = await api.patch("/admin/promote", { email, role });
    set((state) => ({
      users: state.users.map((u) =>
        u.email === email ? { ...u, role: data.role } : u
      ),
    }));
  },
}));
