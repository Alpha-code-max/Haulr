import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiPaperclip,
  FiAlertCircle,
  FiCheckCircle,
  FiSlash,
  FiImage,
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
      setOtpError(
        error.response?.data?.message || error?.message || "Verification failed"
      );
    }
  };

  const attemptsRemaining = 5 - (delivery?.otpAttempts || 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-10 z-[70] max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div
            className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              delivery?.isLocked
                ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {delivery?.isLocked ? (
              <FiSlash className="w-10 h-10" />
            ) : (
              <FiCheckCircle className="w-10 h-10" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold">Secure Verification</DialogTitle>
          <p className="text-slate-500 mt-2">Required: PoD Photo & Customer OTP</p>
          {deliveryId && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Attempts Remaining:
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  attemptsRemaining <= 1
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {attemptsRemaining} of 5
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {delivery?.isLocked ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-sm leading-relaxed">
              <FiAlertCircle className="shrink-0 mt-0.5" size={18} />
              <p>
                <strong>Security Lockout:</strong> Too many failed OTP attempts.
                Ask the vendor to regenerate a new security code for you.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: PoD Photo */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Step 1: Proof of Delivery
                </label>
                <div
                  className={`relative h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    podImageUrl
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400"
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
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                      <FiCheck className="text-emerald-500 mb-1" size={24} />
                      <p className="text-xs font-bold text-emerald-700">
                        {podImageUrl.split("/").pop()}
                      </p>
                      <p className="text-[9px] text-emerald-600 opacity-60">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FiPaperclip size={24} className="mb-1" />
                      <p className="text-xs font-bold">Attach Delivery Photo</p>
                      <p className="text-[9px] uppercase tracking-tighter opacity-50">
                        Required for escrow release
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Image Cross-check */}
              {delivery?.referenceImage && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Visual Cross-check: Reference Photo
                  </label>
                  <div className="relative h-40 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={delivery.referenceImage}
                      alt="Reference Product"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                      <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <FiImage size={10} /> FROM VENDOR
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: OTP Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Step 2: Customer 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value.replace(/\D/g, ""));
                    setOtpError("");
                  }}
                  className="block w-full text-center text-5xl font-mono tracking-[0.2em] bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 h-20 outline-none transition-all"
                  placeholder="000000"
                />
              </div>

              {otpError && (
                <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95">
                  <FiAlertCircle size={14} />
                  {otpError}
                </div>
              )}

              <Button
                onClick={handleConfirm}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                disabled={isLoading || otpValue.length !== 6 || !podImageUrl}
              >
                {isLoading ? "Authenticating..." : "Finalize Shipment"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerOTPModal;
