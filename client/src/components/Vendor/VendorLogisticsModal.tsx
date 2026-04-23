import React from "react";
import {
  FiMapPin, FiTruck, FiCheckCircle, FiShield,
  FiMessageSquare, FiAlertCircle,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
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
  const totalAmount = (delivery.deliveryFee || 0) + (delivery.platformFee || 0);
  const insufficientFunds = delivery.status === "accepted" && walletBalance < totalAmount;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-0 border border-slate-200 dark:border-slate-700 z-[60] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100">
                Logistics Overview
              </DialogTitle>
              <StatusBadge status={delivery.status} />
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
              #{delivery._id.slice(-8)}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Security lockout */}
          {delivery.isLocked && (
            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl">
              <FiShield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-red-700 dark:text-red-400">Security Lockout Active</p>
                <p className="text-xs text-red-600 dark:text-red-500 leading-relaxed">
                  The hauler exceeded OTP attempt limit. Shipment is locked for protection.
                </p>
                <button
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline mt-1"
                  onClick={() => { onShowOTP(delivery._id); onClose(); }}
                >
                  Regenerate OTP to Unlock →
                </button>
              </div>
            </div>
          )}

          {/* Route */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Route</p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40" />
                <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1.5" />
                <FiMapPin className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{delivery.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deliver To</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{delivery.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCheckCircle className="w-3 h-3 text-emerald-500" /> Escrow Protection
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Hauler Fee</span>
                <span className="font-mono font-semibold">₦{(delivery.deliveryFee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Platform Charge</span>
                <span className="font-mono font-semibold">₦{(delivery.platformFee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Escrow</span>
                <span className="text-xl font-black font-mono text-blue-600">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Wallet balance hint when insufficient */}
              {insufficientFunds && !error && (
                <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl mt-2">
                  <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Insufficient Funds</p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                      Balance ₦{walletBalance.toLocaleString()} · Need ₦{(totalAmount - walletBalance).toLocaleString()} more
                    </p>
                  </div>
                </div>
              )}

              {/* API Error */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl mt-2">
                  <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Payment failed</p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
                    <button onClick={clearError} className="text-[10px] font-bold text-red-700 dark:text-red-400 underline mt-1">
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hauler info */}
          {haulerName && (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
                  <FiTruck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Hauler</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{haulerName}</p>
                </div>
              </div>
              {haulerPhone && (
                <a
                  href={`tel:${haulerPhone}`}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {haulerPhone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          {delivery.status === "accepted" ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-xl text-red-500 border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold"
                onClick={async () => { await onDecline(delivery._id); onClose(); }}
                disabled={isLoading}
              >
                Decline
              </Button>
              <Button
                className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20"
                onClick={async () => {
                  try { await onPay(delivery._id); onClose(); } catch {}
                }}
                disabled={isLoading || insufficientFunds}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : "Pay Hauler"}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                onClick={() => { onChat(delivery._id); onClose(); }}
              >
                <FiMessageSquare className="w-4 h-4" /> Chat
              </Button>
              {delivery.status === "pending" && (
                <Button
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold"
                  onClick={() => { onDelete(delivery._id); onClose(); }}
                >
                  Delete Job
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorLogisticsModal;
