import React, { useState } from "react";
import { FiInbox, FiPaperclip, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import type { DeliveryItem } from "../../../store/useDeliveryStore";
import StatusBadge from "../StatusBadge/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader } from "../../ui/card";

interface OTPInboxProps {
  deliveries: DeliveryItem[];
  onClose: () => void;
  onDeliveryUpdate: () => void;
}

const OTPInbox: React.FC<OTPInboxProps> = ({
  deliveries,
  onClose,
  onDeliveryUpdate,
}) => {
  const { confirmDelivery, isLoading, error } = useDeliveryStore();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [podInputs, setPodInputs] = useState<Record<string, string>>({});

  const handleOtpChange = (deliveryId: string, otp: string) => {
    setOtpInputs(prev => ({ ...prev, [deliveryId]: otp }));
  };

  const handlePodChange = (deliveryId: string, url: string) => {
    setPodInputs(prev => ({ ...prev, [deliveryId]: url }));
  };

  const handleConfirmDelivery = async (deliveryId: string) => {
    const otp = otpInputs[deliveryId];
    const pod = podInputs[deliveryId];
    
    if (!pod) {
      alert("Proof of Delivery photo is required.");
      return;
    }
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await confirmDelivery(deliveryId, otp, pod);
      setOtpInputs(prev => ({ ...prev, [deliveryId]: "" }));
      setPodInputs(prev => ({ ...prev, [deliveryId]: "" }));
      onDeliveryUpdate();
    } catch (error) {
      // Error is handled in store
    }
  };

  // Filter deliveries that can receive OTP (picked_up or in_transit status)
  const otpEligibleDeliveries = deliveries.filter(delivery => 
    ['picked_up', 'in_transit'].includes(delivery.status)
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FiInbox size={24} />
            </div>
            Secure OTP Delivery Inbox
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-1 pr-2">
          {otpEligibleDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiInbox className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium mb-2 text-slate-900">No deliveries ready for verification</p>
              <p className="text-sm text-slate-500">Pick up packages and move them to transit to begin verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otpEligibleDeliveries.map((delivery) => (
                <Card key={delivery._id} className="border-slate-200">
                  <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={delivery.status} />
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase tracking-tighter text-slate-500">
                        Attempts: {(delivery.otpAttempts || 0)}/5
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-600 ">
                      ₦{(delivery.deliveryFee || 0).toLocaleString()}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="space-y-1">
                        <p className="flex items-start gap-2 leading-relaxed">
                          <span className="font-bold uppercase tracking-tighter opacity-70">Pickup:</span> 
                          <span>{delivery.pickupAddress}</span>
                        </p>
                        <p className="flex items-start gap-2 leading-relaxed">
                          <span className="font-bold uppercase tracking-tighter opacity-70">Delivery:</span> 
                          <span>{delivery.deliveryAddress}</span>
                        </p>
                      </div>
                      {delivery.itemDescription && (
                        <div className="space-y-1">
                          <p className="flex items-start gap-2">
                            <span className="font-bold uppercase tracking-tighter opacity-70">Item:</span> 
                            <span>{delivery.itemDescription}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Step 1: Proof of Delivery (File upload)</Label>
                        <div 
                          className={`relative h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                            podInputs[delivery._id] 
                              ? "border-emerald-200 bg-emerald-50/50" 
                              : "border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400"
                          }`}
                          onClick={() => document.getElementById(`pod-upload-${delivery._id}`)?.click()}
                        >
                          <input 
                            id={`pod-upload-${delivery._id}`}
                            type="file" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 handlePodChange(delivery._id, `https://haulr.sh/pod/${file.name}`);
                              }
                            }}
                          />
                          {podInputs[delivery._id] ? (
                            <div className="flex items-center gap-2 animate-in zoom-in-95">
                              <FiCheck className="text-emerald-500" size={18} />
                              <p className="text-[11px] font-bold text-emerald-700 truncate max-w-[150px]">
                                {podInputs[delivery._id].split('/').pop()}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-slate-400">
                              <FiPaperclip size={18} className="mb-1" />
                              <p className="text-[10px] font-bold">Attach Proof of Delivery</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Step 2: Customer 6-Digit OTP</Label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            className="font-mono text-center tracking-widest bg-slate-50 border-slate-200 h-11"
                            placeholder="000000"
                            value={otpInputs[delivery._id] || ""}
                            onChange={(e) => handleOtpChange(delivery._id, e.target.value.replace(/\D/g, "").slice(0, 6))}
                            maxLength={6}
                            disabled={isLoading}
                          />
                          <Button
                            onClick={() => handleConfirmDelivery(delivery._id)}
                            disabled={isLoading || !otpInputs[delivery._id] || otpInputs[delivery._id].length !== 6 || !podInputs[delivery._id]}
                            className="h-11 bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoading ? "Verifying..." : "Complete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <FiInbox size={14} className="shrink-0" />
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPInbox;