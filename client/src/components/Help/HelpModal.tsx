import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  FiBox, FiTruck, FiShield, FiDollarSign, FiKey, FiCheckCircle,
  FiArrowRight, FiHelpCircle, FiMapPin, FiRotateCw, FiAlertTriangle,
  FiClock, FiPhone, FiZap, FiInfo, FiChevronDown, FiLock,
  FiStar, FiPackage, FiActivity
} from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "vendor" | "hauler";
}

const Step: React.FC<{ n: number; title: string; desc: string; color: string; icon: React.ReactNode }> = ({
  n, title, desc, color, icon
}) => (
  <div className="flex gap-4">
    <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-sm`}>
      {icon}
    </div>
    <div className="flex-1 pt-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {n}</span>
      </div>
      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Tip: React.FC<{ type: "tip" | "warn" | "info"; text: string }> = ({ type, text }) => {
  const styles = {
    tip: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    warn: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
  };
  const icons = { tip: <FiCheckCircle size={13} />, warn: <FiAlertTriangle size={13} />, info: <FiInfo size={13} /> };
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs font-medium leading-relaxed ${styles[type]}`}>
      <span className="shrink-0 mt-0.5">{icons[type]}</span>
      {text}
    </div>
  );
};

const FAQ: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q}</span>
        <FiChevronDown size={16} className={`text-slate-400 transition-transform shrink-0 ml-3 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ n: number; title: string; color: string }> = ({ n, title, color }) => (
  <div className={`flex items-center gap-3 border-l-4 ${color} pl-4`}>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section {n}</p>
      <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{title}</h3>
    </div>
  </div>
);

const HelpModal: React.FC<Props> = ({ isOpen, onClose, defaultTab = "vendor" }) => {
  const [activeTab, setActiveTab] = useState<"vendor" | "hauler">(defaultTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white dark:bg-slate-900 border-none p-0 overflow-hidden rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          {(["vendor", "hauler"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-5 flex items-center justify-center gap-2.5 font-black uppercase tracking-widest text-xs transition-all ${
                activeTab === tab
                  ? tab === "vendor"
                    ? "bg-white dark:bg-slate-900 text-blue-600 border-b-2 border-blue-500"
                    : "bg-white dark:bg-slate-900 text-emerald-600 border-b-2 border-emerald-500"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {tab === "vendor" ? <FiBox size={15} /> : <FiTruck size={15} />}
              {tab === "vendor" ? "Vendor Guide" : "Hauler Guide"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-8 space-y-10">
          {/* Escrow Shield — always visible */}
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
            <FiShield className="absolute right-4 bottom-4 w-20 h-20 text-white/5" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2.5 bg-blue-500/20 rounded-xl shrink-0">
                <FiLock className="text-blue-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-base mb-2">The Haulr Shield — Double-Locked Escrow</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Money <strong>never</strong> goes directly to a hauler. It is locked in a secure escrow vault the moment a vendor pays. It is released to the hauler only when the recipient enters the correct 6-digit OTP — making every delivery fully fraud-proof.
                </p>
              </div>
            </div>
          </div>

          {activeTab === "vendor" ? (
            <div className="space-y-10 animate-in fade-in duration-300">

              {/* Section 1 */}
              <section className="space-y-5">
                <SectionHeader n={1} title="Creating a Shipment" color="border-blue-500" />
                <div className="space-y-5 pl-1">
                  <Step n={1} title="Open the Create Delivery form" color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" icon={<FiPackage size={16} />}
                    desc="Click 'New Shipment' on your vendor dashboard. Fill in pickup address, delivery address, and an optional item description and weight for the hauler's reference." />
                  <Step n={2} title="Enter customer details" color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" icon={<FiPhone size={16} />}
                    desc="Select or enter the customer's ID. Haulr uses this to send the OTP directly to the correct recipient, preventing third-party interception." />
                  <Step n={3} title="Submit and wait for a hauler bid" color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" icon={<FiZap size={16} />}
                    desc="Your job is listed on the hauler marketplace. Haulers will review the route and send you a delivery fee quote. You'll see it appear on your dashboard in real time." />
                </div>
                <div className="space-y-2">
                  <Tip type="tip" text="Provide detailed addresses including landmarks or building numbers — vague addresses cause delays and disputes." />
                  <Tip type="warn" text="Do not share the OTP with the hauler. The OTP is strictly for the final recipient at the delivery address." />
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-5">
                <SectionHeader n={2} title="Escrow & Payment" color="border-amber-500" />
                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                  {[
                    { icon: <FiDollarSign />, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-600", title: "Review the hauler's quote", desc: "Once a hauler sets their price, it appears on your active delivery card. You can accept or reject the quote. Only you control whether payment proceeds." },
                    { icon: <FiLock />, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600", title: "Click 'Pay' to lock funds in escrow", desc: "Clicking Pay moves the exact delivery fee from your Haulr wallet into the escrow lock-box. The hauler cannot access this money until delivery is confirmed." },
                    { icon: <FiKey />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600", title: "OTP is auto-generated and sent to recipient", desc: "Haulr automatically generates a unique 6-digit OTP and sends it to your customer. You can view it in the dashboard under 'Verification Codes' — but never give it to the hauler." },
                    { icon: <FiCheckCircle />, color: "bg-purple-100 dark:bg-purple-950/40 text-purple-600", title: "Delivery confirmed — escrow released", desc: "When the hauler enters the correct OTP at the delivery point, Haulr automatically releases the escrowed funds to their wallet. The job is complete." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>{item.icon}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Tip type="info" text="Your wallet must have sufficient balance before you can pay for a delivery. Top up via the Wallet page using Paystack." />
              </section>

              {/* Section 3 */}
              <section className="space-y-5">
                <SectionHeader n={3} title="OTP Management & Issues" color="border-purple-500" />
                <div className="space-y-3">
                  <div className="flex gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <FiRotateCw className="text-purple-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Regenerating a Lost OTP</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        If the customer loses their OTP or it expires, go to your dashboard → find the delivery → click 'Resend OTP'. A new code is generated and sent. The old one is immediately invalidated.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <FiAlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Hauler OTP Lockout</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        After 3 failed OTP attempts, the delivery is automatically locked for security. Contact Haulr support to investigate and unlock the delivery if needed.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                    <FiClock className="text-amber-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">OTP Expiry</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Each OTP is valid for a set window (typically 24 hours). If the delivery is delayed, use the Resend function to refresh it before the hauler arrives.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="space-y-4">
                <SectionHeader n={4} title="Frequently Asked Questions" color="border-slate-400" />
                <div className="space-y-2">
                  <FAQ q="Can I cancel a delivery after paying?" a="Yes, but only before the hauler marks the package as picked up. Once in transit, the escrow is locked. Contact support if you need to dispute a delivery in progress." />
                  <FAQ q="What if the hauler claims to have delivered but didn't?" a="Without the correct OTP, the funds remain locked in escrow. The hauler cannot be paid without entering the recipient's code — this is your core protection guarantee." />
                  <FAQ q="How do I delete a delivery?" a="Deliveries in 'Pending' status (no hauler yet) can be deleted from your dashboard. Accepted or in-progress deliveries cannot be deleted — contact support for assistance." />
                  <FAQ q="Can I change the delivery address after creating it?" a="Currently, delivery addresses cannot be edited after submission. You must delete the delivery and recreate it. Ensure all addresses are correct before submitting." />
                  <FAQ q="How do I top up my wallet?" a="Go to the Wallet page from the top navigation. Click 'Fund Wallet', enter an amount, and you'll be redirected to Paystack's secure checkout. Funds reflect immediately after payment." />
                </div>
              </section>
            </div>

          ) : (
            <div className="space-y-10 animate-in fade-in duration-300">

              {/* Section 1 */}
              <section className="space-y-5">
                <SectionHeader n={1} title="Finding & Accepting Jobs" color="border-emerald-500" />
                <div className="space-y-4 pl-1">
                  <Step n={1} title="Browse the Marketplace" color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" icon={<FiActivity size={16} />}
                    desc="Switch to the 'Marketplace' tab on your Hauler dashboard. All available pending deliveries are listed with pickup and delivery locations." />
                  <Step n={2} title="Review the delivery details" color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" icon={<FiMapPin size={16} />}
                    desc="Click the eye icon or 'View Full Details' to see item weight, description, and route. Use this to estimate fuel cost and set a fair, competitive fee." />
                  <Step n={3} title="Submit your fee quote" color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" icon={<FiDollarSign size={16} />}
                    desc="Click 'Accept Job' and enter your desired delivery fee. Haulr adds a small platform service charge on top. Your quote is sent to the vendor for approval." />
                </div>
                <div className="space-y-2">
                  <Tip type="tip" text="Set competitive but sustainable fees. Vendors compare quotes — but overly low prices may attract difficult jobs. Factor in distance, traffic, and fuel." />
                  <Tip type="info" text="You can only hold a limited number of active deliveries at a time. Complete current jobs before accepting too many new ones." />
                </div>
              </section>

              {/* Section 2 */}
              <section className="space-y-5">
                <SectionHeader n={2} title="The Delivery Workflow" color="border-blue-500" />
                <div className="space-y-3">
                  {[
                    { icon: <FiCheckCircle />, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600", step: "Vendor Pays", title: "Wait for vendor payment", desc: "After you set a fee, the vendor must click 'Pay' on their end. Only when payment is confirmed will your job move to 'Active'. You will see it in the 'Active Transits' tab." },
                    { icon: <FiPackage />, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-600", step: "Pick Up", title: "Pick up the package", desc: "Go to the pickup address and collect the item. Click 'Pick Up Package' on the delivery card to confirm you have it in your possession. This notifies the vendor." },
                    { icon: <FiTruck />, color: "bg-purple-100 dark:bg-purple-950/40 text-purple-600", step: "In Transit", title: "Start transit", desc: "Once you're on the road to the destination, click 'Start Transit'. Your live GPS location begins broadcasting so the vendor can monitor progress in real time." },
                    { icon: <FiKey />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600", step: "Verify OTP", title: "Verify the OTP at delivery", desc: "At the delivery address, ask the recipient for their 6-digit code. Enter it in the 'Verify OTP' modal on your dashboard. A correct entry instantly releases your earnings." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                      <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>{item.icon}</div>
                      <div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.color.includes("blue") ? "text-blue-500" : item.color.includes("amber") ? "text-amber-500" : item.color.includes("purple") ? "text-purple-500" : "text-emerald-500"}`}>{item.step}</span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3 */}
              <section className="space-y-5">
                <SectionHeader n={3} title="Earnings & Payouts" color="border-amber-500" />
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    {[
                      { label: "In Escrow", desc: "Funds locked during transit — safe and reserved for you" },
                      { label: "Settling", desc: "Funds released but in a 24h clearing window" },
                      { label: "Cleared", desc: "Ready to withdraw to your bank account" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/15 rounded-xl p-3 text-center">
                        <p className="text-xs font-black uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-[10px] opacity-70 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed text-center">
                    After OTP is verified, earnings move from Escrow → Settling → Cleared within 24 hours. Then you can withdraw to any Nigerian bank via your profile.
                  </p>
                </div>
                <div className="space-y-2">
                  <Tip type="warn" text="Never enter an OTP you haven't verified directly with the recipient in person. Fraudsters may try to trick you into entering false codes." />
                  <Tip type="tip" text="Build your rating by delivering on time, communicating clearly, and treating packages with care. Higher ratings attract better-paying jobs." />
                </div>
              </section>

              {/* Section 4 */}
              <section className="space-y-5">
                <SectionHeader n={4} title="OTP Troubleshooting" color="border-red-400" />
                <div className="space-y-3">
                  {[
                    { q: "The customer says they don't have the OTP", a: "Ask them to check their messages. If it's expired or lost, request the vendor to resend from their dashboard. Do NOT proceed without a valid code." },
                    { q: "I entered the code but it says invalid", a: "Double-check for typos — codes are case-insensitive numbers only. If you're certain it's correct and still failing, contact support. After 3 failures the delivery locks for security." },
                    { q: "The delivery is locked after failed attempts", a: "A locked delivery requires admin intervention. Contact Haulr support with your delivery ID. Funds remain safe in escrow during the investigation." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl">
                      <FiAlertTriangle className="text-red-500 shrink-0 mt-0.5" size={15} />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.q}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="space-y-4">
                <SectionHeader n={5} title="Frequently Asked Questions" color="border-slate-400" />
                <div className="space-y-2">
                  <FAQ q="Can I reject a delivery after accepting it?" a="Yes, before the vendor pays you can withdraw your acceptance from the delivery info modal. Once the vendor has paid and the job is active, you can no longer cancel — coordinate with the vendor directly." />
                  <FAQ q="What happens if I can't deliver?" a="Contact the vendor via the in-app chat immediately. If the delivery must be cancelled after escrow, contact Haulr support. Frequent cancellations affect your rating and may restrict your marketplace access." />
                  <FAQ q="How do I improve my chances of getting jobs?" a="Maintain a high rating, respond quickly, set competitive fees, and keep your vehicle information up to date. Vendors can see your profile before accepting your bid." />
                  <FAQ q="How does live location sharing work?" a="When your delivery status moves to 'In Transit', Haulr begins broadcasting your GPS coordinates every 15 seconds. This requires location permission on your device. The vendor sees your position on a live map." />
                  <FAQ q="When can I withdraw my earnings?" a="Once earnings are in 'Cleared' status (typically 24 hours after OTP confirmation), you can initiate a bank withdrawal via your profile's bank details section." />
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <FiHelpCircle size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">Haulr Logistics Guide v3.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
