import React, { useState, useEffect } from "react";
import {
  FiCheck, FiPaperclip, FiAlertCircle, FiImage, FiLock, FiShield,
} from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useDeliveryStore } from "../../store/useDeliveryStore";
import { useWalletStore } from "../../store/useWalletStore";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  deliveryId: string | null;
  delivery: DeliveryItem | undefined;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const HaulerOTPModal: React.FC<Props> = ({
  deliveryId,
  delivery,
  open,
  onClose,
  onSuccess,
}) => {
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [podImageUrl, setPodImageUrl] = useState("");

  const { confirmDelivery, fetchMyDeliveries, isLoading } = useDeliveryStore();
  const { fetchWallet, fetchTransactions } = useWalletStore();

  useEffect(() => {
    if (open) {
      setOtpValue("");
      setOtpError("");
      setPodImageUrl("");
    }
  }, [open, deliveryId]);

  const handleConfirm = async () => {
    if (!deliveryId) return;
    if (!podImageUrl) {
      setOtpError("Proof of Delivery photo is required.");
      return;
    }
    if (otpValue.length !== 6) return;

    try {
      await confirmDelivery(deliveryId, otpValue, podImageUrl);
      fetchMyDeliveries();
      fetchWallet();
      fetchTransactions();
      onSuccess();
      onClose();
    } catch (error: any) {
      setOtpError(error.response?.data?.message || error?.message || "Verification failed");
    }
  };

  const attemptsRemaining = 5 - (delivery?.otpAttempts || 0);
  const isLocked = delivery?.isLocked;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-0 z-[70] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isLocked
                ? "bg-red-100 dark:bg-red-950/40 text-red-600"
                : "bg-amber-100 dark:bg-amber-950/40 text-amber-600"
            }`}>
              {isLocked ? <FiLock className="w-6 h-6" /> : <FiShield className="w-6 h-6" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100">
                Secure Verification
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isLocked ? "Delivery locked — contact vendor" : "PoD photo + customer OTP required"}
              </p>
            </div>
          </div>

          {deliveryId && !isLocked && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attempts remaining:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  attemptsRemaining <= 1
                    ? "bg-red-100 dark:bg-red-950/40 text-red-600 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {attemptsRemaining} / 5
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLocked ? (
            <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl">
              <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">Security Lockout</p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1 leading-relaxed">
                  Too many failed OTP attempts. Ask the vendor to regenerate a new security code for you.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: PoD Photo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">1</span>
                    Proof of Delivery
                  </label>
                  {podImageUrl && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Attached
                    </span>
                  )}
                </div>
                <div
                  className={`relative h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    podImageUrl
                      ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                  }`}
                  onClick={() => document.getElementById("pod-upload")?.click()}
                >
                  <input
                    id="pod-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPodImageUrl(`https://haulr.sh/pod/${file.name}`);
                        setOtpError("");
                      }
                    }}
                  />
                  {podImageUrl ? (
                    <div className="flex flex-col items-center">
                      <FiCheck className="w-6 h-6 text-emerald-500 mb-1" />
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {podImageUrl.split("/").pop()}
                      </p>
                      <p className="text-[10px] text-emerald-500 mt-0.5">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FiPaperclip className="w-6 h-6 mb-1" />
                      <p className="text-xs font-bold">Attach Delivery Photo</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Required for escrow release</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference image */}
              {delivery?.referenceImage && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Vendor Reference Photo
                  </label>
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={delivery.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <p className="text-[10px] font-bold text-white flex items-center gap-1">
                        <FiImage className="w-3 h-3" /> FROM VENDOR
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: OTP Input */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">2</span>
                  Customer 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                  className="block w-full text-center text-5xl font-mono tracking-[0.25em] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 h-20 outline-none transition-all"
                  placeholder="000000"
                />
                <p className="text-xs text-slate-400 text-center">
                  Ask the customer for their delivery code
                </p>
              </div>

              {otpError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  {otpError}
                </div>
              )}

              <Button
                onClick={handleConfirm}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:shadow-none"
                disabled={isLoading || otpValue.length !== 6 || !podImageUrl}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : "Finalize Shipment"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerOTPModal;
