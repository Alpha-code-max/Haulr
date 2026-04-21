import { create } from "zustand";
import api from "../services/api";

export interface Rating {
  _id: string;
  deliveryId: string;
  fromUserId: string;
  toUserId: string;
  score: number;
  review?: string;
  createdAt: string;
}

interface RatingState {
  ratings: Record<string, Rating>;
  isLoading: boolean;
  submitRating: (deliveryId: string, toUserId: string, score: number, review?: string) => Promise<void>;
  fetchRating: (deliveryId: string) => Promise<void>;
}

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: {},
  isLoading: false,

  submitRating: async (deliveryId, toUserId, score, review) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/ratings", { deliveryId, toUserId, score, review });
      set({ ratings: { ...get().ratings, [deliveryId]: data } });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to submit rating");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRating: async (deliveryId) => {
    try {
      const { data } = await api.get(`/ratings/delivery/${deliveryId}`);
      if (data) set({ ratings: { ...get().ratings, [deliveryId]: data } });
    } catch {
      // rating may not exist yet
    }
  },
}));
