import { create } from "zustand";
import api from "../services/api";

interface WalletData {
  _id: string;
  userId: string;
  balance: number;
}

interface TransactionItem {
  _id: string;
  type: "deposit" | "escrow" | "release" | "withdraw";
  amount: number;
  balanceAfter: number;
  deliveryId?: string;
  status: "pending" | "cleared";
  clearedAt?: string;
  createdAt: string;
}

interface PaystackInitData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface WalletState {
  wallet: WalletData | null;
  transactions: TransactionItem[];
  isLoading: boolean;
  error: string | null;

  fetchWallet: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  initializePayment: (amount: number) => Promise<PaystackInitData>;
  verifyPayment: (reference: string) => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/wallet");
      set({ wallet: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch wallet" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      const { data } = await api.get("/wallet/transactions");
      set({ transactions: data });
    } catch (err: any) {
      console.error("Failed to fetch transactions", err);
    }
  },

  initializePayment: async (amount: number) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/wallet/fund/initialize", { amount });
      return data as PaystackInitData;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to initialize payment";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyPayment: async (reference: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.get(`/wallet/fund/verify?reference=${reference}`);
      await get().fetchWallet();
      await get().fetchTransactions();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Payment verification failed" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fallback direct deposit (for testing without Paystack keys)
  deposit: async (amount: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/wallet/transaction", { type: "deposit", amount, balanceAfter: 0 });
      await get().fetchWallet();
      await get().fetchTransactions();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Deposit failed" });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
