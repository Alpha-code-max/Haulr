import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  FiBox,
  FiTruck,
  FiShield,
  FiDollarSign,
  FiKey,
  FiCheckCircle,
  FiArrowRight,
  FiHelpCircle,
  FiMapPin,
  FiRefreshCw
} from "react-icons/fi";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "vendor" | "hauler";
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, defaultTab = "vendor" }) => {
  const [activeTab, setActiveTab] = React.useState<"vendor" | "hauler">(defaultTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white dark:bg-slate-900 border-none p-0 overflow-hidden rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Sidebar/Header Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab("vendor")}
            className={`flex-1 py-6 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all ${
              activeTab === "vendor"
                ? "bg-white dark:bg-slate-900 text-blue-600 border-b-2 border-blue-500 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.2)]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FiBox size={16} /> Vendor Guide
          </button>
          <button
            onClick={() => setActiveTab("hauler")}
            className={`flex-1 py-6 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all ${
              activeTab === "hauler"
                ? "bg-white dark:bg-slate-900 text-emerald-600 border-b-2 border-emerald-500 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.2)]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <FiTruck size={16} /> Hauler Guide
          </button>
        </div>

        <div className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Core Concept: The Escrow Shield */}
          <div className="mb-12 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden">
            <FiShield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FiShield className="text-blue-400" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wider">The Haulr Shield</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Haulr uses a <b>Double-Locked Escrow System</b>. Funds are never paid directly to haulers. They are held in a secure lock-box and only released when the unique 6-digit receiver code is verified.
              </p>
            </div>
          </div>

          {activeTab === "vendor" ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Section 1: Creation */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-black text-slate-900">1. Initiating a Shipment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <FiMapPin className="text-blue-500 mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Precise Routing</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Enter pickup and delivery points carefully. Haulers use these to bid on your job.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <FiKey className="text-blue-500 mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">The Verification Key</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">A unique 6-digit OTP is generated. Share this <b>only</b> with the final receiver.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Financials */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
                  <h3 className="text-xl font-black text-slate-900">2. Escrow & Payment</h3>
                </div>
                <div className="p-6 border border-slate-100 rounded-3xl space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <FiDollarSign />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Triggering the Lock</h4>
                      <p className="text-sm text-slate-500 mt-1">Once a hauler offers a price, you must click 'Pay' from your dashboard. This moves money from your wallet to the Escrow box.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FiRefreshCw />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">OTP Management</h4>
                      <p className="text-sm text-slate-500 mt-1">If your customer loses their OTP, you can regenerate a new one from your dashboard under 'Customer Verification Codes'.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Section 1: Earning */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                  <h3 className="text-xl font-black text-slate-900">1. Maximizing Earnings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <FiTruck className="text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Smart Bidding</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Accept jobs from the Marketplace and set your fee. Haulr adds a flat ₦100 service charge automatically.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <FiDollarSign className="text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Escrowed Balance</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Funds appear in your 'Escrowed Earnings' as soon as the vendor pays. You can't withdraw them yet.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Logistics Phase */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-black text-slate-900">2. The 3-Stage Workflow</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { t: "Pick Up Package", d: "Click once you have the item in your possession.", icon: <FiBox /> },
                    { t: "Start Transit", d: "Click when you are on the road to the destination.", icon: <FiArrowRight /> },
                    { t: "Verify OTP", d: "The final step. Enter the customer's code to get paid.", icon: <FiCheckCircle /> },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{step.t}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Payouts */}
              <section className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm self-start">
                    <FiCheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900">Instant Settlement</h4>
                    <p className="text-sm text-emerald-700/80 mt-1 leading-relaxed">
                      As soon as you enter the correct 6-digit OTP, the escrow funds move to your <b>Cleared Earnings</b>. You can then manage your bank details and initiate a withdrawal.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
             <FiHelpCircle />
             <span className="text-xs font-bold uppercase tracking-widest">Version 2.4 Logistics Engine</span>
          </div>
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Terminal Complete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;