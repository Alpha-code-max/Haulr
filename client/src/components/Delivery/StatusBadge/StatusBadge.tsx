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
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap shadow-sm";
  
  switch (status) {
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'accepted':
      return `${baseClasses} bg-blue-100 text-blue-900`;
    case 'priced':
      return `${baseClasses} bg-amber-100 text-amber-900`;
    case 'paid':
      return `${baseClasses} bg-emerald-100 text-emerald-900`;
    case 'picked_up':
      return `${baseClasses} bg-violet-100 text-violet-900`;
    case 'in_transit':
      return `${baseClasses} bg-cyan-100 text-cyan-900 animate-pulse`;
    case 'delivered':
      return `${baseClasses} bg-emerald-200 text-emerald-900`;
    case 'cancelled':
      return `${baseClasses} bg-rose-100 text-rose-900`;
    default:
      return `${baseClasses} bg-slate-100 text-slate-800`;
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={getStatusClasses(status)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {LABELS[status] || status}
    </span>
  );
};

export default StatusBadge;