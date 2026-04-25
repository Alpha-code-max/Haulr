import React, { useState, useRef, useEffect } from "react";
import {
  FiShield, FiAlertCircle, FiRotateCw, FiClock,
  FiUser, FiPhone, FiCopy, FiCheck, FiKey,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      timerRef.current = setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const deliveriesWithOTP = deliveries.filter((d) => d.otp);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center">
              <FiKey className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100">
                Security Verification Code
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Share this OTP with the recipient for delivery confirmation
              </p>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="mx-6 mt-5 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-2xl text-sm flex-shrink-0">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {deliveriesWithOTP.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiShield className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No active OTPs at the moment</p>
            </div>
          ) : (
            deliveriesWithOTP.map((delivery) => {
              const expired = isOTPExpired(delivery.otpExpiresAt);
              const hauler = typeof delivery.haulerId === "object" ? delivery.haulerId as any : null;

              return (
                <div
                  key={delivery._id}
                  className={`rounded-2xl border overflow-hidden ${
                    expired
                      ? "border-red-200 dark:border-red-800/50"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <StatusBadge status={delivery.status} />
                    <span className="font-mono text-[10px] text-slate-400">#{delivery._id.slice(-8)}</span>
                  </div>

                  {/* OTP display */}
                  <div className="p-5">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${
                      expired ? "text-red-500" : "text-amber-600"
                    }`}>
                      {expired ? "Expired OTP" : "Active OTP"}
                    </p>

                    <div className={`relative flex items-center justify-center gap-4 py-6 px-4 rounded-2xl ${
                      expired
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "bg-slate-50 dark:bg-slate-800"
                    }`}>
                      {expired && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-red-500 text-[10px] font-bold">
                          <FiAlertCircle className="w-3 h-3" /> EXPIRED
                        </div>
                      )}

                      <p className={`text-5xl font-mono font-black tracking-[0.25em] ${
                        expired ? "text-red-300 dark:text-red-700" : "text-slate-900 dark:text-slate-100"
                      }`}>
                        {delivery.otp}
                      </p>

                      {!expired && (
                        <button
                          onClick={() => handleCopy(delivery._id, delivery.otp!)}
                          title="Copy code"
                          className={`p-2.5 rounded-xl transition-all ${
                            copiedId === delivery._id
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600"
                              : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                        >
                          {copiedId === delivery._id ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3">
                      {expired
                        ? "This code has expired — regenerate a new one below."
                        : "Share this with the customer at the delivery point."}
                    </p>

                    {/* Hauler info */}
                    {hauler && ["picked_up", "in_transit"].includes(delivery.status) && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hauler</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{hauler.name}</p>
                          </div>
                        </div>
                        {hauler.phone && (
                          <a
                            href={`tel:${hauler.phone}`}
                            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            <FiPhone className="w-3 h-3" />
                            {hauler.phone}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Resend button */}
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        onClick={() => onResendOTP(delivery._id)}
                        disabled={resendingId === delivery._id}
                        variant={expired ? "destructive" : "outline"}
                        className="rounded-xl flex items-center gap-2 h-10 text-sm"
                      >
                        <FiRotateCw
                          className={`w-4 h-4 ${resendingId === delivery._id ? "animate-spin" : ""}`}
                        />
                        {expired ? "Regenerate OTP" : "Refresh Code"}
                      </Button>

                      {delivery.otpExpiresAt && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {expired ? "Expired" : "Expires"}: {new Date(delivery.otpExpiresAt).toLocaleTimeString()}
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
