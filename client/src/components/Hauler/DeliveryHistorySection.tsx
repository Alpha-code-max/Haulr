import React, { useState } from "react";
import { FiEye, FiStar } from "react-icons/fi";
import { Button } from "../ui/button";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";
import RatingModal from "../Rating/RatingModal";
import { useRatingStore } from "../../store/useRatingStore";

interface Props {
  deliveries: DeliveryItem[];
  onViewInfo: (id: string) => void;
  onViewFullDetails: (id: string) => void;
}

const DeliveryHistorySection: React.FC<Props> = ({ deliveries, onViewInfo, onViewFullDetails }) => {
  const [ratingTarget, setRatingTarget] = useState<{ deliveryId: string; toUserId: string; toUserName: string } | null>(null);
  const { ratings } = useRatingStore();

  const getVendorId = (d: DeliveryItem) =>
    typeof d.vendorId === "object" ? (d.vendorId as any)._id : d.vendorId;
  const getVendorName = (d: DeliveryItem) =>
    typeof d.vendorId === "object" ? (d.vendorId as any).name : "Vendor";

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
              <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Completed Route</th>
              <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Earned</th>
              <th className="px-8 py-5 text-right font-bold text-slate-400 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 dark:text-slate-500">
                  Your completed jobs will appear here
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => {
                const alreadyRated = !!ratings[delivery._id];
                const vendorId = getVendorId(delivery);
                const vendorName = getVendorName(delivery);
                return (
                  <tr
                    key={delivery._id}
                    onClick={() => onViewFullDetails(delivery._id)}
                    className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity group"
                  >
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
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {delivery.status === "delivered" && !alreadyRated && vendorId && (
                          <Button
                            onClick={() =>
                              setRatingTarget({ deliveryId: delivery._id, toUserId: vendorId, toUserName: vendorName })
                            }
                            variant="ghost"
                            className="rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 dark:text-amber-400 transition-all p-2"
                            title="Rate this delivery"
                          >
                            <FiStar size={17} />
                          </Button>
                        )}
                        {alreadyRated && (
                          <FiStar size={15} className="text-amber-400 fill-amber-400 mr-1" title="Rated" />
                        )}
                        <Button
                          onClick={() => onViewInfo(delivery._id)}
                          variant="ghost"
                          className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all p-2"
                          title="Quick Overview"
                        >
                          <FiEye size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {ratingTarget && (
        <RatingModal
          open={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          deliveryId={ratingTarget.deliveryId}
          toUserId={ratingTarget.toUserId}
          toUserName={ratingTarget.toUserName}
          role="vendor"
        />
      )}
    </>
  );
};

export default DeliveryHistorySection;
