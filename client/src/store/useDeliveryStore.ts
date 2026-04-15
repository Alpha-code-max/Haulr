import { create } from "zustand";
import api from "../services/api";

export interface DeliveryItem {
  _id: string;
  vendorId: { _id: string; name: string; phone: string } | string;
  customerId: { _id: string; name: string; phone: string } | string;
  haulerId?: { _id: string; name: string; phone: string } | string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "pending" | "accepted" | "priced" | "paid" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  deliveryFee?: number;
  otp?: string;
  otpExpiresAt?: string;
  otpAttempts?: number;
  isLocked?: boolean;
  podImage?: string;
  referenceImage?: string;
  itemDescription?: string;
  itemWeight?: number;
  currentLocation?: { lat: number; lng: number; updatedAt?: string };
  createdAt: string;
  updatedAt: string;
}

interface DeliveryState {
  deliveries: DeliveryItem[];
  availableDeliveries: DeliveryItem[];
  isLoading: boolean;
  error: string | null;

  fetchMyDeliveries: () => Promise<void>;
  fetchAvailable: () => Promise<void>;
  createDelivery: (data: {
    customerId: string;
    pickupAddress: string;
    deliveryAddress: string;
    itemDescription?: string;
    itemWeight?: number;
    referenceImage?: string;
  }) => Promise<void>;
  acceptDelivery: (deliveryId: string, deliveryFee: number) => Promise<void>;
  payForDelivery: (deliveryId: string) => Promise<void>;
  cancelAcceptance: (deliveryId: string) => Promise<void>;
  markPickedUp: (deliveryId: string) => Promise<void>;
  markInTransit: (deliveryId: string) => Promise<void>;
  confirmDelivery: (deliveryId: string, otp: string, podImage: string) => Promise<void>;
  withdrawAcceptance: (deliveryId: string) => Promise<void>;
  updateLocation: (deliveryId: string, lat: number, lng: number) => Promise<void>;
  deleteDelivery: (deliveryId: string) => Promise<void>;
  resendOTP: (deliveryId: string) => Promise<void>;
  clearError: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  deliveries: [],
  availableDeliveries: [],
  isLoading: false,
  error: null,

  fetchMyDeliveries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/deliveries/me");
      set({ deliveries: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch deliveries" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAvailable: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/deliveries/available");
      set({ availableDeliveries: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch available deliveries" });
    } finally {
      set({ isLoading: false });
    }
  },

  createDelivery: async (deliveryData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries", deliveryData);
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create delivery" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  acceptDelivery: async (deliveryId, deliveryFee) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/accept", { deliveryId, deliveryFee });
      await get().fetchMyDeliveries();
      await get().fetchAvailable();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to accept delivery" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  payForDelivery: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/pay", { deliveryId });
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to pay for delivery" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelAcceptance: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/cancel-acceptance", { deliveryId });
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to cancel acceptance" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  markPickedUp: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/pickup", { deliveryId });
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to mark pickup" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  markInTransit: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/in-transit", { deliveryId });
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to mark in transit" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  confirmDelivery: async (deliveryId, otp, podImage) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/deliver", { deliveryId, otp, podImage });
      await get().fetchMyDeliveries();
    } catch (err: any) {
      await get().fetchMyDeliveries(); // Refresh to get updated otpAttempts
      set({ error: err.response?.data?.message || "Failed to confirm delivery" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  withdrawAcceptance: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/deliveries/withdraw-acceptance", { deliveryId });
      await get().fetchMyDeliveries();
      await get().fetchAvailable();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to withdraw acceptance" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateLocation: async (deliveryId, lat, lng) => {
    try {
      await api.post("/deliveries/update-location", { deliveryId, lat, lng });
    } catch (err: any) {
      console.error("Location update failed:", err);
    }
  },

  deleteDelivery: async (deliveryId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/deliveries/${deliveryId}`);
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete delivery" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  resendOTP: async (deliveryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/deliveries/${deliveryId}/resend-otp`);
      
      // Update the delivery in state directly with the full returned object
      const currentDeliveries = get().deliveries;
      const updatedDeliveries = currentDeliveries.map(d => 
        d._id === deliveryId ? response.data : d
      );
      
      set({ deliveries: updatedDeliveries });
      
      // Still fetch to be sure we have everything in sync (especially populated fields)
      await get().fetchMyDeliveries();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to resend OTP" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
