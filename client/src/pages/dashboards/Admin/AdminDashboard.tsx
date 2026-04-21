import React, { useState } from "react";
import { FiShield, FiPercent, FiAlertTriangle } from "react-icons/fi";
import FraudFlagsPanel from "../../../components/Admin/FraudFlagsPanel";
import CommissionPanel from "../../../components/Admin/CommissionPanel";

type Tab = "fraud" | "commission";

const tabs: { id: Tab; label: string; Icon: React.ElementType; color: string }[] = [
  { id: "fraud", label: "Fraud Detection", Icon: FiAlertTriangle, color: "text-red-600" },
  { id: "commission", label: "Commission & Payouts", Icon: FiPercent, color: "text-emerald-600" },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("fraud");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-4">
            <div className="p-3 bg-slate-800 dark:bg-slate-700 rounded-2xl shadow-lg">
              <FiShield className="w-7 h-7 text-white" />
            </div>
            Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2 ml-1">
            Platform operations, fraud monitoring, and payout management
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
          {tabs.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === id
                  ? `bg-white dark:bg-slate-700 ${color} shadow-sm`
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "fraud" && <FraudFlagsPanel />}
          {activeTab === "commission" && <CommissionPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
