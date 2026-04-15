import React, { useEffect, useState } from "react";
import { 
  FiUsers, 
  FiTruck, 
  FiActivity, 
  FiDollarSign, 
  FiGrid, 
  FiPackage, 
  FiAward, 
  FiSearch,
  FiBell,
  FiArrowUpRight,
  FiFilter,
  FiImage,
  FiRefreshCw
} from "react-icons/fi";
import { useAdminStore } from "../../../store/useAdminStore";
import { Button } from "../../../components/ui/button";
import StatusBadge from "../../../components/Delivery/StatusBadge/StatusBadge";
import { Card } from "../../../components/ui/card";

const AdminDashboard: React.FC = () => {
  const { 
    stats, 
    activities, 
    isLoading, 
    fetchDashboardData, 
    error 
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col gap-10 hidden lg:flex">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <FiAward className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Haulr<span className="text-blue-600">HQ</span></h2>
        </div>

        <nav className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">Menu</p>
          <NavItem icon={<FiGrid />} label="Overview" active />
          <NavItem icon={<FiUsers />} label="Accounts" />
          <NavItem icon={<FiTruck />} label="Logistics" />
          <NavItem icon={<FiDollarSign />} label="Audit Log" />
        </nav>

        <div className="mt-auto">
           <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-3xl -mr-12 -mt-12 group-hover:bg-blue-600/40 transition-all"></div>
              <p className="text-xs font-bold opacity-60 mb-1">System Status</p>
              <p className="text-lg font-bold">Optimal</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">All systems operational</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">System Oversight</h1>
            <p className="text-slate-500 font-medium">Real-time platform activity and financial metrics</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-64 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors relative">
              <FiBell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Button 
                onClick={() => fetchDashboardData()} 
                variant="outline" 
                className="h-12 w-12 rounded-2xl p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold animate-in slide-in-from-top-4">
            <FiActivity /> {error}
          </div>
        )}

        {/* Stats Grid - Vibrant Multi-colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            label="Verified Users" 
            value={stats?.users || 0} 
            icon={<FiUsers size={24} />} 
            color="bg-indigo-600" 
            trend="+12%"
          />
          <StatCard 
            label="Active Transits" 
            value={stats?.activeDeliveries || 0} 
            icon={<FiTruck size={24} />} 
            color="bg-amber-500" 
            trend="+5"
          />
          <StatCard 
            label="In Escrow" 
            value={`₦${(stats?.totalEscrow || 0).toLocaleString()}`} 
            icon={<FiDollarSign size={24} />} 
            color="bg-emerald-600" 
            trend="Secure"
          />
          <StatCard 
            label="Platform Volume" 
            value={`₦${(stats?.totalBalance || 0).toLocaleString()}`} 
            icon={<FiActivity size={24} />} 
            color="bg-blue-600" 
            trend="Peak"
          />
        </div>

        {/* Content Tabs Simulation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Deliveries Table */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FiPackage className="text-blue-600" /> Recent Logistics Flow
              </h3>
              <Button variant="ghost" className="text-blue-600 font-bold text-xs uppercase tracking-widest">View All</Button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Shipment</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Visuals</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activities?.recentDeliveries.map((delivery) => (
                    <tr key={delivery._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-slate-400">#{delivery._id.slice(-6)}</span>
                          <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{delivery.pickupAddress}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {delivery.vendorId?.name?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{delivery.vendorId?.name || "System"}</p>
                            <p className="text-[10px] font-medium text-slate-400 lowercase">Vendor</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={delivery.status} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex -space-x-2">
                           {delivery.referenceImage && (
                             <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 overflow-hidden" title="Reference">
                               <img src={delivery.referenceImage} className="w-full h-full object-cover" />
                             </div>
                           )}
                           {delivery.podImage && (
                             <div className="w-8 h-8 rounded-lg border-2 border-white bg-blue-100 overflow-hidden" title="Proof of Delivery">
                               <img src={delivery.podImage} className="w-full h-full object-cover" />
                             </div>
                           )}
                           {!delivery.referenceImage && !delivery.podImage && (
                             <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300">
                               <FiImage size={12} />
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ml-auto">
                          Inspect <FiArrowUpRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Registrations Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FiUsers className="text-indigo-600" /> New Registrations
              </h3>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 space-y-4 shadow-sm">
              {activities?.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm ${
                      u.role === 'hauler' ? 'bg-amber-500 shadow-amber-100' : 
                      u.role === 'vendor' ? 'bg-indigo-500 shadow-indigo-100' : 
                      'bg-emerald-500 shadow-emerald-100'
                    }`}>
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">{u.role}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${u.kycStatus === 'verified' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 h-12 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold text-slate-500">
                Audit Management
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Sub-components */

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold ${
    active 
      ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
  }`}>
    <span className="text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color, trend }: { label: string, value: string | number, icon: React.ReactNode, color: string, trend: string }) => (
  <Card className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 -mr-16 -mt-16 rounded-full blur-3xl transition-all group-hover:scale-150`}></div>
    
    <div className="flex items-center justify-between mb-6">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
        trend.includes('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {trend}
      </span>
    </div>
    
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
    </div>
  </Card>
);

export default AdminDashboard;
