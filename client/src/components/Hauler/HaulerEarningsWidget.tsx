import React from "react";
import { FiClock, FiArrowRight, FiCreditCard } from "react-icons/fi";

interface Props {
  earningsView: "cleared" | "escrow";
  onToggleView: (view: "cleared" | "escrow") => void;
  clearedEarnings: number;
  escrowedEarnings: number;
  settlingEarnings: number;
  onManagePayout: () => void;
}

const HaulerEarningsWidget: React.FC<Props> = ({
  earningsView,
  onToggleView,
  clearedEarnings,
  escrowedEarnings,
  settlingEarnings,
  onManagePayout,
}) => (
  <div className="flex flex-col items-end gap-3">
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 flex gap-1 shadow-sm">
      <button
        onClick={() => onToggleView("cleared")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          earningsView === "cleared"
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        Cleared
      </button>
      <button
        onClick={() => onToggleView("escrow")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          earningsView === "escrow"
            ? "bg-amber-600 text-white shadow-md shadow-amber-200"
            : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        In Escrow
      </button>
    </div>

    <div className="text-right">
      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500 mb-1">
        {earningsView === "cleared" ? "Available Balance" : "Committed in Transit"}
      </p>
      <p
        className={`text-4xl font-black font-mono transition-colors duration-300 ${
          earningsView === "cleared" ? "text-blue-600" : "text-amber-600"
        }`}
      >
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
      onClick={onManagePayout}
      className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors mr-2 group"
    >
      <FiCreditCard className="w-4 h-4" />
      <span className="border-b border-blue-600/30 group-hover:border-blue-700">
        Manage Payout Settings
      </span>
      <FiArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default HaulerEarningsWidget;
