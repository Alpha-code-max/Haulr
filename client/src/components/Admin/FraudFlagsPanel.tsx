import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiAlertTriangle, FiShield, FiRefreshCw } from "react-icons/fi";
import api from "../../services/api";

interface FlaggedAccount {
  userId: string;
  name: string;
  email: string;
  role: string;
  otpFailures: number;
  cancellations: number;
  flagReason: string;
  severity: "high" | "medium" | "low";
  flaggedAt: string;
}

const severityStyle = {
  high: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

const FraudFlagsPanel: React.FC = () => {
  const [flags, setFlags] = useState<FlaggedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const fetchFlags = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/fraud-flags", { signal });
      setFlags(data);
    } catch (err: any) {
      if (err.name === "AbortError" || err.code === "ERR_CANCELED") return;
      if (err.response?.status === 404 || err.response?.status === 401) {
        setFlags([]);
      } else {
        setError("Could not load fraud flags. Ensure you have admin access.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 dark:bg-red-950/30 rounded-xl">
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Fraud Detection</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accounts with suspicious patterns
            </p>
          </div>
        </div>
        <button
          onClick={fetchFlags}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mx-8 mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-slate-400">Loading flags...</div>
      ) : flags.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl">
            <FiShield className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="font-semibold text-slate-500 dark:text-slate-400">
            No fraud flags detected
          </p>
          <p className="text-sm">All accounts appear to be operating normally</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  User
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  OTP Failures
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cancellations
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Severity
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {flags.map((flag) => (
                <tr
                  key={flag.userId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {flag.name}
                    </p>
                    <p className="text-xs text-slate-400">{flag.email}</p>
                  </td>
                  <td className="px-8 py-5 capitalize text-sm text-slate-600 dark:text-slate-400">
                    {flag.role}
                  </td>
                  <td className="px-8 py-5 font-mono font-bold text-red-500">
                    {flag.otpFailures}
                  </td>
                  <td className="px-8 py-5 font-mono font-bold text-amber-500">
                    {flag.cancellations}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        severityStyle[flag.severity]
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                    {flag.flagReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FraudFlagsPanel;
