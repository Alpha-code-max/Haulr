import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { Card } from "./ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accentColor, trend, trendUp }) => (
  <Card className="p-6 relative overflow-hidden group hover:border-slate-600 transition-colors">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${accentColor}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${accentColor}`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          trendUp
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-slate-700 text-slate-400"
        }`}>
          {trendUp && <FiTrendingUp className="w-3 h-3" />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
  </Card>
);

export default StatCard;
