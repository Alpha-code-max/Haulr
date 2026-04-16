import React, { useState, useEffect } from "react";
import { FiTruck, FiPackage, FiPlus } from "react-icons/fi";
import CreateDeliveryForm from "../../../components/Delivery/CreateDeliveryForm/CreateDeliveryForm";
import ChatInterface from "../../../components/Chat/ChatInterface";
import VendorDeliveryTable from "../../../components/Vendor/VendorDeliveryTable";
import VendorOTPModal from "../../../components/Vendor/VendorOTPModal";
import VendorLogisticsModal from "../../../components/Vendor/VendorLogisticsModal";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useWalletStore } from "../../../store/useWalletStore";
import { Button } from "../../../components/ui/button";
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

  const myDeliveries = deliveries.filter((delivery) => {
    const vId =
      typeof delivery.vendorId === "object"
        ? delivery.vendorId._id.toString()
        : delivery.vendorId.toString();
    return vId === user?._id.toString();
  });

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <FiTruck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              Vendor Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base sm:text-lg">
              Manage deliveries, assign haulers, and track escrow payments
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-blue-500/20 w-fit"
          >
            <FiPlus className="w-5 h-5 mr-2" /> New Delivery
          </Button>
        </div>

        {/* Deliveries Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <FiPackage className="text-slate-600 dark:text-slate-400" /> Your Deliveries
            </h2>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium">
              {myDeliveries.length} total
            </span>
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
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8">
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
