import React, { Suspense, lazy } from "react";
import {
  FiMapPin, FiPackage, FiMessageCircle, FiSlash,
  FiCheck, FiAlertTriangle,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import type { DeliveryItem } from "../../store/useDeliveryStore";

const DeliveryMap = lazy(() => import("../Map/DeliveryMap"));

interface Props {
  delivery: DeliveryItem | null;
  open: boolean;
  onClose: () => void;
  onChat: (id: string) => void;
  onVerifyOTP: (id: string) => void;
  onAccept: (id: string) => void;
}

const HaulerDeliveryInfoModal: React.FC<Props> = ({
  delivery,
  open,
  onClose,
  onChat,
  onVerifyOTP,
  onAccept,
}) => {
  const { withdrawAcceptance, markPickedUp, markInTransit, fetchMyDeliveries } = useDeliveryStore();

  if (!delivery) return null;

  const vendor = typeof delivery.vendorId === "object" ? delivery.vendorId as any : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-0 border border-slate-200 dark:border-slate-700 z-[60] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100">
                Delivery Info
              </DialogTitle>
              <StatusBadge status={delivery.status} />
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
              #{delivery._id.slice(-8)}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{delivery.pickupAddress}</p>
                  {vendor?.name && (
                    <p className="text-xs text-slate-400 mt-1">from {vendor.name}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{delivery.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live tracking map */}
          <Suspense fallback={<div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />}>
            <DeliveryMap
              currentLocation={delivery.currentLocation}
              pickupAddress={delivery.pickupAddress}
              deliveryAddress={delivery.deliveryAddress}
            />
          </Suspense>

          {/* Payout */}
          <div className="flex items-center justify-between p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Your Payout</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono">
                ₦{(delivery.deliveryFee || 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-500 mt-1">Released after OTP confirmation</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Lock warning */}
          {delivery.isLocked && (
            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl">
              <FiAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">Secure Locked</p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-0.5 leading-relaxed">
                  Too many failed OTP attempts. Ask the vendor to regenerate a new code.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          {delivery.status === "pending" ? (
            <Button
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20"
              onClick={() => { onAccept(delivery._id); onClose(); }}
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Accept This Job
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 border-slate-200 dark:border-slate-700 font-semibold"
                onClick={() => { onChat(delivery._id); onClose(); }}
              >
                <FiMessageCircle className="w-4 h-4" /> Chat
              </Button>

              {delivery.status === "accepted" && (
                <Button
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold"
                  onClick={async () => {
                    if (confirm("Withdraw from this assignment? The job returns to the marketplace.")) {
                      await withdrawAcceptance(delivery._id);
                      onClose();
                    }
                  }}
                >
                  <FiSlash className="w-4 h-4" /> Cancel
                </Button>
              )}

              {delivery.status === "paid" && (
                <Button
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={async () => { await markPickedUp(delivery._id); fetchMyDeliveries(); onClose(); }}
                >
                  Pick Up
                </Button>
              )}

              {delivery.status === "picked_up" && (
                <Button
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={async () => { await markInTransit(delivery._id); fetchMyDeliveries(); onClose(); }}
                >
                  Start Transit
                </Button>
              )}

              {delivery.status === "in_transit" && (
                <Button
                  className={`flex-1 h-12 rounded-xl font-bold text-white ${
                    delivery.isLocked
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                  onClick={() => {
                    if (!delivery.isLocked) { onVerifyOTP(delivery._id); onClose(); }
                  }}
                  disabled={delivery.isLocked}
                >
                  {delivery.isLocked ? "Locked" : "Verify OTP"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerDeliveryInfoModal;
