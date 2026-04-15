import React from "react";
import {
  FiMessageSquare,
  FiAlertCircle,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  open: boolean;
  onClose: () => void;
  deliveries: DeliveryItem[];
  onResendOTP: (id: string) => void;
  resendingId: string | null;
  error: string | null;
}

const isOTPExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
};

const VendorOTPModal: React.FC<Props> = ({
  open,
  onClose,
  deliveries,
  onResendOTP,
  resendingId,
  error,
}) => {
  const deliveriesWithOTP = deliveries.filter((d) => d.otp);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 rounded-3xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-8 pb-6 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <FiMessageSquare className="text-blue-600" />
            Customer Verification Codes
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-3 flex-shrink-0">
            <FiAlertCircle className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {deliveriesWithOTP.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No active OTPs at the moment.
            </div>
          ) : (
            deliveriesWithOTP.map((delivery) => {
              const expired = isOTPExpired(delivery.otpExpiresAt);
              return (
                <div
                  key={delivery._id}
                  className="border-b border-slate-100 pb-10 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-6">
                    <StatusBadge status={delivery.status} />
                    <span className="font-mono text-xs text-slate-500">
                      ID: {delivery._id.slice(-8)}
                    </span>
                  </div>

                  <div
                    className={`relative rounded-2xl p-8 text-center border transition-all ${
                      expired
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {expired && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider">
                        <FiAlertCircle size={12} /> Expired
                      </div>
                    )}

                    <p
                      className={`text-xs uppercase tracking-widest mb-2 ${
                        expired ? "text-red-500" : "text-amber-600"
                      }`}
                    >
                      Secure OTP
                    </p>
                    <p
                      className={`text-5xl font-mono font-bold tracking-widest ${
                        expired ? "text-red-300" : "text-slate-900"
                      }`}
                    >
                      {delivery.otp}
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                      {expired
                        ? "This code has expired. Regenerate a new one for the hauler."
                        : "Share this code with the customer for delivery verification."}
                    </p>

                    <div className="mt-8">
                      <Button
                        onClick={() => onResendOTP(delivery._id)}
                        disabled={resendingId === delivery._id}
                        variant={expired ? "destructive" : "outline"}
                        className="rounded-xl flex items-center gap-2 mx-auto"
                      >
                        <FiRefreshCw
                          className={
                            resendingId === delivery._id ? "animate-spin" : ""
                          }
                        />
                        {expired ? "Regenerate OTP" : "Refresh Code"}
                      </Button>

                      {delivery.otpExpiresAt && (
                        <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1">
                          <FiClock size={11} />
                          Expires: {new Date(delivery.otpExpiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorOTPModal;
