import React from "react";
import { FiX, FiMapPin, FiUser, FiTruck, FiPackage, FiDollarSign, FiImage, FiClock } from "react-icons/fi";
import StatusBadge from "./Delivery/StatusBadge";
import type { AdminDelivery } from "../store/useAdminStore";

interface Props {
  delivery: AdminDelivery;
  onClose: () => void;
}

const Field: React.FC<{ label: string; value?: string | number | null; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">{label}</p>
    <p className={`text-sm text-slate-300 ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
  </div>
);

const Party: React.FC<{ label: string; person?: { name: string; phone?: string } | null; icon: React.ReactNode }> = ({ label, person, icon }) => (
  <div className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
    <div className="w-9 h-9 rounded-lg bg-[#21262d] flex items-center justify-center text-slate-400 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</p>
      {person ? (
        <>
          <p className="text-sm font-semibold text-slate-300">{person.name}</p>
          {person.phone && <p className="text-xs text-slate-500">{person.phone}</p>}
        </>
      ) : (
        <p className="text-sm text-slate-600 italic">Not assigned</p>
      )}
    </div>
  </div>
);

const DeliveryInspectModal: React.FC<Props> = ({ delivery, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-[#0d1117] border-l border-[#21262d] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d1117]/90 backdrop-blur-sm border-b border-[#21262d] px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-mono text-[11px] text-slate-500">#{delivery._id.slice(-8).toUpperCase()}</p>
              <StatusBadge status={delivery.status} />
            </div>
            <h2 className="text-white font-bold text-lg leading-tight truncate max-w-sm">
              {delivery.pickupAddress}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#21262d] transition-colors shrink-0"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Addresses */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Route</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-[#161b22] rounded-xl border border-[#21262d]">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <FiMapPin size={12} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pickup</p>
                  <p className="text-sm text-slate-300">{delivery.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#161b22] rounded-xl border border-[#21262d]">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <FiMapPin size={12} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Delivery</p>
                  <p className="text-sm text-slate-300">{delivery.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Parties</p>
            <div className="grid grid-cols-1 gap-2">
              <Party label="Vendor" person={delivery.vendorId} icon={<FiPackage size={15} />} />
              <Party label="Customer" person={delivery.customerId} icon={<FiUser size={15} />} />
              <Party label="Hauler" person={delivery.haulerId} icon={<FiTruck size={15} />} />
            </div>
          </div>

          {/* Item details */}
          {(delivery.itemDescription || delivery.itemWeight) && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Item</p>
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#161b22] rounded-xl border border-[#21262d]">
                <Field label="Description" value={delivery.itemDescription} />
                <Field label="Weight" value={delivery.itemWeight ? `${delivery.itemWeight} kg` : undefined} />
              </div>
            </div>
          )}

          {/* Financials */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Financials</p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#161b22] rounded-xl border border-[#21262d]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Delivery Fee</p>
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <FiDollarSign size={13} />
                  {delivery.deliveryFee != null ? `₦${delivery.deliveryFee.toLocaleString()}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Platform Fee</p>
                <p className="text-sm font-semibold text-blue-400 flex items-center gap-1">
                  <FiDollarSign size={13} />
                  {delivery.platformFee != null ? `₦${delivery.platformFee.toLocaleString()}` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          {(delivery.referenceImage || delivery.podImage) && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Images</p>
              <div className="grid grid-cols-2 gap-3">
                {delivery.referenceImage && (
                  <div>
                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FiImage size={10} /> Reference
                    </p>
                    <img
                      src={delivery.referenceImage}
                      alt="Reference"
                      className="w-full aspect-square object-cover rounded-xl border border-[#21262d]"
                    />
                  </div>
                )}
                {delivery.podImage && (
                  <div>
                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FiImage size={10} /> Proof of Delivery
                    </p>
                    <img
                      src={delivery.podImage}
                      alt="POD"
                      className="w-full aspect-square object-cover rounded-xl border border-[#21262d]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Timeline</p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#161b22] rounded-xl border border-[#21262d]">
              <div className="flex items-start gap-2">
                <FiClock size={13} className="text-slate-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Created</p>
                  <p className="text-xs text-slate-400">
                    {delivery.createdAt
                      ? new Date(delivery.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiClock size={13} className="text-slate-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Last Update</p>
                  <p className="text-xs text-slate-400">
                    {delivery.updatedAt
                      ? new Date(delivery.updatedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInspectModal;
