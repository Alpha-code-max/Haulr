import React from "react";
import {
  FiMapPin,
  FiPackage,
  FiUser,
  FiPhone,
  FiFileText,
  FiActivity,
  FiInfo,
} from "react-icons/fi";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import StatusBadge from "../Delivery/StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../store/useDeliveryStore";

interface Props {
  delivery: DeliveryItem | null;
  open: boolean;
  onClose: () => void;
}

const HaulerFullDetailsModal: React.FC<Props> = ({ delivery, open, onClose }) => {
  if (!delivery) return null;

  const vendor = typeof delivery.vendorId === "object" ? delivery.vendorId : null;
  const customer = typeof delivery.customerId === "object" ? delivery.customerId : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-0 border border-slate-200 dark:border-slate-800 z-[70] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold dark:text-slate-100 flex items-center gap-2">
                Shipment Details
              </DialogTitle>
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                ID: {delivery._id}
              </p>
            </div>
            <StatusBadge status={delivery.status} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 pb-12">
          {/* Reference Image Section */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
            {delivery.referenceImage ? (
              <img
                src={delivery.referenceImage}
                alt="Delivery Item"
                className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <FiPackage size={48} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No image provided</p>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <FiInfo size={12} /> Package Preview
              </div>
            </div>
          </div>

          {/* Item Description & Weight */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-500" /> What's being delivered?
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {delivery.itemDescription || "No description provided"}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Est. Weight</p>
                  <p className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {delivery.itemWeight ? `${delivery.itemWeight} KG` : "Not specified"}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Earnings</p>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₦{(delivery.deliveryFee || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Route Section */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FiActivity className="text-emerald-500" /> Route Logistics
            </h4>
            <div className="flex gap-4">
              <div className="flex flex-col items-center py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30" />
                <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 my-1" />
                <FiMapPin className="text-emerald-500" />
              </div>
              <div className="space-y-8 flex-1">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-1">Pickup Point</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{delivery.pickupAddress}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <FiUser size={12} /> {vendor?.name || "Vendor"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-1">Destination</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{delivery.deliveryAddress}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <FiUser size={12} /> {customer?.name || "Customer"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/20">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-2">Vendor Contact</p>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{vendor?.name || "N/A"}</span>
                {vendor?.phone && (
                  <a href={`tel:${vendor.phone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                    <FiPhone size={10} /> {vendor.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/20">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-2">Customer Contact</p>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{customer?.name || "N/A"}</span>
                {customer?.phone && (
                  <a href={`tel:${customer.phone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                    <FiPhone size={10} /> {customer.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerFullDetailsModal;
