import React from "react";
import { FiMapPin, FiArrowRight, FiPackage, FiMessageCircle, FiSlash } from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import type { DeliveryItem } from "../../store/useDeliveryStore";

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
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <FiMapPin className="text-blue-600 shrink-0" />
              <div className="w-0.5 h-full bg-slate-100 my-1" />
              <FiArrowRight className="text-emerald-500 shrink-0" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{delivery.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-1">Payout Balance</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300 font-mono">
                ₦{(delivery.deliveryFee || 0).toLocaleString()}
              </p>
            </div>
            <FiPackage size={32} className="text-blue-100" />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {delivery.status === "pending" ? (
            <Button
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => {
                onAccept(delivery._id);
                onClose();
              }}
            >
              Accept This Job
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl flex gap-2 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  onChat(delivery._id);
                  onClose();
                }}
              >
                <FiMessageCircle /> Chat
              </Button>

              {delivery.status === "accepted" && (
                <Button
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl flex gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
                  onClick={async () => {
                    if (confirm("Withdraw from this assignment? The job returns to the marketplace.")) {
                      await withdrawAcceptance(delivery._id);
                      onClose();
                    }
                  }}
                >
                  <FiSlash /> Cancel Assignment
                </Button>
              )}

              {delivery.status === "paid" && (
                <Button
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={async () => {
                    await markPickedUp(delivery._id);
                    fetchMyDeliveries();
                    onClose();
                  }}
                >
                  Pick Up Package
                </Button>
              )}

              {delivery.status === "picked_up" && (
                <Button
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={async () => {
                    await markInTransit(delivery._id);
                    fetchMyDeliveries();
                    onClose();
                  }}
                >
                  Start Transit
                </Button>
              )}

              {delivery.status === "in_transit" && (
                <Button
                  className={`flex-1 h-12 rounded-xl font-bold text-white transition-all ${
                    delivery.isLocked
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-100"
                  }`}
                  onClick={() => {
                    if (!delivery.isLocked) {
                      onVerifyOTP(delivery._id);
                      onClose();
                    }
                  }}
                  disabled={delivery.isLocked}
                >
                  {delivery.isLocked ? "Secure Locked" : "Verify OTP"}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerDeliveryInfoModal;
