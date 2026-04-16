import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../services/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiRepeat,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiShield,
  FiCopy,
  FiUsers
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const Profile: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await api.get("/users/referrals");
        setReferralCode(res.data.referralCode || null);
        setReferralCount(res.data.count || 0);
      } catch {
        // non-critical — silently ignore
      }
    };
    fetchReferrals();
  }, []);

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image size too large. Please select an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await updateProfile({ name, avatar });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSwitchRole = async () => {
    setSuccess(null);
    setError(null);
    if (user.kycStatus !== "verified") {
      setError(`Verification required to switch roles. Please complete your ${user.role} onboarding first.`);
      return;
    }
    const nextRole = user.role === "vendor" ? "hauler" : "vendor";
    if (!window.confirm(`Are you sure you want to switch your role to ${nextRole.toUpperCase()}?`)) return;
    try {
      await updateProfile({ role: nextRole });
      setSuccess(`Successfully switched to ${nextRole} role!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Basic Info Card */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden mb-4">
                  {avatar ? (
                    <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-transform group-hover:scale-110"
                >
                  <FiCamera size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">{user.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-6">{user.role}</p>

              <div className="flex flex-col gap-3">
                <div className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${
                  user.kycStatus === "verified"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                }`}>
                  {user.kycStatus === "verified" ? <FiCheckCircle /> : <FiAlertCircle />}
                  KYC {user.kycStatus || "Unverified"}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><FiCalendar /> Joined</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><FiShield /> Role Link</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium capitalize">{user.role} Account</span>
                </div>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-6 shadow-sm text-white">
              <div className="flex items-center gap-2 mb-4">
                <FiUsers size={16} className="opacity-80" />
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Your Referral</h3>
              </div>

              {referralCode ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-lg font-bold tracking-widest bg-white/20 rounded-xl px-3 py-2 flex-1 text-center">
                      {referralCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      title="Copy code"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-xs text-white/70 text-center mb-3">Copied to clipboard!</p>
                  )}
                </>
              ) : (
                <p className="text-white/60 text-sm mb-4">No referral code yet</p>
              )}

              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{referralCount}</p>
                <p className="text-xs opacity-70 mt-1">
                  {referralCount === 1 ? "person referred" : "people referred"}
                </p>
              </div>
            </div>
          </div>

          {/* Form & Actions Section */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Profile Settings</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
                    <div className="relative opacity-60">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-not-allowed text-slate-900 dark:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone Number</label>
                    <div className="relative opacity-60">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={user.phone}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-not-allowed text-slate-900 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

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

                <Button
                  type="submit"
                  className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>

            {/* Role Switch Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative group">
              <div className="absolute right-0 top-0 p-8 text-slate-100 dark:text-slate-800 transition-colors group-hover:text-slate-200 dark:group-hover:text-slate-700">
                <FiRepeat size={120} />
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Switch Identity</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">
                  Switch your account type between Vendor and Hauler. You must have verified KYC status to perform this action.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleSwitchRole}
                    variant="outline"
                    className="h-14 px-8 rounded-2xl border-slate-200 dark:border-slate-600 font-semibold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-100"
                    disabled={isLoading}
                  >
                    <FiRepeat /> Switch to {user.role === "vendor" ? "Hauler" : "Vendor"}
                  </Button>
                  {user.kycStatus !== "verified" && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <FiAlertCircle /> Verification Required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
