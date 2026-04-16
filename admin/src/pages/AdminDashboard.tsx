import React, { useEffect, useState } from "react";
import {
  FiUsers, FiTruck, FiActivity, FiDollarSign,
  FiSearch, FiBell, FiRefreshCw, FiPackage,
} from "react-icons/fi";
import { useAdminStore } from "../store/useAdminStore";
import type { AdminDelivery } from "../store/useAdminStore";
import AdminSidebar from "../components/AdminSidebar";
import StatCard from "../components/StatCard";
import RecentDeliveriesTable from "../components/RecentDeliveriesTable";
import NewRegistrationsFeed from "../components/NewRegistrationsFeed";
import DeliveryInspectModal from "../components/DeliveryInspectModal";
import AccountsSection from "./sections/AccountsSection";
import LogisticsSection from "./sections/LogisticsSection";
import AuditSection from "./sections/AuditSection";
import { Button } from "../components/ui/button";

type Section = "overview" | "accounts" | "logistics" | "audit";

const AdminDashboard: React.FC = () => {
  const { stats, activities, isLoading, fetchDashboardData, error } = useAdminStore();
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedDelivery, setInspectedDelivery] = useState<AdminDelivery | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading command center...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsSection searchQuery={searchQuery} />;
      case "logistics":
        return <LogisticsSection searchQuery={searchQuery} />;
      case "audit":
        return <AuditSection />;
      default:
        return (
          <div className="p-6 lg:p-8 space-y-8">
            {/* Page heading */}
            <div>
              <h1 className="text-2xl font-bold text-white">System Overview</h1>
              <p className="text-slate-500 text-sm mt-0.5">Real-time platform activity and metrics</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
                <FiActivity className="shrink-0" /> {error}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats?.users ?? 0}
                icon={<FiUsers size={18} />}
                accentColor="bg-blue-600"
                trend="+12%"
                trendUp
              />
              <StatCard
                label="Active Transits"
                value={stats?.activeDeliveries ?? 0}
                icon={<FiTruck size={18} />}
                accentColor="bg-amber-500"
                trend="Live"
              />
              <StatCard
                label="In Escrow"
                value={`₦${(stats?.totalEscrow ?? 0).toLocaleString()}`}
                icon={<FiDollarSign size={18} />}
                accentColor="bg-emerald-600"
                trend="Secured"
              />
              <StatCard
                label="Platform Volume"
                value={`₦${(stats?.totalBalance ?? 0).toLocaleString()}`}
                icon={<FiActivity size={18} />}
                accentColor="bg-violet-600"
                trend="Peak"
              />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Deliveries table */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <FiPackage className="text-blue-400" /> Recent Logistics
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500 hover:text-slate-300"
                    onClick={() => setActiveSection("logistics")}
                  >
                    View all
                  </Button>
                </div>
                <RecentDeliveriesTable
                  deliveries={activities?.recentDeliveries ?? []}
                  onInspect={(d) => setInspectedDelivery(d)}
                />
              </div>

              {/* Registrations feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <FiUsers className="text-blue-400" /> New Registrations
                  </h2>
                </div>
                <NewRegistrationsFeed
                  users={activities?.recentUsers ?? []}
                  onViewAll={() => setActiveSection("accounts")}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar activeSection={activeSection} onSectionChange={(s) => { setActiveSection(s as Section); setSearchQuery(""); }} />
      </div>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#0d1117]/80 backdrop-blur-sm border-b border-[#21262d] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-sm bg-[#161b22] border border-[#21262d] rounded-xl px-4 py-2">
            <FiSearch className="text-slate-500 w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder={
                activeSection === "accounts" ? "Search users by name or email…" :
                activeSection === "logistics" ? "Search deliveries by address or ID…" :
                "Search…"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-600 hover:text-slate-400 text-xs">✕</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:text-slate-300 transition-colors">
              <FiBell className="w-5 h-5" />
              {(activities?.recentUsers?.length ?? 0) > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchDashboardData()}
              className="text-slate-500 hover:text-blue-400"
              title="Refresh"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </header>

        {/* Section content */}
        {activeSection === "overview" ? (
          renderSection()
        ) : (
          <div className="p-6 lg:p-8">
            {renderSection()}
          </div>
        )}
      </main>

      {/* Global inspect modal (from overview table) */}
      {inspectedDelivery && (
        <DeliveryInspectModal
          delivery={inspectedDelivery}
          onClose={() => setInspectedDelivery(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
