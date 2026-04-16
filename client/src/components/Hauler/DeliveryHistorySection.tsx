import React from "react";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  deliveries: DeliveryItem[];
}

const DeliveryHistorySection: React.FC<Props> = ({ deliveries }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
          <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Completed Route</th>
          <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
          <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Earned</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {deliveries.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-20 text-center text-slate-400 dark:text-slate-500">
              Your completed jobs will appear here
            </td>
          </tr>
        ) : (
          deliveries.map((delivery) => (
            <tr key={delivery._id} className="opacity-70 hover:opacity-100 transition-opacity">
              <td className="px-8 py-6 font-mono text-sm text-slate-400">#{delivery._id.slice(-6)}</td>
              <td className="px-8 py-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                {delivery.pickupAddress}{" "}
                <span className="mx-2 text-slate-300 dark:text-slate-600">→</span>
                {delivery.deliveryAddress}
              </td>
              <td className="px-8 py-6">
                <StatusBadge status={delivery.status} />
              </td>
              <td className="px-8 py-6 font-mono font-bold text-slate-600 dark:text-slate-300">
                ₦{(delivery.deliveryFee || 0).toLocaleString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DeliveryHistorySection;
