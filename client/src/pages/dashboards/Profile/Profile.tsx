import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../services/api";
import {
  FiUser, FiMail, FiPhone, FiCamera, FiRepeat, FiCheckCircle,
  FiAlertCircle, FiCalendar, FiShield, FiCopy, FiUsers,
  FiTruck, FiCreditCard, FiHash, FiLock, FiEdit3, FiSave,
  FiX, FiActivity, FiPackage, FiStar
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const kycColor = {
  verified: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  pending: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  unverified: "text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
  rejected: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; mono?: boolean }> = ({
  icon, label, value, mono
}) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${mono ? "font-mono" : ""}`}>
      {value}
    </span>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({
  icon, label, value, color
}) => (
  <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border ${color} gap-1`}>
    <div className="mb-1 opacity-70">{icon}</div>
    <p className="text-2xl font-black">{value}</p>
    <p className="text-xs font-semibold opacity-60 text-center">{label}</p>
  </div>
);

const Profile: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const [stats, setStats] = useState({ deliveries: 0, rating: 0, earnings: 0 });

  const successTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(successTimerRef.current);
      clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchExtras = async () => {
      try {
        const [refRes, statsRes] = await Promise.allSettled([
          api.get("/users/referrals", { signal: controller.signal }),
          api.get("/users/stats", { signal: controller.signal }),
        ]);
        if (refRes.status === "fulfilled") {
          setReferralCode(refRes.value.data.referralCode || null);
          setReferralCount(refRes.value.data.count || 0);
        }
        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data);
        }
      } catch { /* non-critical */ }
    };
    fetchExtras();
    return () => controller.abort();
  }, []);

  if (!user) return null;

  const kycStatus = (user.kycStatus || "unverified") as keyof typeof kycColor;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setError("Image must be under 1MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setAvatar(reader.result as string); setError(null); };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null); setError(null);
    try {
      await updateProfile({ name, avatar });
      setSuccess("Profile updated!");
      setIsEditing(false);
      successTimerRef.current = setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleCancel = () => {
    setName(user.name); setAvatar(user.avatar || "");
    setIsEditing(false); setError(null);
  };

  const handleSwitchRole = async () => {
    setSuccess(null); setError(null);
    if (user.kycStatus !== "verified") {
      setError("Verification required to switch roles. Complete onboarding first."); return;
    }
    const nextRole = user.role === "vendor" ? "hauler" : "vendor";
    if (!window.confirm(`Switch to ${nextRole.toUpperCase()}? This may affect active deliveries.`)) return;
    try {
      await updateProfile({ role: nextRole });
      setSuccess(`Switched to ${nextRole} role!`);
      successTimerRef.current = setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopySuccess(true);
      copyTimerRef.current = setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const maskedNin = user.nin ? `****${user.nin.slice(-4)}` : "Not provided";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-[2rem] bg-white/20 backdrop-blur border-4 border-white/30 shadow-2xl overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-white/70" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-110"
              title="Change avatar"
            >
              <FiCamera size={15} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          {/* Name + Role + KYC */}
          <div className="text-center sm:text-left pb-1 flex-1">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
              {user.role} Account
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{user.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${kycColor[kycStatus]} capitalize`}>
                {kycStatus === "verified" ? <FiCheckCircle size={11} /> : <FiAlertCircle size={11} />}
                KYC {kycStatus}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20">
                <FiMail size={11} /> {user.email}
              </span>
            </div>
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-bold rounded-xl transition-colors"
          >
            {isEditing ? <><FiX size={15} /> Cancel</> : <><FiEdit3 size={15} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Feedback banners */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
            <FiCheckCircle /> {success}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<FiPackage size={18} />}
            label="Deliveries"
            value={stats.deliveries > 0 ? String(stats.deliveries) : "—"}
            color="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900"
          />
          <StatCard
            icon={<FiStar size={18} />}
            label="Avg Rating"
            value={stats.rating > 0 ? stats.rating.toFixed(1) : "—"}
            color="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900"
          />
          <StatCard
            icon={<FiActivity size={18} />}
            label={user.role === "hauler" ? "Earned (₦)" : "Spent (₦)"}
            value={stats.earnings > 0 ? `${(stats.earnings / 1000).toFixed(1)}k` : "—"}
            color="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FiShield size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Identity</h3>
              </div>
              <div className="px-6">
                <InfoRow icon={<FiHash size={14} />} label="Account ID" value={`#${user._id.slice(-8).toUpperCase()}`} mono />
                <InfoRow icon={<FiCalendar size={14} />} label="Member since" value={new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" })} />
                <InfoRow icon={<FiLock size={14} />} label="NIN" value={maskedNin} mono />
                <InfoRow
                  icon={<FiShield size={14} />}
                  label="KYC Status"
                  value={kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                />
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
              <div className="flex items-center gap-2 mb-4">
                <FiUsers size={14} className="opacity-70" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Referral Program</p>
              </div>

              {referralCode ? (
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-base font-bold tracking-widest bg-white/20 rounded-xl px-3 py-2 flex-1 text-center">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                    title="Copy code"
                  >
                    {copySuccess ? <FiCheckCircle size={16} /> : <FiCopy size={16} />}
                  </button>
                </div>
              ) : (
                <p className="text-white/60 text-sm mb-4">No referral code generated yet</p>
              )}

              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black">{referralCount}</p>
                <p className="text-xs opacity-60 mt-0.5">{referralCount === 1 ? "user referred" : "users referred"}</p>
              </div>
              <p className="text-xs text-white/50 mt-3 text-center">Share your code to earn rewards</p>
            </div>
          </div>

          {/* Right column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FiUser size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Information</h3>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm opacity-60 cursor-not-allowed text-slate-900 dark:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="text"
                        value={user.phone}
                        disabled
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm opacity-60 cursor-not-allowed text-slate-900 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-1">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm flex items-center gap-2"
                    >
                      <FiSave size={14} /> {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-11 px-5 rounded-xl text-sm font-bold border-slate-200 dark:border-slate-700"
                    >
                      Discard
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Vehicle Info (haulers only) */}
            {user.role === "hauler" && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <FiTruck size={14} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Vehicle Details</h3>
                </div>
                <div className="px-6">
                  <InfoRow icon={<FiTruck size={14} />} label="Vehicle Type" value={user.vehicleType || "Not set"} />
                  <InfoRow icon={<FiHash size={14} />} label="Plate Number" value={user.vehiclePlate || "Not set"} mono />
                  <InfoRow
                    icon={<FiCheckCircle size={14} />}
                    label="Vehicle Photos"
                    value={user.vehicleImages?.length ? `${user.vehicleImages.length} uploaded` : "None"}
                  />
                </div>
              </div>
            )}

            {/* Bank Details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FiCreditCard size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Bank Details</h3>
              </div>
              <div className="px-6">
                {user.bankDetails ? (
                  <>
                    <InfoRow icon={<FiCreditCard size={14} />} label="Bank" value={user.bankDetails.bankName} />
                    <InfoRow icon={<FiHash size={14} />} label="Account Number" value={user.bankDetails.accountNumber} mono />
                    {user.bankDetails.accountName && (
                      <InfoRow icon={<FiUser size={14} />} label="Account Name" value={user.bankDetails.accountName} />
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-400 dark:text-slate-500">No bank details added yet</p>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                      Add bank details to enable withdrawals
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Role Switch */}
            {(user.role === "vendor" || user.role === "hauler") && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative group">
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-100 dark:text-slate-800 transition-colors group-hover:text-slate-200 dark:group-hover:text-slate-700 pointer-events-none">
                  <FiRepeat size={80} />
                </div>
                <div className="relative z-10 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Switch Role</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                    Toggle between Vendor and Hauler. KYC verification required.
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      onClick={handleSwitchRole}
                      variant="outline"
                      disabled={isLoading}
                      className="h-11 px-6 rounded-xl font-bold text-sm border-slate-200 dark:border-slate-600 dark:text-slate-100 flex items-center gap-2"
                    >
                      <FiRepeat size={14} />
                      Switch to {user.role === "vendor" ? "Hauler" : "Vendor"}
                    </Button>
                    {user.kycStatus !== "verified" && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                        <FiAlertCircle size={12} /> KYC verification required first
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
