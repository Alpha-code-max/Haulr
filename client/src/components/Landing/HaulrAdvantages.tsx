import React, { useState } from "react";
import {
  FiShield, FiMapPin, FiCheckCircle, FiX, FiZap, FiStar,
  FiTruck, FiDollarSign, FiLock, FiPhone, FiAlertTriangle, FiClock
} from "react-icons/fi";

interface Advantage {
  icon: React.ElementType;
  title: string;
  haulr: string;
  traditional: string;
  highlight: string;
}

const advantages: Advantage[] = [
  {
    icon: FiLock,
    title: "Payment Security",
    haulr: "Funds held in double-locked escrow. Haulers are paid only after OTP confirmation by the recipient — zero fraud risk.",
    traditional: "Cash on delivery or upfront bank transfers. Theft, non-payment, and disputes are common with no dispute resolution.",
    highlight: "Escrow-protected",
  },
  {
    icon: FiMapPin,
    title: "Live Tracking",
    haulr: "Real-time GPS tracking every 15 seconds. Vendors and customers see exactly where the package is at all times.",
    traditional: "You call the driver and hope for an update. No visibility, no accountability, and no way to plan around ETAs.",
    highlight: "Live GPS map",
  },
  {
    icon: FiCheckCircle,
    title: "Delivery Verification",
    haulr: "Unique 6-digit OTP generated per delivery. Only the correct recipient can release the hauler's payment — proof of delivery guaranteed.",
    traditional: "Driver says it's delivered. There's no verifiable record of who received what, when, or whether it was the right person.",
    highlight: "OTP-verified",
  },
  {
    icon: FiStar,
    title: "Accountability & Ratings",
    haulr: "Haulers are KYC-verified with NIN and vehicle checks. Post-delivery ratings build a trust score that's visible to vendors.",
    traditional: "Random phone contacts or roadside drivers. No background checks, no history, no way to assess reliability.",
    highlight: "KYC + ratings",
  },
  {
    icon: FiDollarSign,
    title: "Transparent Pricing",
    haulr: "Haulers quote their fee upfront. Vendors approve before any money moves. No surprise charges, no price inflation mid-journey.",
    traditional: "Pricing is negotiated verbally, often changes in transit. Extra charges appear without notice and are hard to dispute.",
    highlight: "Agreed upfront",
  },
  {
    icon: FiZap,
    title: "Speed of Operations",
    haulr: "Post a delivery in under 2 minutes. Haulers bid within minutes. The entire logistics chain is automated and frictionless.",
    traditional: "Finding a trusted driver takes calls, WhatsApp groups, and referrals. Arranging payment adds more back-and-forth delays.",
    highlight: "2-min setup",
  },
  {
    icon: FiPhone,
    title: "In-App Communication",
    haulr: "Built-in chat between vendor and hauler on every delivery. All messages tied to a specific job — no confusion, no lost context.",
    traditional: "Personal phone calls and WhatsApp messages scattered across contacts. No record of what was agreed, leading to disputes.",
    highlight: "Integrated chat",
  },
  {
    icon: FiShield,
    title: "Dispute Resolution",
    haulr: "Every transaction is logged with timestamps, GPS history, and OTP records. Support can investigate and resolve disputes with evidence.",
    traditional: "Word against word. No transaction trail means disputes are nearly impossible to resolve fairly or quickly.",
    highlight: "Full audit trail",
  },
];

const HaulrAdvantages: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <FiTruck size={12} /> Why Haulr Wins
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
            Modern Logistics vs.<br />
            <span className="text-blue-600">Old Way of Hauling</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Traditional haulage is built on trust with no safety net. Haulr adds security, transparency, and accountability to every delivery — without slowing anything down.
          </p>
        </div>

        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr] gap-4 mb-4 px-4">
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Feature</span>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-black uppercase tracking-wider">
              <FiShield size={12} /> Haulr
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
              <FiAlertTriangle size={12} /> Traditional
            </div>
          </div>
        </div>

        {/* Comparison rows */}
        <div className="space-y-3">
          {advantages.map((adv, i) => {
            const isOpen = activeIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-50 dark:shadow-blue-950/30"
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                } bg-white dark:bg-slate-900`}
              >
                {/* Mobile: click to expand */}
                <button
                  className="w-full sm:hidden flex items-center justify-between p-5 text-left"
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isOpen ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>
                      <adv.icon />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{adv.title}</p>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{adv.highlight}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>

                {/* Mobile expanded */}
                {isOpen && (
                  <div className="sm:hidden px-5 pb-5 space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-2">
                        <FiCheckCircle size={13} className="text-blue-600" />
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider">Haulr</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{adv.haulr}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <FiX size={13} className="text-slate-400" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Traditional</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{adv.traditional}</p>
                    </div>
                  </div>
                )}

                {/* Desktop: always visible grid */}
                <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr] gap-0 divide-x divide-slate-100 dark:divide-slate-800">
                  {/* Feature label */}
                  <div className="p-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <adv.icon />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{adv.title}</p>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{adv.highlight}</span>
                    </div>
                  </div>
                  {/* Haulr */}
                  <div className="p-5 bg-blue-50/40 dark:bg-blue-950/10">
                    <div className="flex items-start gap-2">
                      <FiCheckCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{adv.haulr}</p>
                    </div>
                  </div>
                  {/* Traditional */}
                  <div className="p-5">
                    <div className="flex items-start gap-2">
                      <FiX size={14} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{adv.traditional}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl px-10 py-8 text-white shadow-2xl shadow-slate-200 dark:shadow-none">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FiClock className="text-blue-400" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">The numbers speak</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: "100%", label: "Fraud-proof deliveries" },
                { value: "15s", label: "Location update interval" },
                { value: "0", label: "Cash handling required" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HaulrAdvantages;
