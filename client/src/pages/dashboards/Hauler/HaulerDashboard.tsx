import React, { useState, useEffect, useMemo } from "react";
import { FiTruck, FiActivity, FiShoppingBag, FiClock } from "react-icons/fi";
import ActiveDeliveriesSection from "../../../components/Hauler/ActiveDeliveriesSection";
import AvailableDeliveriesMarket from "../../../components/Hauler/AvailableDeliveriesMarket";
import DeliveryHistorySection from "../../../components/Hauler/DeliveryHistorySection";
import HaulerEarningsWidget from "../../../components/Hauler/HaulerEarningsWidget";
import HaulerDeliveryInfoModal from "../../../components/Hauler/HaulerDeliveryInfoModal";
import HaulerOTPModal from "../../../components/Hauler/HaulerOTPModal";
import HaulerSuccessModal from "../../../components/Hauler/HaulerSuccessModal";
import AcceptDeliveryForm from "../../../components/Delivery/AcceptDeliveryForm/AcceptDeliveryForm";
import BankMethodModal from "../../../components/Wallet/BankMethodModal";
import ChatInterface from "../../../components/Chat/ChatInterface";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useWalletStore } from "../../../store/useWalletStore";
import { Dialog, DialogContent } from "../../../components/ui/dialog";

const HaulerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "market" | "history">("active");
  const [earningsView, setEarningsView] = useState<"cleared" | "escrow">("cleared");
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [chatDeliveryId, setChatDeliveryId] = useState<string | null>(null);
  const [otpModalDeliveryId, setOtpModalDeliveryId] = useState<string | null>(null);
  const [infoModalDeliveryId, setInfoModalDeliveryId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { deliveries, availableDeliveries, fetchAvailable, fetchMyDeliveries } = useDeliveryStore();
  const { wallet, transactions, fetchWallet, fetchTransactions } = useWalletStore();

  useEffect(() => {
    fetchAvailable();
    fetchMyDeliveries();
    fetchWallet();
    fetchTransactions();
  }, [fetchAvailable, fetchMyDeliveries, fetchWallet, fetchTransactions]);

  const activeTransits = useMemo(
    () => deliveries.filter((d) => ["paid", "picked_up", "in_transit"].includes(d.status)),
    [deliveries]
  );
  const historyDeliveries = useMemo(
    () => deliveries.filter((d) => ["delivered", "cancelled"].includes(d.status)),
    [deliveries]
  );
  const clearedEarnings = useMemo(() => wallet?.balance || 0, [wallet]);
  const settlingEarnings = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "release" && t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const escrowedEarnings = useMemo(
    () => activeTransits.reduce((sum, d) => sum + (d.deliveryFee || 0), 0),
    [activeTransits]
  );

  const currentInfoDelivery = infoModalDeliveryId
    ? [...deliveries, ...availableDeliveries].find((d) => d._id === infoModalDeliveryId) ?? null
    : null;
  const otpDelivery = otpModalDeliveryId
    ? deliveries.find((d) => d._id === otpModalDeliveryId)
    : undefined;

  const tabs = [
    { id: "active" as const, label: "Active Transits", Icon: FiActivity, count: activeTransits.length, activeColor: "text-blue-600" },
    { id: "market" as const, label: "Marketplace", Icon: FiShoppingBag, count: availableDeliveries.length, activeColor: "text-emerald-600" },
    { id: "history" as const, label: "History", Icon: FiClock, count: historyDeliveries.length, activeColor: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-slate-200">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <FiTruck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              Hauler Terminal
            </h1>
            <p className="text-slate-500 text-base sm:text-lg ml-1">
              Manage transit flow and secure payouts via OTP
            </p>
          </div>
          <HaulerEarningsWidget
            earningsView={earningsView}
            onToggleView={setEarningsView}
            clearedEarnings={clearedEarnings}
            escrowedEarnings={escrowedEarnings}
            settlingEarnings={settlingEarnings}
            onManagePayout={() => setShowWalletModal(true)}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-4 p-1.5 bg-slate-200/50 rounded-2xl w-fit min-w-max">
            {tabs.map(({ id, label, Icon, count, activeColor }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === id
                    ? `bg-white ${activeColor} shadow-sm`
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={15} />
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "market" && (
            <AvailableDeliveriesMarket
              deliveries={availableDeliveries}
              onSelectDelivery={setSelectedDelivery}
            />
          )}
          {activeTab === "active" && (
            <ActiveDeliveriesSection
              deliveries={activeTransits}
              onViewInfo={setInfoModalDeliveryId}
              onBrowseMarket={() => setActiveTab("market")}
            />
          )}
          {activeTab === "history" && (
            <DeliveryHistorySection deliveries={historyDeliveries} />
          )}
        </section>
      </div>

      {/* Modals */}
      <HaulerDeliveryInfoModal
        delivery={currentInfoDelivery}
        open={!!infoModalDeliveryId}
        onClose={() => setInfoModalDeliveryId(null)}
        onChat={(id) => setChatDeliveryId(id)}
        onVerifyOTP={(id) => setOtpModalDeliveryId(id)}
        onAccept={(id) => setSelectedDelivery(id)}
      />

      <HaulerOTPModal
        deliveryId={otpModalDeliveryId}
        delivery={otpDelivery}
        open={!!otpModalDeliveryId}
        onClose={() => setOtpModalDeliveryId(null)}
        onSuccess={() => setShowSuccessModal(true)}
      />

      <HaulerSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <Dialog open={!!chatDeliveryId} onOpenChange={() => setChatDeliveryId(null)}>
        <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none shadow-none z-[80]">
          {chatDeliveryId && (
            <ChatInterface
              deliveryId={chatDeliveryId}
              currentUserType="hauler"
              onClose={() => setChatDeliveryId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedDelivery && (
        <AcceptDeliveryForm
          deliveryId={selectedDelivery}
          onSuccess={() => {
            setSelectedDelivery(null);
            fetchAvailable();
            fetchMyDeliveries();
            setActiveTab("active");
          }}
          onCancel={() => setSelectedDelivery(null)}
        />
      )}

      <BankMethodModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        balance={clearedEarnings}
      />
    </div>
  );
};

export default HaulerDashboard;
