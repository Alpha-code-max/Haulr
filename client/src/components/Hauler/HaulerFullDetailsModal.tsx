import React from "react";
import {
  FiMapPin, FiPackage, FiUser, FiPhone,
  FiFileText, FiActivity,
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

  const vendor = typeof delivery.vendorId === "object" ? delivery.vendorId as any : null;
  const customer = typeof delivery.customerId === "object" ? delivery.customerId as any : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-0 border border-slate-200 dark:border-slate-800 z-[70] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100">
                Shipment Details
              </DialogTitle>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                {delivery._id}
              </p>
            </div>
            <StatusBadge status={delivery.status} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-8">
          {/* Reference Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group">
            {delivery.referenceImage ? (
              <img
                src={delivery.referenceImage}
                alt="Delivery Item"
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <FiPackage className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm font-medium">No image provided</p>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                Package Preview
              </span>
            </div>
          </div>

          {/* Item Info */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiFileText className="w-3.5 h-3.5 text-blue-500" /> Item Details
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {delivery.itemDescription || "No description provided"}
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Weight</p>
                <p className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 mt-1">
                  {delivery.itemWeight ? `${delivery.itemWeight} KG` : "—"}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Earnings</p>
                <p className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  ₦{(delivery.deliveryFee || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FiActivity className="w-3.5 h-3.5 text-emerald-500" /> Route Logistics
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/40" />
                <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1" />
                <FiMapPin className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight mb-1">Pickup Point</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{delivery.pickupAddress}</p>
                  {vendor?.name && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                      <FiUser className="w-3 h-3" /> {vendor.name}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight mb-1">Destination</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{delivery.deliveryAddress}</p>
                  {customer?.name && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                      <FiUser className="w-3 h-3" /> {customer.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Vendor Contact", person: vendor },
              { label: "Customer Contact", person: customer },
            ].map(({ label, person }) => (
              <div
                key={label}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/20"
              >
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight mb-2">{label}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{person?.name || "N/A"}</p>
                {person?.phone && (
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center gap-1 mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FiPhone className="w-3 h-3" /> {person.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaulerFullDetailsModal;
