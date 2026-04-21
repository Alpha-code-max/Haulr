import React, { useState, useEffect } from "react";
import { FiPercent, FiClock, FiSave, FiCheckCircle } from "react-icons/fi";
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
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
      <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl">
          <FiPercent className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">
            Commission & Payout Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure platform fees and hauler payout schedules
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Platform Fee */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Platform Commission Rate
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={settings.platformFeePercent}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  platformFeePercent: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-28 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <span className="text-2xl font-black text-slate-300 dark:text-slate-600">%</span>
            <p className="text-sm text-slate-400">
              Deducted from each delivery fee before hauler payout
            </p>
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-xs text-blue-600 dark:text-blue-400">
            Example: ₦10,000 delivery fee → Hauler receives ₦
            {(10000 * (1 - settings.platformFeePercent / 100)).toLocaleString()}, Platform earns ₦
            {(10000 * (settings.platformFeePercent / 100)).toLocaleString()}
          </div>
        </div>

        {/* Payout Delay */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Payout Clearing Delay
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <FiClock className="text-slate-400 w-4 h-4" />
              <input
                type="number"
                min={0}
                max={168}
                value={settings.payoutDelayHours}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    payoutDelayHours: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-16 font-mono font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
              />
              <span className="text-slate-400 text-sm">hours</span>
            </div>
            <p className="text-sm text-slate-400">
              Time before delivery earnings are released from escrow
            </p>
          </div>
        </div>

        {/* Minimum Payout */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Minimum Withdrawal Amount
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <span className="text-slate-400 font-bold text-sm">₦</span>
              <input
                type="number"
                min={0}
                step={100}
                value={settings.minPayoutAmount}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    minPayoutAmount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-24 font-mono font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
              />
            </div>
            <p className="text-sm text-slate-400">Minimum balance required to withdraw</p>
          </div>
        </div>

        {/* Auto Payout Toggle */}
        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              Automatic Payout Processing
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically process hauler payouts after clearing delay
            </p>
          </div>
          <button
            onClick={() =>
              setSettings((s) => ({ ...s, autoPayoutEnabled: !s.autoPayoutEnabled }))
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.autoPayoutEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.autoPayoutEnabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } disabled:opacity-50`}
        >
          {saved ? (
            <>
              <FiCheckCircle size={16} /> Saved Successfully
            </>
          ) : (
            <>
              <FiSave size={16} /> {isLoading ? "Saving..." : "Save Settings"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommissionPanel;
