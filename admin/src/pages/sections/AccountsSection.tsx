import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiShield, FiUser, FiTruck, FiPackage, FiAward } from "react-icons/fi";
import { useAdminStore } from "../../store/useAdminStore";
import type { AdminUser } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";

const ROLE_TABS = ["all", "vendor", "hauler", "customer", "admin", "super_admin"] as const;
const KYC_TABS = ["all", "verified", "pending", "unverified"] as const;

const ROLE_BADGE: Record<string, string> = {
  vendor:      "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  hauler:      "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  customer:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  admin:       "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  super_admin: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
};

const KYC_BADGE: Record<string, string> = {
  verified:   "bg-emerald-500/15 text-emerald-400",
  pending:    "bg-amber-500/15 text-amber-400 animate-pulse",
  unverified: "bg-slate-500/15 text-slate-500",
  rejected:   "bg-rose-500/15 text-rose-400",
};

const ROLE_ICON: Record<string, React.ReactNode> = {
  vendor:      <FiPackage size={13} />,
  hauler:      <FiTruck size={13} />,
  customer:    <FiUser size={13} />,
  admin:       <FiShield size={13} />,
  super_admin: <FiAward size={13} />,
};

interface PromoteModalProps {
  user: AdminUser;
  onConfirm: (role: "admin" | "super_admin") => void;
  onClose: () => void;
  loading: boolean;
}

const PromoteModal: React.FC<PromoteModalProps> = ({ user, onConfirm, onClose, loading }) => {
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-bold text-base mb-1">Promote User</h3>
        <p className="text-slate-400 text-sm mb-5">
          Grant admin privileges to <span className="text-white font-semibold">{user.name}</span>
        </p>
        <div className="flex gap-3 mb-6">
          {(["admin", "super_admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                role === r
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                  : "bg-[#0d1117] border-[#21262d] text-slate-500 hover:text-slate-300"
              }`}
            >
              {r === "admin" ? "Admin" : "Super Admin"}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mb-5">
          {role === "super_admin"
            ? "Super admins can promote other users and have full platform access."
            : "Admins can view users, deliveries, and platform stats."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-[#0d1117] border border-[#21262d] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(role)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Promoting…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AccountsSectionProps {
  searchQuery: string;
}

const AccountsSection: React.FC<AccountsSectionProps> = ({ searchQuery }) => {
  const { users, usersLoading, fetchAllUsers, promoteUser } = useAdminStore();
  const { user: adminUser } = useAuthStore();
  const isSuperAdmin = adminUser?.role === "super_admin";

  const [roleFilter, setRoleFilter] = useState<typeof ROLE_TABS[number]>("all");
  const [kycFilter, setKycFilter] = useState<typeof KYC_TABS[number]>("all");
  const [promoteTarget, setPromoteTarget] = useState<AdminUser | null>(null);
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  useEffect(() => {
    if (users.length === 0) fetchAllUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    const kyc = u.kycStatus || "unverified";
    if (kycFilter !== "all" && kyc !== kycFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handlePromote = async (role: "admin" | "super_admin") => {
    if (!promoteTarget) return;
    setPromoteLoading(true);
    setPromoteError(null);
    try {
      await promoteUser(promoteTarget.email, role);
      setPromoteTarget(null);
    } catch (err: any) {
      setPromoteError(err.response?.data?.message || "Promotion failed");
    } finally {
      setPromoteLoading(false);
    }
  };

  const roleCounts = ROLE_TABS.slice(1).reduce((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounts</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage all platform users</p>
      </div>

      {/* Role filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              roleFilter === tab
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#21262d]"
            }`}
          >
            {tab === "all" ? `All (${users.length})` : `${tab.replace("_", " ")} (${roleCounts[tab] ?? 0})`}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {KYC_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setKycFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                kycFilter === tab
                  ? "bg-[#21262d] text-slate-200"
                  : "text-slate-600 hover:text-slate-400"
              }`}
            >
              {tab === "all" ? "KYC: All" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
        {usersLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <FiRefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-slate-500 text-sm">Loading accounts…</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">User</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">KYC</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</th>
                  {isSuperAdmin && (
                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="px-5 py-10 text-center text-slate-600">
                      No accounts match your filters
                    </td>
                  </tr>
                ) : filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-[#1c2128] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${ROLE_BADGE[u.role] ?? "bg-slate-700 text-slate-400"}`}>
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{u.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{u._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-300 text-sm">{u.email}</p>
                      {u.phone && <p className="text-slate-500 text-xs">{u.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${ROLE_BADGE[u.role] ?? "bg-slate-700 text-slate-400"}`}>
                        {ROLE_ICON[u.role]}
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${KYC_BADGE[u.kycStatus || "unverified"]}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {u.kycStatus || "unverified"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-5 py-4 text-right">
                        {u.role !== "super_admin" && (
                          <button
                            onClick={() => setPromoteTarget(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors border border-transparent hover:border-blue-500/20"
                          >
                            <FiShield size={11} /> Promote
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {promoteError && (
        <p className="text-rose-400 text-sm">{promoteError}</p>
      )}

      {promoteTarget && (
        <PromoteModal
          user={promoteTarget}
          onConfirm={handlePromote}
          onClose={() => setPromoteTarget(null)}
          loading={promoteLoading}
        />
      )}
    </div>
  );
};

export default AccountsSection;
