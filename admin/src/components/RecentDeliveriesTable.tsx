import React from "react";
import { FiArrowUpRight, FiImage } from "react-icons/fi";
import StatusBadge from "./Delivery/StatusBadge";

interface Delivery {
  _id: string;
  pickupAddress: string;
  status: string;
  vendorId?: { name?: string };
  referenceImage?: string;
  podImage?: string;
}

interface RecentDeliveriesTableProps {
  deliveries: Delivery[];
}

const RecentDeliveriesTable: React.FC<RecentDeliveriesTableProps> = ({ deliveries }) => (
  <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#21262d]">
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipment</th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Vendor</th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">Images</th>
            <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#21262d]">
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-sm">No recent deliveries</td>
            </tr>
          ) : deliveries.map((delivery) => (
            <tr key={delivery._id} className="hover:bg-[#1c2128] transition-colors group">
              <td className="px-5 py-4">
                <p className="font-mono text-[11px] text-slate-500">#{delivery._id.slice(-6)}</p>
                <p className="text-slate-300 font-medium truncate max-w-[160px]">{delivery.pickupAddress}</p>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {delivery.vendorId?.name?.[0] ?? "?"}
                  </div>
                  <span className="text-slate-300 font-medium text-sm">{delivery.vendorId?.name ?? "System"}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={delivery.status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex -space-x-1.5">
                  {delivery.referenceImage ? (
                    <img src={delivery.referenceImage} className="w-7 h-7 rounded-md border border-[#30363d] object-cover" title="Reference" />
                  ) : null}
                  {delivery.podImage ? (
                    <img src={delivery.podImage} className="w-7 h-7 rounded-md border border-[#30363d] object-cover" title="POD" />
                  ) : null}
                  {!delivery.referenceImage && !delivery.podImage && (
                    <div className="w-7 h-7 rounded-md border border-[#30363d] bg-slate-800 flex items-center justify-center">
                      <FiImage className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-right">
                <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors">
                  Inspect <FiArrowUpRight className="w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentDeliveriesTable;
