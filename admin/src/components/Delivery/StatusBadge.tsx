import React from "react";

interface StatusBadgeProps {
  status: string;
}

const LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  priced: "Priced",
  paid: "Paid",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getStatusClasses = (status: string): string => {
  const base = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap";
  switch (status) {
    case 'pending':     return `${base} bg-amber-500/10 text-amber-400 border border-amber-500/20`;
    case 'accepted':    return `${base} bg-blue-500/10 text-blue-400 border border-blue-500/20`;
    case 'priced':      return `${base} bg-orange-500/10 text-orange-400 border border-orange-500/20`;
    case 'paid':        return `${base} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`;
    case 'picked_up':   return `${base} bg-violet-500/10 text-violet-400 border border-violet-500/20`;
    case 'in_transit':  return `${base} bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse`;
    case 'delivered':   return `${base} bg-green-500/10 text-green-400 border border-green-500/20`;
    case 'cancelled':   return `${base} bg-rose-500/10 text-rose-400 border border-rose-500/20`;
    default:            return `${base} bg-slate-500/10 text-slate-400 border border-slate-500/20`;
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={getStatusClasses(status)}>
    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
