import React, { useState } from "react";
import {
  FiShield, FiPercent, FiAlertTriangle, FiUsers,
  FiDollarSign, FiActivity,
} from "react-icons/fi";
import FraudFlagsPanel from "../../../components/Admin/FraudFlagsPanel";
import CommissionPanel from "../../../components/Admin/CommissionPanel";

type Tab = "fraud" | "commission";

const tabs: { id: Tab; label: string; Icon: React.ElementType; activeColor: string }[] = [
  { id: "fraud", label: "Fraud Detection", Icon: FiAlertTriangle, activeColor: "text-red-600" },
  { id: "commission", label: "Commission & Payouts", Icon: FiPercent, activeColor: "text-emerald-600" },
];

const overviewCards = [
  { label: "Active Users", value: "—", icon: FiUsers, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { label: "Total Deliveries", value: "—", icon: FiActivity, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { label: "Platform Revenue", value: "—", icon: FiDollarSign, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { label: "Open Flags", value: "—", icon: FiAlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("fraud");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-4">
                <div className="p-3 bg-slate-800 dark:bg-slate-700 rounded-2xl shadow-lg">
                  <FiShield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                Admin Panel
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base ml-1">
                Platform operations, fraud monitoring, and payout management
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 dark:bg-slate-700 rounded-2xl self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">System Operational</span>
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit min-w-max">
            {tabs.map(({ id, label, Icon, activeColor }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === id
                    ? `bg-white dark:bg-slate-700 ${activeColor} shadow-sm`
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
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
