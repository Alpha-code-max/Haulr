import React, { useEffect, useState } from "react";
import { FiRefreshCw, FiArrowUpRight, FiImage } from "react-icons/fi";
import { useAdminStore } from "../../store/useAdminStore";
import type { AdminDelivery } from "../../store/useAdminStore";
import StatusBadge from "../../components/Delivery/StatusBadge";
import DeliveryInspectModal from "../../components/DeliveryInspectModal";

const STATUS_TABS = ["all", "pending", "accepted", "priced", "paid", "picked_up", "in_transit", "delivered", "cancelled"] as const;

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", accepted: "Accepted", priced: "Priced", paid: "Paid",
  picked_up: "Picked Up", in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled",
};

interface LogisticsSectionProps {
  searchQuery: string;
  inspectId?: string | null;
}

const LogisticsSection: React.FC<LogisticsSectionProps> = ({ searchQuery, inspectId }) => {
  const { deliveries, deliveriesLoading, fetchAllDeliveries } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_TABS[number]>("all");
  const [selected, setSelected] = useState<AdminDelivery | null>(null);

  useEffect(() => {
    if (deliveries.length === 0) fetchAllDeliveries();
  }, []);

  // Open delivery by ID if passed from overview Inspect button
  useEffect(() => {
    if (inspectId && deliveries.length > 0) {
      const found = deliveries.find((d) => d._id === inspectId);
      if (found) setSelected(found);
    }
  }, [inspectId, deliveries]);

  const filtered = deliveries.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const vendorName = d.vendorId?.name?.toLowerCase() || "";
      const pickup = d.pickupAddress.toLowerCase();
      const delivery = d.deliveryAddress.toLowerCase();
      const id = d._id.toLowerCase();
      if (!vendorName.includes(q) && !pickup.includes(q) && !delivery.includes(q) && !id.includes(q)) return false;
    }
    return true;
  });

  const statusCounts = STATUS_TABS.slice(1).reduce((acc, s) => {
    acc[s] = deliveries.filter((d) => d.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Logistics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track and inspect all platform deliveries</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
            statusFilter === "all"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#21262d]"
          }`}
        >
          All ({deliveries.length})
        </button>
        {STATUS_TABS.slice(1).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === tab
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#21262d]"
            }`}
          >
            {STATUS_LABEL[tab]} ({statusCounts[tab] ?? 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
        {deliveriesLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <FiRefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-slate-500 text-sm">Loading deliveries…</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipment</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Route</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Vendor</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Hauler</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Fee</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Images</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-600">
                      No deliveries match your filters
                    </td>
                  </tr>
                ) : filtered.map((d) => (
                  <tr key={d._id} className="hover:bg-[#1c2128] transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-mono text-[11px] text-slate-500">#{d._id.slice(-8).toUpperCase()}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <p className="text-slate-300 text-xs truncate">{d.pickupAddress}</p>
                      <p className="text-slate-500 text-xs truncate">→ {d.deliveryAddress}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-300 text-sm">{d.vendorId?.name ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className={`text-sm ${d.haulerId ? "text-slate-300" : "text-slate-600 italic"}`}>
                        {d.haulerId?.name ?? "Unassigned"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-emerald-400 text-sm font-semibold">
                        {d.deliveryFee != null ? `₦${d.deliveryFee.toLocaleString()}` : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex -space-x-1.5">
                        {d.referenceImage ? (
                          <img src={d.referenceImage} className="w-7 h-7 rounded-md border border-[#30363d] object-cover" title="Reference" />
                        ) : null}
                        {d.podImage ? (
                          <img src={d.podImage} className="w-7 h-7 rounded-md border border-[#30363d] object-cover" title="POD" />
                        ) : null}
                        {!d.referenceImage && !d.podImage && (
                          <div className="w-7 h-7 rounded-md border border-[#30363d] bg-slate-800 flex items-center justify-center">
                            <FiImage className="w-3 h-3 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(d)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors"
                      >
                        Inspect <FiArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <DeliveryInspectModal delivery={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default LogisticsSection;
