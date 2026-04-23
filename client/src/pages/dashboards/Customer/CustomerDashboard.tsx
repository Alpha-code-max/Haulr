import React, { useEffect } from "react";
import {
  FiPackage, FiShield, FiMessageSquare, FiMapPin,
  FiCheckCircle, FiClock, FiTruck,
} from "react-icons/fi";
import StatusBadge from "../../../components/Delivery/StatusBadge/StatusBadge";
import ChatInterface from "../../../components/Chat/ChatInterface";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Dialog, DialogContent } from "../../../components/ui/dialog";

const statusMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending:    { label: "Awaiting hauler", icon: <FiClock className="w-3.5 h-3.5" />, color: "text-amber-600" },
  accepted:   { label: "Hauler assigned", icon: <FiTruck className="w-3.5 h-3.5" />, color: "text-blue-600" },
  paid:       { label: "Payment secured", icon: <FiShield className="w-3.5 h-3.5" />, color: "text-blue-600" },
  picked_up:  { label: "Picked up", icon: <FiPackage className="w-3.5 h-3.5" />, color: "text-cyan-600" },
  in_transit: { label: "On the way to you", icon: <FiTruck className="w-3.5 h-3.5" />, color: "text-cyan-600" },
  delivered:  { label: "Delivered", icon: <FiCheckCircle className="w-3.5 h-3.5" />, color: "text-emerald-600" },
  cancelled:  { label: "Cancelled", icon: <FiPackage className="w-3.5 h-3.5" />, color: "text-slate-400" },
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { deliveries, fetchMyDeliveries } = useDeliveryStore();
  const [chatDeliveryId, setChatDeliveryId] = React.useState<string | null>(null);

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const myDeliveries = deliveries.filter((delivery) => {
    const isVendor =
      typeof delivery.vendorId === "object"
        ? delivery.vendorId._id === user?._id
        : delivery.vendorId === user?._id;
    const isCustomer =
      typeof delivery.customerId === "object"
        ? delivery.customerId._id === user?._id
        : delivery.customerId === user?._id;
    return isVendor || isCustomer;
  });

  const activeCount = myDeliveries.filter((d) => ["in_transit", "picked_up", "paid"].includes(d.status)).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900">
                  <FiPackage className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                My Shipments
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg ml-1">
                Track incoming packages and securely receive your goods
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Live Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">OTP Lock</span>
              </div>
              {activeCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-xl">
                  <span className="text-xs font-bold text-white">{activeCount} en route</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deliveries */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <FiShield className="text-emerald-500 w-5 h-5" />
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Incoming Packages</h2>
              {myDeliveries.length > 0 && (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
                  {myDeliveries.length}
                </span>
              )}
            </div>
          </div>

          {myDeliveries.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiPackage className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg">No packages yet</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                Packages will appear here once a vendor initiates a delivery to you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.map((delivery) => {
                const meta = statusMeta[delivery.status] || statusMeta.pending;
                const isActive = ["in_transit", "picked_up"].includes(delivery.status);

                return (
                  <div
                    key={delivery._id}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all ${
                      isActive
                        ? "border-blue-200 dark:border-blue-800/60 shadow-md shadow-blue-50 dark:shadow-blue-950/30"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Active top bar */}
                    {isActive && (
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    )}

                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="space-y-1.5">
                          <StatusBadge status={delivery.status} />
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${meta.color}`}>
                            {meta.icon}
                            {meta.label}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
                          #{delivery._id.slice(-8)}
                        </span>
                      </div>

                      {/* Route */}
                      <div className="flex gap-4 mb-5">
                        <div className="flex flex-col items-center pt-1 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40" />
                          <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1" />
                          <FiMapPin className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                              {delivery.pickupAddress}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">To You</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                              {delivery.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          {delivery.itemDescription && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {delivery.itemDescription}
                              {delivery.itemWeight ? (
                                <span className="text-slate-400 ml-1">· {delivery.itemWeight}kg</span>
                              ) : null}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setChatDeliveryId(delivery._id)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          <FiMessageSquare className="w-3.5 h-3.5" />
                          Chat with Vendor
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {chatDeliveryId && (
        <Dialog open={!!chatDeliveryId} onOpenChange={() => setChatDeliveryId(null)}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl">
            <ChatInterface
              deliveryId={chatDeliveryId}
              currentUserType="customer"
              onClose={() => setChatDeliveryId(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerDashboard;
