import React from "react";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Button } from "../ui/button";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  deliveries: DeliveryItem[];
  onSelectDelivery: (id: string) => void;
}

const AvailableDeliveriesMarket: React.FC<Props> = ({ deliveries, onSelectDelivery }) => {
  if (deliveries.length === 0) {
    return (
      <div className="py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
        <FiShoppingBag className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg">No available deliveries in your area</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Route</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Est. Payout</th>
            <th className="px-8 py-5 text-right font-bold text-slate-400">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {deliveries.map((d) => (
            <tr key={d._id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
              <td className="px-8 py-6 font-mono text-sm text-slate-400">#{d._id.slice(-6)}</td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{d.pickupAddress}</span>
                  <FiArrowRight className="text-slate-300 dark:text-slate-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{d.deliveryAddress}</span>
                </div>
              </td>
              <td className="px-8 py-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ₦{d.deliveryFee?.toLocaleString() || "—"}
              </td>
              <td className="px-8 py-6 text-right">
                <Button
                  onClick={() => onSelectDelivery(d._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 px-6 shadow-md shadow-emerald-200"
                >
                  Accept Job
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableDeliveriesMarket;
