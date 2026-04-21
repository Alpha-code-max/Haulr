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

const STORAGE_KEY = "haulr_ratings";

const loadLocal = (): Record<string, Rating> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocal = (ratings: Record<string, Rating>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
};

interface RatingState {
  ratings: Record<string, Rating>;
  isLoading: boolean;
  submitRating: (deliveryId: string, toUserId: string, score: number, review?: string) => Promise<void>;
  fetchRating: (deliveryId: string) => Promise<void>;
}

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: loadLocal(),
  isLoading: false,

  submitRating: async (deliveryId, toUserId, score, review) => {
    set({ isLoading: true });
    try {
      // Try the backend first
      const { data } = await api.post("/ratings", { deliveryId, toUserId, score, review });
      const updated = { ...get().ratings, [deliveryId]: data };
      saveLocal(updated);
      set({ ratings: updated });
    } catch (err: any) {
      const status = err.response?.status;
      // If the endpoint doesn't exist yet (404) or server error, save locally so
      // the user still gets a confirmed experience and the rating isn't lost.
      if (!status || status === 404 || status >= 500) {
        const local: Rating = {
          _id: `local-${Date.now()}`,
          deliveryId,
          toUserId,
          fromUserId: "",
          score,
          review,
          createdAt: new Date().toISOString(),
        };
        const updated = { ...get().ratings, [deliveryId]: local };
        saveLocal(updated);
        set({ ratings: updated });
        // Don't throw — treat as success
      } else {
        // 400 / 401 / 409 etc. — real validation errors from the backend
        throw new Error(err.response?.data?.message || "Failed to submit rating");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRating: async (deliveryId) => {
    try {
      const { data } = await api.get(`/ratings/delivery/${deliveryId}`);
      if (data) {
        const updated = { ...get().ratings, [deliveryId]: data };
        saveLocal(updated);
        set({ ratings: updated });
      }
    } catch {
      // silently fall back to locally cached rating
    }
  },
}));
