import React from "react";
import { FiCheckCircle, FiTrendingUp, FiClock } from "react-icons/fi";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

const HaulerSuccessModal: React.FC<Props> = ({ open, onClose }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-0 border border-slate-200 dark:border-slate-700 text-center z-[80] overflow-hidden">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />

      <div className="p-8 space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-fit">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <FiCheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Delivery Verified!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Your payout has been released and is in the 24-hour settlement window for final clearance.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-left">
            <FiTrendingUp className="w-4 h-4 text-emerald-600 mb-1.5" />
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Payout Released</p>
            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500 mt-0.5">Funds on their way</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl text-left">
            <FiClock className="w-4 h-4 text-amber-600 mb-1.5" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">24h Clearing</p>
            <p className="text-[10px] text-amber-600/70 dark:text-amber-500 mt-0.5">Standard settlement</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-white transition-colors"
        >
          Done
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export default HaulerSuccessModal;
