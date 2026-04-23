import React from "react";
import { FiClock, FiArrowRight, FiCreditCard, FiTrendingUp, FiLock } from "react-icons/fi";

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
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-5 min-w-[280px]">
    {/* Toggle */}
    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
      <button
        onClick={() => onToggleView("cleared")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
          earningsView === "cleared"
            ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <FiTrendingUp className="w-3.5 h-3.5" />
        Available
      </button>
      <button
        onClick={() => onToggleView("escrow")}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
          earningsView === "escrow"
            ? "bg-white dark:bg-slate-700 text-amber-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <FiLock className="w-3.5 h-3.5" />
        In Escrow
      </button>
    </div>

    {/* Amount display */}
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500 mb-2">
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
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/40 rounded-xl w-fit">
          <FiClock className="w-3 h-3 text-amber-600 shrink-0" />
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
            ₦{settlingEarnings.toLocaleString()} settling (24h)
          </p>
        </div>
      )}
    </div>

    {/* Payout link */}
    <button
      onClick={onManagePayout}
      className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 group"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <FiCreditCard className="w-4 h-4" />
        Manage Payout Settings
      </div>
      <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
    </button>
  </div>
);

export default HaulerEarningsWidget;
