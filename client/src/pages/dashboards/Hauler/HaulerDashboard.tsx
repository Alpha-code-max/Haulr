import React, { useState, useEffect, useMemo } from "react";
import { 
  FiTruck, 
  FiMapPin, 
  FiActivity, 
  FiPackage, 
  FiArrowRight, 
  FiMessageCircle,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiEye,
  FiPaperclip,
  FiCheck,
  FiCreditCard,
  FiAlertCircle,
  FiSlash
} from "react-icons/fi"; 
import AcceptDeliveryForm from "../../../components/Delivery/AcceptDeliveryForm/AcceptDeliveryForm";
import StatusBadge from "../../../components/Delivery/StatusBadge/StatusBadge";
import ChatInterface from "../../../components/Chat/ChatInterface"; 
import BankMethodModal from "../../../components/Wallet/BankMethodModal";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useWalletStore } from "../../../store/useWalletStore";
import type { DeliveryItem } from "../../../store/useDeliveryStore"; 
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../../../components/ui/dialog"; 

const HaulerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "market" | "history">("active");
  const [earningsView, setEarningsView] = useState<"cleared" | "escrow">("cleared");
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [chatDeliveryId, setChatDeliveryId] = useState<string | null>(null);
  const [otpModalDeliveryId, setOtpModalDeliveryId] = useState<string | null>(null);
  const [infoModalDeliveryId, setInfoModalDeliveryId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [otpValue, setOtpValue] = useState<{ [key: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [key: string]: string }>({});

  const { 
    deliveries, 
    availableDeliveries, 
    fetchAvailable, 
    fetchMyDeliveries, 
    markPickedUp,
    markInTransit,
    confirmDelivery, 
    withdrawAcceptance,
    isLoading, 
  } = useDeliveryStore();

  const { wallet, transactions, fetchWallet, fetchTransactions } = useWalletStore();
  const [podImageUrl, setPodImageUrl] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAvailable();
    fetchMyDeliveries();
    fetchWallet();
    fetchTransactions();
  }, [fetchAvailable, fetchMyDeliveries, fetchWallet, fetchTransactions]);

  const handleAcceptSuccess = () => {
    setSelectedDelivery(null);
    fetchAvailable();
    fetchMyDeliveries();
    setActiveTab("active");
  };

  const openOtpModal = (id: string) => {
    setOtpModalDeliveryId(id);
    setOtpValue(prev => ({ ...prev, [id]: "" }));
    setOtpError(prev => ({ ...prev, [id]: "" }));
    setInfoModalDeliveryId(null);
  };

  const handleConfirmDelivery = async () => {
    if (!otpModalDeliveryId) return;
    const otp = otpValue[otpModalDeliveryId];
    const pod = podImageUrl[otpModalDeliveryId];
    
    if (!pod) {
      setOtpError(prev => ({ ...prev, [otpModalDeliveryId]: "Proof of Delivery photo is required." }));
      return;
    }
    if (!otp || otp.length !== 6) return;

    try {
      await confirmDelivery(otpModalDeliveryId, otp, pod);
      setOtpModalDeliveryId(null);
      setShowSuccessModal(true);
      fetchMyDeliveries();
      fetchWallet();
      fetchTransactions();
    } catch (error: any) {
      // The store handles setting the error state, but we can also handle it locally for the input
      setOtpError(prev => ({ 
        ...prev, 
        [otpModalDeliveryId]: error.response?.data?.message || error || "Verification failed" 
      }));
    }
  };

  const activeTransits = useMemo(() => 
    deliveries.filter(d => ['paid', 'picked_up', 'in_transit'].includes(d.status)), 
    [deliveries]
  );

  const historyDeliveries = useMemo(() => 
    deliveries.filter(d => ['delivered', 'cancelled'].includes(d.status)), 
    [deliveries]
  );

  const clearedEarnings = useMemo(() => wallet?.balance || 0, [wallet]);
  
  const settlingEarnings = useMemo(() => 
    transactions
      .filter(t => t.type === "release" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  
  const escrowedEarnings = useMemo(() => 
    activeTransits.reduce((sum, d) => sum + (d.deliveryFee || 0), 0),
    [activeTransits]
  );

  const getCustomerInfo = (delivery: DeliveryItem) => 
    typeof delivery.customerId === 'object' ? delivery.customerId : null;

  const currentInfoDelivery = infoModalDeliveryId 
    ? [...deliveries, ...availableDeliveries].find(d => d._id === infoModalDeliveryId) 
    : null;
  const currentOtpValue = otpModalDeliveryId ? (otpValue[otpModalDeliveryId] || "") : "";
  const currentOtpError = otpModalDeliveryId ? (otpError[otpModalDeliveryId] || "") : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-slate-200">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <FiTruck className="w-8 h-8 text-white" />
              </div>
              Hauler Terminal
            </h1>
            <p className="text-slate-500 text-lg ml-1">Manage transit flow and secure payouts via OTP</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Earnings Switch Tool */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-sm">
              <button 
                onClick={() => setEarningsView("cleared")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  earningsView === "cleared" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                Cleared
              </button>
              <button 
                onClick={() => setEarningsView("escrow")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                   earningsView === "escrow" ? "bg-amber-600 text-white shadow-md shadow-amber-200" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                In Escrow
              </button>
            </div>

            {/* Simple Earnings Number */}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">
                {earningsView === "cleared" ? "Available Balance" : "Committed in Transit"}
              </p>
              <p className={`text-4xl font-black font-mono transition-colors duration-300 ${
                earningsView === "cleared" ? "text-blue-600" : "text-amber-600"
              }`}>
                ₦{(earningsView === "cleared" ? clearedEarnings : escrowedEarnings).toLocaleString()}
              </p>
              {earningsView === "cleared" && settlingEarnings > 0 && (
                <p className="text-[11px] font-bold text-amber-600 mt-1 flex items-center justify-end gap-1.5 bg-amber-50 px-3 py-1 rounded-full w-fit ml-auto border border-amber-100 animate-pulse">
                  <FiClock size={12} strokeWidth={3} />
                  ₦{settlingEarnings.toLocaleString()} settling (24h)
                </p>
              )}
            </div>
            
            <button 
              onClick={() => setShowWalletModal(true)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors mr-2 group"
            >
              <FiCreditCard className="w-4 h-4" />
              <span className="border-b border-blue-600/30 group-hover:border-blue-700">Manage Payout Settings</span>
              <FiArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "active" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiActivity /> Active Transits ({activeTransits.length})
          </button>
          <button 
            onClick={() => setActiveTab("market")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "market" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiShoppingBag /> Marketplace ({availableDeliveries.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "history" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiClock /> History ({historyDeliveries.length})
          </button>
        </div>

        {/* Marketplace Section - Table Format */}
        {activeTab === "market" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {availableDeliveries.length === 0 ? (
              <div className="py-24 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <FiShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">No available deliveries in your area</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Route</th>
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Est. Payout</th>
                      <th className="px-8 py-5 text-right font-bold text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {availableDeliveries.map(d => (
                      <tr key={d._id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-8 py-6 font-mono text-sm text-slate-400">#{d._id.slice(-6)}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold">{d.pickupAddress}</div>
                            <FiArrowRight className="text-slate-300 shrink-0" />
                            <div className="text-sm font-semibold">{d.deliveryAddress}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono font-bold text-emerald-600">₦{d.deliveryFee?.toLocaleString() || "—"}</td>
                        <td className="px-8 py-6 text-right">
                          <Button 
                            onClick={() => setSelectedDelivery(d._id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 px-6 shadow-md shadow-emerald-200"
                          >
                            Accept Job
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Active Transits Section */}
        {activeTab === "active" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTransits.length === 0 ? (
              <div className="py-24 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center">
                <FiTruck className="w-16 h-16 text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-400">You have no active shipments</h3>
                <Button variant="link" onClick={() => setActiveTab("market")} className="mt-2 text-blue-600 font-bold">
                  Browse the Marketplace <FiArrowRight className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Route Info</th>
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Payout</th>
                      <th className="px-8 py-5 text-right font-bold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTransits.map(delivery => {
                      const customer = getCustomerInfo(delivery);
                      return (
                        <tr key={delivery._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 font-mono text-sm text-slate-400">#{delivery._id.slice(-6)}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-semibold max-w-[200px] truncate">{delivery.pickupAddress}</div>
                              <FiArrowRight className="text-slate-300 shrink-0" />
                              <div className="text-sm font-semibold max-w-[200px] truncate">{delivery.deliveryAddress}</div>
                            </div>
                            {customer && <p className="text-xs text-blue-600 font-medium mt-1">Customer: {customer.name}</p>}
                          </td>
                          <td className="px-8 py-6"><StatusBadge status={delivery.status} /></td>
                          <td className="px-8 py-6 font-mono font-bold text-emerald-600">₦{delivery.deliveryFee?.toLocaleString() || "—"}</td>
                          <td className="px-8 py-6 text-right">
                            <Button 
                              onClick={() => setInfoModalDeliveryId(delivery._id)}
                              variant="ghost" 
                              className="rounded-xl hover:bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-none"
                            >
                              <FiEye size={18} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* History Section */}
        {activeTab === "history" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Completed Route</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400">Your completed jobs will appear here</td>
                    </tr>
                  ) : (
                    historyDeliveries.map(delivery => (
                      <tr key={delivery._id} className="opacity-70 hover:opacity-100 transition-opacity">
                        <td className="px-8 py-6 font-mono text-sm text-slate-400">#{delivery._id.slice(-6)}</td>
                        <td className="px-8 py-6 text-sm font-medium">
                          {delivery.pickupAddress} <span className="mx-2 text-slate-300">→</span> {delivery.deliveryAddress}
                        </td>
                        <td className="px-8 py-6"><StatusBadge status={delivery.status} /></td>
                        <td className="px-8 py-6 font-mono font-bold text-slate-600">₦{(delivery.deliveryFee || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>

      {/* Info Modal (With Chat & OTP button) */}
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
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <FiMapPin className="text-blue-600 shrink-0" />
                      <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                      <FiArrowRight className="text-emerald-500 shrink-0" />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                        <p className="text-sm font-medium text-slate-700">{currentInfoDelivery.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                        <p className="text-sm font-medium text-slate-700">{currentInfoDelivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Payout Balance</p>
                    <p className="text-xl font-bold text-blue-700 font-mono">₦{(currentInfoDelivery.deliveryFee || 0).toLocaleString()}</p>
                  </div>
                  <FiPackage size={32} className="text-blue-100" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                {currentInfoDelivery.status === 'pending' ? (
                  <Button 
                    className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    onClick={() => {
                      setSelectedDelivery(currentInfoDelivery._id);
                      setInfoModalDeliveryId(null);
                    }}
                  >
                    Accept This Job
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-xl flex gap-2 border-slate-200 hover:bg-slate-50"
                      onClick={() => { setChatDeliveryId(currentInfoDelivery._id); setInfoModalDeliveryId(null); }}
                    >
                      <FiMessageCircle /> Chat
                    </Button>
                    
                    {currentInfoDelivery.status === 'accepted' && (
                      <Button 
                        variant="ghost"
                        className="flex-1 h-12 rounded-xl flex gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
                        onClick={async () => {
                          if (confirm("Are you sure you want to withdraw from this assignment? The job will be returned to the marketplace.")) {
                            await withdrawAcceptance(currentInfoDelivery._id);
                            setInfoModalDeliveryId(null);
                          }
                        }}
                      >
                        <FiSlash /> Cancel Assignment
                      </Button>
                    )}

                    {currentInfoDelivery.status === 'paid' && (
                      <Button 
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        onClick={async () => {
                          await markPickedUp(currentInfoDelivery._id);
                          fetchMyDeliveries();
                        }}
                      >
                        Pick Up Package
                      </Button>
                    )}

                    {currentInfoDelivery.status === 'picked_up' && (
                      <Button 
                        className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={async () => {
                          await markInTransit(currentInfoDelivery._id);
                          fetchMyDeliveries();
                        }}
                      >
                        Start Transit
                      </Button>
                    )}

                    {currentInfoDelivery.status === 'in_transit' && (
                      <Button 
                        className={`flex-1 h-12 rounded-xl font-bold text-white transition-all ${
                          currentInfoDelivery.isLocked 
                            ? "bg-slate-400 cursor-not-allowed" 
                            : "bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-100"
                        }`}
                        onClick={() => !currentInfoDelivery.isLocked && openOtpModal(currentInfoDelivery._id)}
                        disabled={currentInfoDelivery.isLocked}
                      >
                        {currentInfoDelivery.isLocked ? "Secure Locked" : "Verify OTP"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-6 z-[80]">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
            <FiCheckCircle size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Delivery Verified!</h2>
            <p className="text-slate-500">The payout has been released and is now in the **24-hour settlement period** for final clearance.</p>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-lg">
            Complete Terminal
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal overlays for Chat and OTP - Standard */}
      <Dialog open={!!otpModalDeliveryId} onOpenChange={() => setOtpModalDeliveryId(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-3xl p-10 z-[70] max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              (deliveries.find(d => d._id === otpModalDeliveryId)?.isLocked) ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}>
              {deliveries.find(d => d._id === otpModalDeliveryId)?.isLocked ? <FiSlash className="w-10 h-10" /> : <FiCheckCircle className="w-10 h-10" />}
            </div>
            <DialogTitle className="text-2xl font-bold">Secure Verification</DialogTitle>
            <p className="text-slate-500 mt-2">Required: PoD Photo & Customer OTP</p>
            {otpModalDeliveryId && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attempts Remaining:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  (5 - (deliveries.find(d => d._id === otpModalDeliveryId)?.otpAttempts || 0)) <= 1 
                    ? "bg-red-100 text-red-600 animate-pulse" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {5 - (deliveries.find(d => d._id === otpModalDeliveryId)?.otpAttempts || 0)} of 5
                </span>
              </div>
            )}
          </div>
          
          {otpModalDeliveryId && (
            <div className="space-y-6">
              {deliveries.find(d => d._id === otpModalDeliveryId)?.isLocked ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-sm leading-relaxed">
                  <FiAlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p>
                    <strong>Security Lockout:</strong> This shipment has been locked due to too many failed OTP attempts. 
                    Please ask the vendor to regenerate a new security code for you.
                  </p>
                </div>
              ) : (
                <>
                  {/* Step 1: PoD Photo Simulation */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Step 1: Proof of Delivery (File Upload)</label>
                    <div 
                      className={`relative group h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        podImageUrl[otpModalDeliveryId] 
                          ? "border-emerald-200 bg-emerald-50/50" 
                          : "border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400"
                      }`}
                      onClick={() => document.getElementById('pod-upload')?.click()}
                    >
                      <input 
                        id="pod-upload"
                        type="file" 
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             // Mock upload success
                             setPodImageUrl(prev => ({ ...prev, [otpModalDeliveryId]: `https://haulr.sh/pod/${file.name}` }));
                          }
                        }}
                      />
                      {podImageUrl[otpModalDeliveryId] ? (
                        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                          <FiCheck className="text-emerald-500 mb-1" size={24} />
                          <p className="text-xs font-bold text-emerald-700">Photo Attached: {podImageUrl[otpModalDeliveryId].split('/').pop()}</p>
                          <p className="text-[9px] text-emerald-600 opacity-60">Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <FiPaperclip size={24} className="mb-1" />
                          <p className="text-xs font-bold">Click to Link Files or Upload Photo</p>
                          <p className="text-[9px] uppercase tracking-tighter opacity-50">Physical proof is required for escrow release</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reference Image Cross-check (New) */}
                  {deliveries.find((d) => d._id === otpModalDeliveryId)
                    ?.referenceImage && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Visual Cross-check: Reference Photo
                      </label>
                      <div className="relative h-40 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                        <img
                          src={
                            deliveries.find((d) => d._id === otpModalDeliveryId)
                              ?.referenceImage
                          }
                          alt="Reference Product"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <FiImage size={10} /> FROM VENDOR
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic px-1 leading-tight">
                        Compare this with the item in front of you before
                        finalizing.
                      </p>
                    </div>
                  )}

                  {/* Step 2: OTP */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Step 2: Customer 6-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={currentOtpValue} 
                      onChange={(e) => setOtpValue(prev => ({ ...prev, [otpModalDeliveryId]: e.target.value.replace(/\D/g, "") }))}
                      className="block w-full text-center text-5xl font-mono tracking-[0.2em] bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 h-20 outline-none transition-all"
                      placeholder="000000"
                    />
                  </div>

                  {currentOtpError && (
                    <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95">
                      <FiAlertCircle size={14} />
                      {currentOtpError}
                    </div>
                  )}

                  <Button 
                    onClick={handleConfirmDelivery} 
                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    disabled={isLoading || currentOtpValue.length !== 6 || !podImageUrl[otpModalDeliveryId]}
                  >
                    {isLoading ? "Authenticating..." : "Finalize Shipment"}
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Interface Layer */}
      {chatDeliveryId && (
        <Dialog open={!!chatDeliveryId} onOpenChange={() => setChatDeliveryId(null)}>
          <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none shadow-none z-[80]">
            <ChatInterface deliveryId={chatDeliveryId} currentUserType="hauler" onClose={() => setChatDeliveryId(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Marketplace Acceptance Overlay */}
      {selectedDelivery && (
        <AcceptDeliveryForm 
          deliveryId={selectedDelivery} 
          onSuccess={handleAcceptSuccess} 
          onCancel={() => setSelectedDelivery(null)} 
        />
      )}

      {/* Bank Account Modal */}
      <BankMethodModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        balance={clearedEarnings}
      />

    </div>
  );
};

export default HaulerDashboard;