import React from "react";
import type { AdminUser } from "../store/useAdminStore";

interface NewRegistrationsFeedProps {
  users: AdminUser[];
  onViewAll?: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  hauler:      "bg-amber-500/20 text-amber-400",
  vendor:      "bg-blue-500/20 text-blue-400",
  customer:    "bg-emerald-500/20 text-emerald-400",
  admin:       "bg-violet-500/20 text-violet-400",
  super_admin: "bg-rose-500/20 text-rose-400",
};

const NewRegistrationsFeed: React.FC<NewRegistrationsFeedProps> = ({ users, onViewAll }) => (
  <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 space-y-1">
    {users.length === 0 ? (
      <p className="text-slate-600 text-sm text-center py-6">No recent registrations</p>
    ) : users.map((u) => (
      <div
        key={u._id}
        className="flex items-center justify-between p-3 hover:bg-[#1c2128] rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${ROLE_COLORS[u.role] ?? "bg-slate-700 text-slate-400"}`}>
            {u.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">{u.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{u.role.replace("_", " ")}</p>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${u.kycStatus === "verified" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
          title={u.kycStatus || "unverified"}
        />
      </div>
    ))}
    <div className="pt-2">
      <button
        onClick={onViewAll}
        className="w-full h-9 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-[#1c2128]"
      >
        View all accounts →
      </button>
    </div>
  </div>
);

export default NewRegistrationsFeed;
