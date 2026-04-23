import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTheme } from "../../../context/ThemeContext";
import { useWalletStore } from "../../../store/useWalletStore";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import {
  FiLogOut, FiTruck, FiUser, FiDollarSign, FiHelpCircle,
  FiSun, FiMoon, FiMenu, FiX, FiActivity, FiShoppingBag,
  FiShield, FiPackage, FiClock, FiTrendingUp, FiChevronDown,
  FiSettings,
} from "react-icons/fi";
import HelpModal from "../../Help/HelpModal";
import NotificationCenter from "../../Notifications/NotificationCenter";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface NavLink {
  label: string;
  to: string;
  icon: React.ElementType;
  exact?: boolean;
}

const roleNavLinks: Record<string, NavLink[]> = {
  vendor: [
    { label: "Deliveries",  to: "/vendor",         icon: FiPackage,   exact: true },
    { label: "Wallet",      to: "/vendor/wallet",  icon: FiDollarSign },
  ],
  hauler: [
    { label: "Terminal",    to: "/hauler",         icon: FiTruck,     exact: true },
  ],
  customer: [
    { label: "Shipments",   to: "/customer",       icon: FiActivity,  exact: true },
  ],
  admin: [
    { label: "Admin Panel", to: "/admin",          icon: FiShield,    exact: true },
  ],
  super_admin: [
    { label: "Admin Panel", to: "/admin",          icon: FiShield,    exact: true },
  ],
};

const roleColors: Record<string, string> = {
  vendor:      "text-blue-600 dark:text-blue-400",
  hauler:      "text-emerald-600 dark:text-emerald-400",
  customer:    "text-violet-600 dark:text-violet-400",
  admin:       "text-red-600 dark:text-red-400",
  super_admin: "text-red-600 dark:text-red-400",
};

const roleLabels: Record<string, string> = {
  vendor: "Vendor", hauler: "Hauler", customer: "Customer",
  admin: "Admin", super_admin: "Super Admin",
};

/* ─── Helpers ────────────────────────────────────────────────────────── */

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

const getGradient = (name: string) => gradients[name.charCodeAt(0) % gradients.length];

const iconBtn =
  "flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all";

/* ─── Avatar Dropdown ────────────────────────────────────────────────── */

interface AvatarDropdownProps {
  onHelp: () => void;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ onHelp }) => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) return null;

  const role = user.role;
  const color = roleColors[role] || "text-slate-500";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 hover:opacity-90 transition-opacity group"
      >
        <div className={`w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-gradient-to-br ${getGradient(user.name)} shadow-sm group-hover:scale-105 transition-transform`}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs font-black">{getInitials(user.name)}</span>
          )}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">
            {user.name.split(" ")[0]}
          </p>
          <p className={`text-[10px] font-bold mt-0.5 ${color}`}>{roleLabels[role] || role}</p>
        </div>
        <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User identity */}
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-gradient-to-br ${getGradient(user.name)}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-black">{getInitials(user.name)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <p className={`text-xs font-bold ${color}`}>{roleLabels[role] || role}</p>
                {user.email && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FiUser className="w-4 h-4 text-slate-400" />
              My Profile
            </Link>
            <button
              onClick={() => { setOpen(false); onHelp(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FiHelpCircle className="w-4 h-4 text-slate-400" />
              Help & Guide
            </button>
          </div>

          <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { logout(); navigate("/login"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Context Pill ───────────────────────────────────────────────────── */

const ContextPill: React.FC = () => {
  const { user } = useAuthStore();
  const { wallet } = useWalletStore();
  const { deliveries, availableDeliveries } = useDeliveryStore();

  const role = user?.role;

  const content = useMemo(() => {
    if (role === "vendor" && wallet) {
      return {
        label: "Wallet",
        value: `₦${wallet.balance.toLocaleString()}`,
        color: "text-emerald-700 dark:text-emerald-300",
        bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40",
        to: "/vendor/wallet",
      };
    }
    if (role === "hauler") {
      const active = deliveries.filter((d) =>
        ["paid", "picked_up", "in_transit"].includes(d.status)
      ).length;
      const available = availableDeliveries.length;
      if (active > 0) {
        return {
          label: `${active} active`,
          value: active === 1 ? "job" : "jobs",
          color: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40",
          to: "/hauler",
        };
      }
      if (available > 0) {
        return {
          label: `${available}`,
          value: "available",
          color: "text-amber-700 dark:text-amber-300",
          bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-800/40",
          to: "/hauler",
        };
      }
      return null;
    }
    return null;
  }, [role, wallet, deliveries, availableDeliveries]);

  if (!content) return null;

  return (
    <Link
      to={content.to}
      className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${content.bg} ${content.color} hover:opacity-80 transition-opacity`}
    >
      <span>{content.label}</span>
      <span className="opacity-70">{content.value}</span>
    </Link>
  );
};

/* ─── Main Navbar ────────────────────────────────────────────────────── */

const Navbar: React.FC = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const role = user?.role || "";
  const navLinks = roleNavLinks[role] || [];
  const color = roleColors[role] || "";

  const isActive = (link: NavLink) =>
    link.exact
      ? location.pathname === link.to
      : location.pathname.startsWith(link.to);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">

          {/* ── Logo ── */}
          <Link to={navLinks[0]?.to || "/"} className="flex items-center gap-2.5 shrink-0 group mr-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Haulr
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          {user && navLinks.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? `bg-slate-100 dark:bg-slate-800 ${color}`
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Desktop right ── */}
          <div className="hidden sm:flex items-center gap-1.5">
            {user && <ContextPill />}

            {/* Theme toggle */}
            <button onClick={toggleTheme} className={iconBtn} title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {user && (
              <>
                <NotificationCenter />

                {/* Separator */}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

                {/* Avatar dropdown */}
                <AvatarDropdown onHelp={() => setIsHelpOpen(true)} />
              </>
            )}
          </div>

          {/* ── Mobile right ── */}
          <div className="flex sm:hidden items-center gap-1">
            <button onClick={toggleTheme} className={iconBtn}>
              {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            {user && <NotificationCenter />}
            {user && (
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={`${iconBtn} ${mobileOpen ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : ""}`}
              >
                {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && user && (
          <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2 duration-200">
            {/* User identity */}
            <div className="px-4 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 bg-gradient-to-br ${getGradient(user.name)}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-black">{getInitials(user.name)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <p className={`text-xs font-bold ${color}`}>{roleLabels[role] || role}</p>
                {user.email && (
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                )}
              </div>
            </div>

            {/* Nav links */}
            {navLinks.length > 0 && (
              <div className="px-3 py-3 space-y-1 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Navigation</p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        active
                          ? `bg-slate-100 dark:bg-slate-800 ${color}`
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Secondary actions */}
            <div className="px-3 py-3 space-y-1 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Account</p>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <FiUser className="w-4 h-4 text-slate-400" />
                My Profile
              </Link>
              <button
                onClick={() => { setMobileOpen(false); setIsHelpOpen(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <FiHelpCircle className="w-4 h-4 text-slate-400" />
                Help & Guide
              </button>
            </div>

            {/* Logout */}
            <div className="px-3 py-3">
              <button
                onClick={() => { useAuthStore.getState().logout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-14" />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        defaultTab={user?.role === "vendor" ? "vendor" : "hauler"}
      />
    </>
  );
};

export default Navbar;
