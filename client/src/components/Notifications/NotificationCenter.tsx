import React, { useState, useRef, useEffect } from "react";
import {
  FiBell, FiCheck, FiTrash2, FiX, FiTruck,
  FiDollarSign, FiStar, FiInfo, FiZap,
} from "react-icons/fi";
import { useNotificationStore, type AppNotification } from "../../store/useNotificationStore";

const typeConfig: Record<AppNotification["type"], { icon: React.ElementType; bg: string; icon_color: string; dot: string }> = {
  delivery: { icon: FiTruck,      bg: "bg-blue-100 dark:bg-blue-950/50",    icon_color: "text-blue-600 dark:text-blue-400",    dot: "bg-blue-500" },
  payment:  { icon: FiDollarSign, bg: "bg-emerald-100 dark:bg-emerald-950/50", icon_color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  rating:   { icon: FiStar,       bg: "bg-amber-100 dark:bg-amber-950/50",   icon_color: "text-amber-600 dark:text-amber-400",   dot: "bg-amber-500" },
  system:   { icon: FiInfo,       bg: "bg-slate-100 dark:bg-slate-800",      icon_color: "text-slate-600 dark:text-slate-400",   dot: "bg-slate-500" },
};

const getRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, markRead, markAllRead, clearAll, requestPermission, permissionGranted } =
    useNotificationStore();

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
          open
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-label="Notifications"
      >
        <FiBell size={17} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-slate-950/60 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
                <FiZap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">Notifications</h3>
                {unread > 0 ? (
                  <p className="text-[10px] text-blue-500 font-bold">{unread} unread</p>
                ) : (
                  <p className="text-[10px] text-slate-400">All caught up</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!permissionGranted && (
                <button
                  onClick={requestPermission}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                >
                  Enable Push
                </button>
              )}
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <FiCheck size={13} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <FiTrash2 size={13} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiX size={13} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiBell className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No notifications yet</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Delivery updates will appear here</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {notifications.map((n) => {
                  const cfg = typeConfig[n.type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left p-3 rounded-2xl flex gap-3 transition-colors ${
                        !n.read
                          ? "bg-blue-50/60 dark:bg-blue-950/15 hover:bg-blue-50 dark:hover:bg-blue-950/25"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Type icon */}
                      <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${cfg.icon_color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold leading-tight truncate ${
                            !n.read ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                          }`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5 font-medium">
                            {getRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div className={`w-2 h-2 ${cfg.dot} rounded-full shrink-0 mt-2`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
