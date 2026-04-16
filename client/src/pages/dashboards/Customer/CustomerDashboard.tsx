import React, { useEffect } from "react";
import {
  FiPackage,
  FiShield,
  FiMessageSquare,
  FiMapPin,
  FiCheckCircle
} from "react-icons/fi";
import StatusBadge from "../../../components/Delivery/StatusBadge/StatusBadge";
import ChatInterface from "../../../components/Chat/ChatInterface";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent } from "../../../components/ui/dialog";

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 section-container">
      <div className="py-6">
        <div className="space-y-16">
          {/* Header */}
          <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FiPackage className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              My Shipments
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg max-w-2xl">
              Track your incoming packages, communicate with vendors, and securely receive your goods.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Live Status Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="h-2 w-2 rounded-full bg-lime-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">OTP Delivery Lock</span>
              </div>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
              <h2 className="text-2xl font-black m-0 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <FiShield className="text-green-500" /> Incoming Packages
              </h2>
            </div>

            {myDeliveries.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <FiPackage className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No packages found for you yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  Packages will appear here once a vendor initiates a delivery.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {myDeliveries.map((delivery) => (
                  <div key={delivery._id} className="py-10 first:pt-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <StatusBadge status={delivery.status} />
                          <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500">
                            TRACKING: {delivery._id.slice(-8)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block mb-2 tracking-widest">
                              Route Information
                            </label>
                            <div className="text-sm font-bold space-y-1 text-slate-800 dark:text-slate-200">
                              <p className="flex items-center gap-2">
                                <FiMapPin className="text-slate-400 w-3 h-3" /> {delivery.pickupAddress}
                              </p>
                              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 ml-1.5" />
                              <p className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500 w-3 h-3" /> {delivery.deliveryAddress}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block mb-2 tracking-widest">
                              Cargo Details
                            </label>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              {delivery.itemDescription || "General Shipment"}
                              {delivery.itemWeight ? (
                                <span className="text-slate-400 dark:text-slate-500 ml-1">({delivery.itemWeight}kg)</span>
                              ) : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChatDeliveryId(delivery._id)}
                          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 h-10 px-6 font-bold"
                        >
                          <FiMessageSquare className="w-4 h-4 mr-2" /> Chat with Vendor
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default CustomerDashboard;
