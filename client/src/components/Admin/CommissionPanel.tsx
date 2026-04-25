import React, { useState, useEffect, useRef } from "react";
import { FiPercent, FiClock, FiSave, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import api from "../../services/api";

interface CommissionSettings {
  platformFeePercent: number;
  payoutDelayHours: number;
  minPayoutAmount: number;
  autoPayoutEnabled: boolean;
}

const defaultSettings: CommissionSettings = {
  platformFeePercent: 10,
  payoutDelayHours: 24,
  minPayoutAmount: 1000,
  autoPayoutEnabled: true,
};

const CommissionPanel: React.FC = () => {
  const [settings, setSettings] = useState<CommissionSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/commission-settings");
        setSettings(data);
      } catch {
        // use defaults if endpoint not available
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      await api.put("/admin/commission-settings", settings);
      setSaved(true);
      timerRef.current = setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const haulerReceives = 10000 * (1 - settings.platformFeePercent / 100);
  const platformEarns = 10000 * (settings.platformFeePercent / 100);

  const inputClass =
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center">
          <FiPercent className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-black text-slate-900 dark:text-slate-100">Commission & Payout Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Configure platform fees and hauler payout schedules</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Platform fee */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Platform Commission Rate</label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={settings.platformFeePercent}
                onChange={(e) => setSettings((s) => ({ ...s, platformFeePercent: parseFloat(e.target.value) || 0 }))}
                className={`${inputClass} w-24 text-center`}
              />
            </div>
            <span className="text-2xl font-black text-slate-300 dark:text-slate-600">%</span>
            <p className="text-sm text-slate-400">Deducted from each delivery fee before hauler payout</p>
          </div>

          {/* Fee example */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-1">Hauler Receives</p>
              <p className="font-mono font-black text-blue-700 dark:text-blue-300">₦{haulerReceives.toLocaleString()}</p>
              <p className="text-[10px] text-blue-400 mt-0.5">per ₦10,000 fee</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-1">Platform Earns</p>
              <p className="font-mono font-black text-emerald-700 dark:text-emerald-300">₦{platformEarns.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">per ₦10,000 fee</p>
            </div>
          </div>
        </div>

        {/* Payout delay */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Payout Clearing Delay</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <FiClock className="w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={0}
                max={168}
                value={settings.payoutDelayHours}
                onChange={(e) => setSettings((s) => ({ ...s, payoutDelayHours: parseInt(e.target.value) || 0 }))}
                className="w-16 font-mono font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
              />
              <span className="text-sm text-slate-400 font-medium">hours</span>
            </div>
            <p className="text-sm text-slate-400">Time before earnings are released from escrow</p>
          </div>
        </div>

        {/* Minimum payout */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Minimum Withdrawal Amount</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <FiDollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-bold text-sm">₦</span>
              <input
                type="number"
                min={0}
                step={100}
                value={settings.minPayoutAmount}
                onChange={(e) => setSettings((s) => ({ ...s, minPayoutAmount: parseInt(e.target.value) || 0 }))}
                className="w-24 font-mono font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
              />
            </div>
            <p className="text-sm text-slate-400">Minimum balance required to withdraw</p>
          </div>
        </div>

        {/* Auto payout toggle */}
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Automatic Payout Processing</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Auto-process hauler payouts after clearing delay
            </p>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, autoPayoutEnabled: !s.autoPayoutEnabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.autoPayoutEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.autoPayoutEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
            saved
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
          }`}
        >
          {saved ? (
            <><FiCheckCircle className="w-4 h-4" /> Saved Successfully</>
          ) : isLoading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><FiSave className="w-4 h-4" /> Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommissionPanel;
