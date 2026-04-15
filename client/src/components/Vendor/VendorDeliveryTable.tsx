import React from "react";
import {
  FiMapPin,
  FiArrowRight,
  FiLock,
  FiAlertCircle,
  FiClock,
  FiEye,
  FiPackage,
} from "react-icons/fi";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  deliveries: DeliveryItem[];
  onViewInfo: (id: string) => void;
  onViewOTP: () => void;
  isOTPExpired: (expiresAt?: string) => boolean;
}

const getHaulerName = (hauler: any): string => {
  if (!hauler) return "Unassigned";
  return typeof hauler === "object" ? hauler.name : "Assigned Hauler";
};

const getHaulerPhone = (hauler: any): string | null => {
  if (!hauler) return null;
  return typeof hauler === "object" ? hauler.phone : null;
};

const VendorDeliveryTable: React.FC<Props> = ({
  deliveries,
  onViewInfo,
  onViewOTP,
  isOTPExpired,
}) => {
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPackage className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No deliveries yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Create your first delivery to start shipping with escrow protection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hauler</th>
            <th className="px-6 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Escrow</th>
            <th className="px-6 py-5 text-right w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {deliveries.map((delivery) => {
            const haulerName = getHaulerName(delivery.haulerId);
            const haulerPhone = getHaulerPhone(delivery.haulerId);
            const hasOTP = !!delivery.otp;
            const otpExpired = isOTPExpired(delivery.otpExpiresAt);

            return (
              <tr key={delivery._id} className="h-16 hover:bg-slate-50/60 transition-colors">
                <td className="px-6 font-mono text-sm text-slate-500">
                  #{delivery._id.slice(-6)}
                </td>
                <td className="px-6">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiMapPin className="text-blue-600 flex-shrink-0" size={13} />
                      <span className="truncate max-w-[150px]">{delivery.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 pl-5">
                      <FiArrowRight className="flex-shrink-0" size={13} />
                      <span className="truncate max-w-[150px]">{delivery.deliveryAddress}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6">
                  <StatusBadge status={delivery.status} />
                </td>
                <td className="px-6">
                  {haulerName !== "Unassigned" ? (
                    <div>
                      <p className="font-medium text-sm text-slate-800">{haulerName}</p>
                      {haulerPhone && (
                        <p className="text-xs text-blue-600">{haulerPhone}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Unassigned</span>
                  )}
                </td>
                <td className="px-6 font-semibold text-blue-600 text-sm">
                  {delivery.deliveryFee ? `₦${delivery.deliveryFee.toLocaleString()}` : "—"}
                </td>
                <td className="px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-slate-400">
                    {hasOTP && (
                      <button
                        onClick={onViewOTP}
                        className={`p-2 rounded-xl transition-colors ${
                          delivery.isLocked
                            ? "bg-red-600 text-white animate-pulse"
                            : otpExpired
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "hover:bg-amber-50 text-amber-600"
                        }`}
                        title={
                          delivery.isLocked
                            ? "Security Lockout!"
                            : otpExpired
                            ? "OTP expired!"
                            : "View OTPs"
                        }
                      >
                        {delivery.isLocked ? (
                          <FiLock size={17} />
                        ) : otpExpired ? (
                          <FiAlertCircle size={17} />
                        ) : (
                          <FiClock size={17} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => onViewInfo(delivery._id)}
                      className="p-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View Logistics Overview"
                    >
                      <FiEye size={19} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VendorDeliveryTable;
