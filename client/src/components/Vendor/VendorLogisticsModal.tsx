import React from "react";
import {
  FiMapPin,
  FiArrowRight,
  FiTruck,
  FiCheckCircle,
  FiShield,
  FiMessageSquare,
} from "react-icons/fi";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  delivery: DeliveryItem | null;
  open: boolean;
  onClose: () => void;
  onChat: (id: string) => void;
  onDelete: (id: string) => void;
  onShowOTP: (id: string) => void;
  onPay: (id: string) => Promise<void>;
  onDecline: (id: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  clearError: () => void;
  walletBalance: number;
}

const getHaulerName = (hauler: any): string | null => {
  if (!hauler) return null;
  return typeof hauler === "object" ? hauler.name : "Assigned Hauler";
};

const getHaulerPhone = (hauler: any): string | null => {
  if (!hauler) return null;
  return typeof hauler === "object" ? hauler.phone : null;
};

const VendorLogisticsModal: React.FC<Props> = ({
  delivery,
  open,
  onClose,
  onChat,
  onDelete,
  onShowOTP,
  onPay,
  onDecline,
  isLoading,
  error,
  clearError,
  walletBalance,
}) => {
  if (!delivery) return null;

  const haulerName = getHaulerName(delivery.haulerId);
  const haulerPhone = getHaulerPhone(delivery.haulerId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 z-[60] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl dark:text-slate-100">
            Logistics Overview
            <span className="font-mono text-sm text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-lg">
              #{delivery._id.slice(-8)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-8 space-y-8">
          {delivery.isLocked && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-sm leading-relaxed">
              <FiShield className="shrink-0 mt-0.5" size={18} />
              <div className="space-y-2">
                <p className="font-bold">Security Lockout Active</p>
                <p className="opacity-80">
                  The hauler exceeded OTP attempt limit. Shipment is locked for protection.
                </p>
                <p
                  className="font-bold underline cursor-pointer hover:text-red-900"
                  onClick={() => {
                    onShowOTP(delivery._id);
                    onClose();
                  }}
                >
                  Regenerate OTP to Unlock →
                </p>
              </div>
            </div>
          )}

          {/* Route */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <FiMapPin className="text-blue-600 shrink-0" />
              <div className="w-0.5 h-full bg-slate-100 my-1" />
              <FiArrowRight className="text-emerald-500 shrink-0" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Pickup From
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Deliver To
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{delivery.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Escrow Protection
                </p>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Hauler Fee</span>
                    <span>₦{(delivery.deliveryFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Platform Charge</span>
                    <span>₦{(delivery.platformFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <FiCheckCircle size={10} /> Total Secure Escrow
                    </p>
                    <p className="text-xl font-bold text-blue-600 font-mono">
                      ₦{((delivery.deliveryFee || 0) + (delivery.platformFee || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error & Warning Section */}
            {(error || (delivery.status === "accepted" && walletBalance < ((delivery.deliveryFee || 0) + (delivery.platformFee || 0)))) && (
               <div className="mt-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30">
                  <div className="flex gap-3">
                    <FiShield className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-800 dark:text-red-400">
                        {error ? "Payment failed" : "Insufficient Funds"}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-500 leading-relaxed font-medium">
                        {error ? error : `Your current balance (₦${walletBalance.toLocaleString()}) is not enough to fund this escrow. Please deposit more to your wallet.`}
                      </p>
                      {error && (
                        <button 
                          onClick={clearError}
                          className="text-[10px] font-bold uppercase tracking-wider text-red-800 dark:text-red-400 mt-2 hover:underline"
                        >
                          Dismiss error
                        </button>
                      )}
                    </div>
                  </div>
               </div>
            )}

            {haulerName && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <FiTruck size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Assigned Hauler
                    </p>
                    <p className="text-sm font-semibold dark:text-slate-200">{haulerName}</p>
                  </div>
                </div>
                {haulerPhone && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{haulerPhone}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {delivery.status === "accepted" ? (
            <>
              <Button
                variant="outline"
                className="h-12 rounded-xl text-red-500 border-red-100 hover:bg-red-50"
                onClick={async () => {
                  await onDecline(delivery._id);
                  onClose();
                }}
                disabled={isLoading}
              >
                Decline
              </Button>
              <Button
                className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={async () => {
                  try {
                    await onPay(delivery._id);
                    onClose();
                  } catch (err) {
                    // Error is caught by the store and displayed via the `error` prop
                    console.error("Payment failed from modal:", err);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Hauler"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-12 rounded-xl flex gap-2 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  onChat(delivery._id);
                  onClose();
                }}
              >
                <FiMessageSquare /> Chat
              </Button>
              {delivery.status === "pending" && (
                <Button
                  variant="ghost"
                  className="h-12 rounded-xl text-red-500 hover:bg-red-50"
                  onClick={() => {
                    onDelete(delivery._id);
                    onClose();
                  }}
                >
                  Delete Job
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorLogisticsModal;
