import React from "react";
import { FiTruck, FiArrowRight, FiEye } from "react-icons/fi";
import { Button } from "../ui/button";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  deliveries: DeliveryItem[];
  onViewInfo: (id: string) => void;
  onBrowseMarket: () => void;
}

const ActiveDeliveriesSection: React.FC<Props> = ({ deliveries, onViewInfo, onBrowseMarket }) => {
  const getCustomerInfo = (delivery: DeliveryItem) =>
    typeof delivery.customerId === "object" ? delivery.customerId : null;

  if (deliveries.length === 0) {
    return (
      <div className="py-24 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center">
        <FiTruck className="w-16 h-16 text-slate-200 mb-6" />
        <h3 className="text-xl font-bold text-slate-400">You have no active shipments</h3>
        <Button variant="link" onClick={onBrowseMarket} className="mt-2 text-blue-600 font-bold">
          Browse the Marketplace <FiArrowRight className="ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Route Info</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Payout</th>
            <th className="px-8 py-5 text-right font-bold text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deliveries.map((delivery) => {
            const customer = getCustomerInfo(delivery);
            return (
              <tr key={delivery._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 font-mono text-sm text-slate-400">#{delivery._id.slice(-6)}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold max-w-[160px] truncate">{delivery.pickupAddress}</span>
                    <FiArrowRight className="text-slate-300 shrink-0" />
                    <span className="text-sm font-semibold max-w-[160px] truncate">{delivery.deliveryAddress}</span>
                  </div>
                  {customer && (
                    <p className="text-xs text-blue-600 font-medium mt-1">Customer: {(customer as any).name}</p>
                  )}
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={delivery.status} />
                </td>
                <td className="px-8 py-6 font-mono font-bold text-emerald-600">
                  ₦{delivery.deliveryFee?.toLocaleString() || "—"}
                </td>
                <td className="px-8 py-6 text-right">
                  <Button
                    onClick={() => onViewInfo(delivery._id)}
                    variant="ghost"
                    className="rounded-xl hover:bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-none"
                  >
                    <FiEye size={18} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveDeliveriesSection;
