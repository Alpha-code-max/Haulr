import React from "react";
import { FiGrid, FiUsers, FiTruck, FiDollarSign, FiAward, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
      active
        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
        : "text-slate-500 hover:bg-[#21262d] hover:text-slate-300"
    }`}
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 bg-[#0d1117] border-r border-[#21262d] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#21262d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiAward className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Haulr<span className="text-blue-400">HQ</span></h2>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 py-2">Navigation</p>
        <NavItem icon={<FiGrid />} label="Overview" active={activeSection === "overview"} onClick={() => onSectionChange("overview")} />
        <NavItem icon={<FiUsers />} label="Accounts" active={activeSection === "accounts"} onClick={() => onSectionChange("accounts")} />
        <NavItem icon={<FiTruck />} label="Logistics" active={activeSection === "logistics"} onClick={() => onSectionChange("logistics")} />
        <NavItem icon={<FiDollarSign />} label="Audit Log" active={activeSection === "audit"} onClick={() => onSectionChange("audit")} />
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-[#21262d]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">{user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-slate-600 truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-medium"
        >
          <FiLogOut className="text-base" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
