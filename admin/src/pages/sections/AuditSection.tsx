import React, { useEffect, useMemo } from "react";
import { FiRefreshCw, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiDollarSign, FiPackage } from "react-icons/fi";
import { useAdminStore } from "../../store/useAdminStore";
import type { AdminDelivery } from "../../store/useAdminStore";
import StatusBadge from "../../components/Delivery/StatusBadge";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:    <FiClock size={14} className="text-amber-400" />,
  accepted:   <FiTruck size={14} className="text-blue-400" />,
  priced:     <FiDollarSign size={14} className="text-orange-400" />,
  paid:       <FiDollarSign size={14} className="text-emerald-400" />,
  picked_up:  <FiPackage size={14} className="text-violet-400" />,
  in_transit: <FiTruck size={14} className="text-cyan-400" />,
  delivered:  <FiCheckCircle size={14} className="text-green-400" />,
  cancelled:  <FiXCircle size={14} className="text-rose-400" />,
};

const STATUS_LINE: Record<string, string> = {
  pending:    "border-amber-500/40",
  accepted:   "border-blue-500/40",
  priced:     "border-orange-500/40",
  paid:       "border-emerald-500/40",
  picked_up:  "border-violet-500/40",
  in_transit: "border-cyan-500/40",
  delivered:  "border-green-500/40",
  cancelled:  "border-rose-500/40",
};

function groupByDate(deliveries: AdminDelivery[]): Record<string, AdminDelivery[]> {
  return deliveries.reduce((acc, d) => {
    const dateKey = d.updatedAt
      ? new Date(d.updatedAt).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "Unknown Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(d);
    return acc;
  }, {} as Record<string, AdminDelivery[]>);
}

const AuditSection: React.FC = () => {
  const { deliveries, deliveriesLoading, fetchAllDeliveries } = useAdminStore();

  useEffect(() => {
    if (deliveries.length === 0) fetchAllDeliveries();
  }, []);

  const sorted = useMemo(
    () => [...deliveries].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()),
    [deliveries]
  );

  const grouped = useMemo(() => groupByDate(sorted), [sorted]);
  const dateKeys = Object.keys(grouped);

  const completedCount = deliveries.filter((d) => d.status === "delivered").length;
  const cancelledCount = deliveries.filter((d) => d.status === "cancelled").length;
  const activeCount = deliveries.filter((d) => ["paid", "picked_up", "in_transit"].includes(d.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-slate-500 text-sm mt-0.5">Chronological delivery activity across the platform</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: activeCount, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
          { label: "Completed", value: completedCount, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
          { label: "Cancelled", value: cancelledCount, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`p-4 rounded-xl border ${bg}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {deliveriesLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <FiRefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            <p className="text-slate-500 text-sm">Loading activity log…</p>
          </div>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-16 text-slate-600">No activity recorded yet</div>
      ) : (
        <div className="space-y-8">
          {dateKeys.map((dateKey) => (
            <div key={dateKey}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{dateKey}</p>
                <div className="flex-1 h-px bg-[#21262d]" />
                <span className="text-[10px] text-slate-600 font-semibold">{grouped[dateKey].length} events</span>
              </div>

              {/* Events */}
              <div className="space-y-2 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#21262d]" />
                {grouped[dateKey].map((d) => (
                  <div key={d._id} className={`relative flex items-start gap-4 pl-10`}>
                    {/* Dot */}
                    <div className={`absolute left-0 top-3 w-10 flex items-center justify-center`}>
                      <div className={`w-9 h-9 rounded-xl bg-[#161b22] border ${STATUS_LINE[d.status] || "border-[#21262d]"} flex items-center justify-center`}>
                        {STATUS_ICON[d.status] || <FiPackage size={14} className="text-slate-500" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 bg-[#161b22] border border-[#21262d] rounded-xl p-4 hover:border-[#30363d] transition-colors ml-0.5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-mono text-[10px] text-slate-500">#{d._id.slice(-8).toUpperCase()}</p>
                            <StatusBadge status={d.status} />
                          </div>
                          <p className="text-slate-300 text-sm font-medium truncate">{d.pickupAddress}</p>
                          <p className="text-slate-500 text-xs truncate">→ {d.deliveryAddress}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {d.deliveryFee != null && (
                            <p className="text-emerald-400 text-sm font-semibold">₦{d.deliveryFee.toLocaleString()}</p>
                          )}
                          <p className="text-slate-600 text-[11px]">
                            {d.updatedAt
                              ? new Date(d.updatedAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#21262d]">
                        <p className="text-[11px] text-slate-500">
                          <span className="text-slate-600">Vendor</span>{" "}
                          <span className="text-slate-400">{d.vendorId?.name ?? "—"}</span>
                        </p>
                        {d.haulerId && (
                          <p className="text-[11px] text-slate-500">
                            <span className="text-slate-600">Hauler</span>{" "}
                            <span className="text-slate-400">{d.haulerId.name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditSection;
