import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "delivery" | "payment" | "system" | "rating";
  read: boolean;
  createdAt: string;
  deliveryId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  permissionGranted: boolean;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  requestPermission: () => Promise<void>;
}

const loadStored = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem("haulr_notifications");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (notifications: AppNotification[]) => {
  localStorage.setItem("haulr_notifications", JSON.stringify(notifications));
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: loadStored(),
  permissionGranted: typeof Notification !== "undefined" && Notification.permission === "granted",

  addNotification: (n) => {
    const notification: AppNotification = {
      ...n,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [notification, ...get().notifications].slice(0, 50);
    persist(updated);
    set({ notifications: updated });

    if (get().permissionGranted && typeof Notification !== "undefined") {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/manifest-icon-192.png",
          tag: notification.deliveryId,
        });
      } catch {
        // Browser may block even with permission in some contexts
      }
    }
  },

  markRead: (id) => {
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persist(updated);
    set({ notifications: updated });
  },

  markAllRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    persist(updated);
    set({ notifications: updated });
  },

  clearAll: () => {
    localStorage.removeItem("haulr_notifications");
    set({ notifications: [] });
  },

  requestPermission: async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    set({ permissionGranted: result === "granted" });
  },
}));
