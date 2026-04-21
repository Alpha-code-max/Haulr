import React, { useMemo, useState } from "react";
import { FiTrendingUp, FiDollarSign, FiPackage, FiCalendar } from "react-icons/fi";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface DeliveryItem {
  _id: string;
  status: string;
  deliveryFee?: number;
  createdAt: string;
}

interface Props {
  transactions: Transaction[];
  deliveries: DeliveryItem[];
}

type Range = "7d" | "30d" | "90d";

const ranges: { label: string; value: Range; days: number }[] = [
  { label: "7 days", value: "7d", days: 7 },
  { label: "30 days", value: "30d", days: 30 },
  { label: "90 days", value: "90d", days: 90 },
];

const EarningsAnalytics: React.FC<Props> = ({ transactions, deliveries }) => {
  const [range, setRange] = useState<Range>("30d");

  const { days } = ranges.find((r) => r.value === range)!;

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }, [days]);

  const releaseTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.type === "release" &&
          t.status === "cleared" &&
          new Date(t.createdAt) >= cutoff
      ),
    [transactions, cutoff]
  );

  const completedDeliveries = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === "delivered" && new Date(d.createdAt) >= cutoff
      ),
    [deliveries, cutoff]
  );

  const totalEarned = releaseTransactions.reduce((s, t) => s + t.amount, 0);
  const avgPerTrip =
    completedDeliveries.length > 0
      ? totalEarned / completedDeliveries.length
      : 0;

  // Build daily buckets for chart
  const buckets = useMemo(() => {
    const map: Record<string, number> = {};
    const count = range === "7d" ? 7 : range === "30d" ? 30 : 13;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      if (range === "90d") {
        d.setDate(d.getDate() - i * 7);
        const key = `${d.getMonth() + 1}/${d.getDate()}`;
        map[key] = 0;
      } else {
        d.setDate(d.getDate() - i);
        const key = `${d.getMonth() + 1}/${d.getDate()}`;
        map[key] = 0;
      }
    }

    releaseTransactions.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (key in map) map[key] = (map[key] || 0) + t.amount;
    });

    return Object.entries(map);
  }, [releaseTransactions, range]);

  const maxVal = Math.max(...buckets.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl">
              <FiDollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Earned</p>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-600">
            ₦{totalEarned.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Last {days} days</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-xl">
              <FiPackage className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trips Done</p>
          </div>
          <p className="text-3xl font-black font-mono text-blue-600">
            {completedDeliveries.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Completed deliveries</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/40 rounded-xl">
              <FiTrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Per Trip</p>
          </div>
          <p className="text-3xl font-black font-mono text-purple-600">
            ₦{Math.round(avgPerTrip).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Average payout</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-slate-400 w-4 h-4" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Earnings Over Time
            </h3>
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  range === r.value
                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {totalEarned === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            No earnings data in this period
          </div>
        ) : (
          <div className="relative">
            {/* Y-axis labels */}
            <div className="flex">
              <div className="w-14 flex flex-col justify-between text-right pr-2 shrink-0">
                {[maxVal, maxVal * 0.5, 0].map((v) => (
                  <span key={v} className="text-[9px] text-slate-400 font-mono">
                    ₦{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v)}
                  </span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-1 h-48 flex items-end gap-1">
                {buckets.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div
                      className="w-full relative"
                      style={{ height: "180px" }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-600 rounded-t-md transition-all duration-500 group-hover:bg-blue-400"
                        style={{
                          height: `${(value / maxVal) * 100}%`,
                          minHeight: value > 0 ? "4px" : "0",
                        }}
                        title={`₦${value.toLocaleString()}`}
                      />
                    </div>
                    {buckets.length <= 14 && (
                      <span className="text-[8px] text-slate-400 rotate-45 origin-left whitespace-nowrap">
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsAnalytics;
