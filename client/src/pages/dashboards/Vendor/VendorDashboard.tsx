import React, { useState, useEffect, useMemo } from "react";
import {
  FiPackage, FiPlus, FiClock, FiCheckCircle, FiTruck,
  FiAlertCircle, FiActivity,
} from "react-icons/fi";
import CreateDeliveryForm from "../../../components/Delivery/CreateDeliveryForm/CreateDeliveryForm";
import ChatInterface from "../../../components/Chat/ChatInterface";
import VendorDeliveryTable from "../../../components/Vendor/VendorDeliveryTable";
import VendorOTPModal from "../../../components/Vendor/VendorOTPModal";
import VendorLogisticsModal from "../../../components/Vendor/VendorLogisticsModal";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useWalletStore } from "../../../store/useWalletStore";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../../../components/ui/dialog";

const VendorDashboard: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [otpDeliveryId, setOtpDeliveryId] = useState<string | null>(null);
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
    clearError,
  } = useDeliveryStore();

  const { wallet, fetchWallet } = useWalletStore();

  useEffect(() => {
    fetchMyDeliveries();
    fetchWallet();
  }, [fetchMyDeliveries, fetchWallet]);

  const myDeliveries = useMemo(() => deliveries.filter((delivery) => {
    const vId =
      typeof delivery.vendorId === "object"
        ? delivery.vendorId._id.toString()
        : delivery.vendorId.toString();
    return vId === user?._id.toString();
  }), [deliveries, user]);

  const stats = useMemo(() => ({
    total: myDeliveries.length,
    pending: myDeliveries.filter((d) => d.status === "pending").length,
    active: myDeliveries.filter((d) => ["accepted", "paid", "picked_up", "in_transit"].includes(d.status)).length,
    delivered: myDeliveries.filter((d) => d.status === "delivered").length,
  }), [myDeliveries]);

  const isOTPExpired = (expiresAt?: string): boolean => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
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

  const currentInfoDelivery = infoModalDeliveryId
    ? (deliveries.find((d) => d._id === infoModalDeliveryId) ?? null)
    : null;

  const statCards = [
    { label: "Total Deliveries", value: stats.total, icon: FiPackage, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Awaiting Hauler", value: stats.pending, icon: FiClock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "In Progress", value: stats.active, icon: FiActivity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Completed", value: stats.delivered, icon: FiCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900">
                <FiTruck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              Vendor Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg ml-1">
              Post deliveries, assign haulers, and manage escrow payments
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 w-fit"
          >
            <FiPlus className="w-4 h-4" />
            New Delivery
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Deliveries Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Your Deliveries</h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
                {myDeliveries.length}
              </span>
            </div>
            {wallet && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 rounded-xl">
                <span className="text-xs font-bold text-emerald-600">Wallet:</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  ₦{wallet.balance.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <VendorDeliveryTable
            deliveries={myDeliveries}
            onViewInfo={setInfoModalDeliveryId}
            onViewOTP={setOtpDeliveryId}
            isOTPExpired={isOTPExpired}
          />
        </section>
      </div>

      {/* Create Delivery Overlay */}
      {showCreateForm && (
        <CreateDeliveryForm
          onSuccess={() => {
            setShowCreateForm(false);
            fetchMyDeliveries();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* OTP Display Modal */}
      <VendorOTPModal
        open={!!otpDeliveryId}
        onClose={() => {
          setOtpDeliveryId(null);
          clearError();
        }}
        deliveries={myDeliveries.filter(d => d._id === otpDeliveryId)}
        onResendOTP={handleResendOTP}
        resendingId={resendingId}
        error={error}
      />

      {/* Logistics Overview Modal */}
      <VendorLogisticsModal
        delivery={currentInfoDelivery}
        open={!!infoModalDeliveryId}
        onClose={() => {
          setInfoModalDeliveryId(null);
          clearError();
        }}
        onChat={(id) => setChatDeliveryId(id)}
        onDelete={(id) => setDeleteConfirmId(id)}
        onShowOTP={(id) => setOtpDeliveryId(id)}
        onPay={async (id) => {
          await payForDelivery(id);
          fetchMyDeliveries();
        }}
        onDecline={async (id) => {
          await cancelAcceptance(id);
          fetchMyDeliveries();
        }}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
        walletBalance={wallet?.balance || 0}
      />

      {/* Chat Dialog */}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8">
            <DialogHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center mb-4">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-black text-slate-900 dark:text-slate-100">
                Cancel this delivery?
              </DialogTitle>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                This action is permanent and cannot be undone.
              </p>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={async () => {
                  await deleteDelivery(deleteConfirmId);
                  setDeleteConfirmId(null);
                  fetchMyDeliveries();
                }}
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors disabled:opacity-60"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VendorDashboard;
