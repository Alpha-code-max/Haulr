import React, { useState, useEffect } from "react";
import { 
  FiTruck, 
  FiPackage, 
  FiMessageSquare, 
  FiPlus, 
  FiTrash2, 
  FiMapPin, 
  FiArrowRight, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiClock,
  FiEye,
  FiCheckCircle,
  FiShield,
  FiLock 
} from "react-icons/fi";

import CreateDeliveryForm from "../../../components/Delivery/CreateDeliveryForm/CreateDeliveryForm";
import StatusBadge from "../../../components/Delivery/StatusBadge/StatusBadge";
import ChatInterface from "../../../components/Chat/ChatInterface";

import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button } from "../../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader 
} from "../../../components/ui/dialog";

const VendorDashboard: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOTPDisplay, setShowOTPDisplay] = useState(false);
  const [chatDeliveryId, setChatDeliveryId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [infoModalDeliveryId, setInfoModalDeliveryId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { 
    deliveries, 
    fetchMyDeliveries, 
    deleteDelivery, 
    resendOTP, 
    payForDelivery,
    cancelAcceptance,
    isLoading,
    error,
    clearError 
  } = useDeliveryStore();

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  // Filter deliveries where current user is the vendor/creator
  const myDeliveries = deliveries.filter(delivery => {
    const vId = typeof delivery.vendorId === 'object' 
      ? delivery.vendorId._id.toString() 
      : delivery.vendorId.toString();
    
    return vId === user?._id.toString();
  });

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchMyDeliveries();
  };

  const handleResendOTP = async (deliveryId: string) => {
    clearError();
    setResendingId(deliveryId);
    try {
      await resendOTP(deliveryId);
    } catch (err) {
      console.error("Failed to resend OTP", err);
    } finally {
      setResendingId(null);
    }
  };

  const isOTPExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const deliveriesWithOTP = myDeliveries.filter(delivery => delivery.otp);

  const getHaulerName = (hauler: any) => {
    if (!hauler) return "Unassigned";
    return typeof hauler === 'object' ? hauler.name : 'Assigned Hauler';
  };

  const getHaulerPhone = (hauler: any) => {
    if (!hauler) return null;
    return typeof hauler === 'object' ? hauler.phone : null;
  };

  const currentInfoDelivery = infoModalDeliveryId 
    ? deliveries.find(d => d._id === infoModalDeliveryId) 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <FiTruck className="w-9 h-9 text-blue-600" />
              </div>
              Vendor Hub
            </h1>
            <p className="text-slate-600 mt-3 text-lg">
              Manage deliveries, assign haulers, and track escrow payments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-blue-500/20"
            >
              <FiPlus className="w-5 h-5 mr-2" /> New Delivery
            </Button>
          </div>
        </div>

        {/* Deliveries Table - Left unchanged */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <FiPackage className="text-slate-600" /> Your Deliveries
            </h2>
            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium">
              {myDeliveries.length} total
            </span>
          </div>

          {myDeliveries.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No deliveries yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Create your first delivery to start shipping with escrow protection.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-5 text-left text-xs font-medium text-slate-500">ID</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-slate-500">Route</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-slate-500">Status</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-slate-500">Hauler</th>
                    <th className="px-6 py-5 text-left text-xs font-medium text-slate-500">Escrow Value</th>
                    <th className="px-6 py-5 text-right w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myDeliveries.map((delivery) => {
                    const haulerName = getHaulerName(delivery.haulerId);
                    const haulerPhone = getHaulerPhone(delivery.haulerId);
                    const hasOTP = !!delivery.otp;
                    const otpExpired = isOTPExpired(delivery.otpExpiresAt);

                    return (
                      <tr key={delivery._id} className="h-16 hover:bg-slate-50 transition-colors">
                        <td className="px-6 font-mono text-slate-500">#{delivery._id.slice(-6)}</td>
                        <td className="px-6">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <FiMapPin className="text-blue-600 flex-shrink-0" />
                              {delivery.pickupAddress}
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 pl-6">
                              <FiArrowRight className="flex-shrink-0" />
                              {delivery.deliveryAddress}
                            </div>
                          </div>
                        </td>
                        <td className="px-6">
                          <StatusBadge status={delivery.status} />
                        </td>
                        <td className="px-6">
                          {haulerName !== "Unassigned" ? (
                            <div>
                              <p className="font-medium">{haulerName}</p>
                              {haulerPhone && <p className="text-xs text-blue-600">{haulerPhone}</p>}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 font-semibold text-blue-600">
                          {delivery.deliveryFee ? `₦${delivery.deliveryFee.toLocaleString()}` : "—"}
                        </td>

                        <td className="px-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            {hasOTP && (
                              <button 
                                onClick={() => setShowOTPDisplay(true)}
                                className={`p-2 rounded-xl transition-colors ${
                                  delivery.isLocked 
                                    ? 'bg-red-600 text-white animate-pulse' 
                                    : (otpExpired ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'hover:bg-amber-50 text-amber-600')
                                }`}
                                title={delivery.isLocked ? "Security Lockout! Too many failed attempts." : (otpExpired ? "OTP has expired!" : "View OTPs")}
                              >
                                {delivery.isLocked ? (
                                  <FiLock size={18} />
                                ) : (
                                  otpExpired ? <FiAlertCircle size={18} /> : <FiClock size={18} />
                                )}
                              </button>
                            )}

                            <button 
                              onClick={() => setInfoModalDeliveryId(delivery._id)}
                              className="p-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="View Logistics Overview"
                            >
                              <FiEye size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Create Delivery Modal - Unchanged */}
      {showCreateForm && (
        <CreateDeliveryForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setShowCreateForm(false)} 
        />
      )}

      {/* OTP Modal - Now Scrollable */}
      <Dialog 
        open={showOTPDisplay} 
        onOpenChange={(open) => {
          setShowOTPDisplay(open);
          if (!open) clearError();
        }}
      >
        <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 rounded-3xl p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-8 pb-6 border-b border-slate-100">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
              <FiMessageSquare className="text-blue-600" /> 
              Customer Verification Codes
            </DialogTitle>
          </DialogHeader>

          {/* Error display */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-3">
              <FiAlertCircle className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {deliveriesWithOTP.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No active OTPs at the moment.
              </div>
            ) : (
              deliveriesWithOTP.map((delivery) => {
                const expired = isOTPExpired(delivery.otpExpiresAt);
                
                return (
                  <div key={delivery._id} className="border-b border-slate-100 pb-10 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-6">
                      <StatusBadge status={delivery.status} />
                      <span className="font-mono text-xs text-slate-500">ID: {delivery._id.slice(-8)}</span>
                    </div>

                    <div className={`relative rounded-2xl p-8 text-center border transition-all ${
                      expired 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      {expired && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider">
                          <FiAlertCircle /> Expired
                        </div>
                      )}
                      
                      <p className={`text-xs uppercase tracking-widest mb-2 ${expired ? 'text-red-500' : 'text-amber-600'}`}>
                        Secure OTP
                      </p>
                      <p className={`text-5xl font-mono font-bold tracking-widest ${expired ? 'text-red-300' : 'text-slate-900'}`}>
                        {delivery.otp}
                      </p>
                      <p className="text-sm text-slate-500 mt-4">
                        {expired 
                          ? "This code has expired. Please regenerate a new one for the hauler." 
                          : "Share this code with the customer for delivery verification."}
                      </p>

                      <div className="mt-8">
                        <Button
                          onClick={() => handleResendOTP(delivery._id)}
                          disabled={resendingId === delivery._id}
                          variant={expired ? "destructive" : "outline"}
                          className="rounded-xl flex items-center gap-2 mx-auto"
                        >
                          <FiRefreshCw className={resendingId === delivery._id ? "animate-spin" : ""} />
                          {expired ? "Regenerate OTP" : "Refresh Code"}
                        </Button>
                        
                        {delivery.otpExpiresAt && (
                          <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1">
                            <FiClock /> Expires: {new Date(delivery.otpExpiresAt).toLocaleString()}
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

      {/* Chat Modal - Unchanged */}
      {chatDeliveryId && (
        <Dialog open={!!chatDeliveryId} onOpenChange={() => setChatDeliveryId(null)}>
          <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
            <ChatInterface 
              deliveryId={chatDeliveryId} 
              currentUserType="vendor" 
              onClose={() => setChatDeliveryId(null)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Logistics Overview Modal */}
      <Dialog open={!!infoModalDeliveryId} onOpenChange={() => setInfoModalDeliveryId(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8 border border-slate-200 z-[60] max-h-[90vh] overflow-y-auto">
          {currentInfoDelivery && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-xl">
                  Logistics Overview
                  <span className="font-mono text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{currentInfoDelivery._id.slice(-8)}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-8 space-y-8">
                {/* Security Status Panel */}
                {currentInfoDelivery.isLocked && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-sm leading-relaxed">
                    <FiShield className="shrink-0 mt-0.5" size={18} />
                    <div className="space-y-2">
                      <p className="font-bold">Security Lockout Active</p>
                      <p className="opacity-80">
                        The hauler has attempted the security code too many times. For your protection, we have locked this shipment. 
                      </p>
                      <p className="font-bold underline cursor-pointer" onClick={() => { setShowOTPDisplay(true); setInfoModalDeliveryId(null); }}>
                        Regenerate OTP to Unlock →
                      </p>
                    </div>
                  </div>
                )}

                {/* Route Section */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <FiMapPin className="text-blue-600 shrink-0" />
                      <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                      <FiArrowRight className="text-emerald-500 shrink-0" />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup From</p>
                        <p className="text-sm font-medium text-slate-700">{currentInfoDelivery.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Deliver To</p>
                        <p className="text-sm font-medium text-slate-700">{currentInfoDelivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escrow Protection</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                        <FiCheckCircle size={10} /> Funds held securely by Haulr
                      </p>
                    </div>
                    <p className="text-xl font-bold text-blue-600 font-mono">₦{(currentInfoDelivery.deliveryFee || 0).toLocaleString()}</p>
                  </div>
                  
                  {currentInfoDelivery.haulerId && (
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <FiTruck />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Hauler</p>
                          <p className="text-sm font-semibold">{getHaulerName(currentInfoDelivery.haulerId)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{getHaulerPhone(currentInfoDelivery.haulerId)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {currentInfoDelivery.status === "accepted" ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="h-12 rounded-xl text-red-500 border-red-100 hover:bg-red-50"
                      onClick={async () => {
                        await cancelAcceptance(currentInfoDelivery._id);
                        setInfoModalDeliveryId(null);
                        fetchMyDeliveries();
                      }}
                      disabled={isLoading}
                    >
                      Decline
                    </Button>
                    <Button 
                      className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      onClick={async () => {
                        await payForDelivery(currentInfoDelivery._id);
                        setInfoModalDeliveryId(null);
                        fetchMyDeliveries();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Pay hauler"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="h-12 rounded-xl flex gap-2 border-slate-200 hover:bg-slate-50"
                      onClick={() => { setChatDeliveryId(currentInfoDelivery._id); setInfoModalDeliveryId(null); }}
                    >
                      <FiMessageSquare /> Chat
                    </Button>
                    {currentInfoDelivery.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        className="h-12 rounded-xl text-red-500 hover:bg-red-50"
                        onClick={() => { setDeleteConfirmId(currentInfoDelivery._id); setInfoModalDeliveryId(null); }}
                      >
                        Delete Job
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-8">
            <DialogHeader>
              <DialogTitle>Cancel this delivery?</DialogTitle>
              <p className="text-slate-500 mt-3">This action cannot be undone.</p>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={async () => {
                  await deleteDelivery(deleteConfirmId);
                  setDeleteConfirmId(null);
                  fetchMyDeliveries();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Delivery"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VendorDashboard;