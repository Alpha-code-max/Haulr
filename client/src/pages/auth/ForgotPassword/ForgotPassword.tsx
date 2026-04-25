import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { FiMail, FiArrowLeft, FiSend, FiTruck, FiLock, FiMapPin, FiKey } from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const trustSignals = [
  { icon: FiLock, label: "Escrow-protected payments" },
  { icon: FiMapPin, label: "Real-time GPS tracking" },
  { icon: FiKey, label: "OTP-verified deliveries" },
];

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "OTP has been sent to your email");
      timerRef.current = setTimeout(() => navigate("/reset-password", { state: { email } }), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <FiTruck className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Haulr</span>
        </div>

        <div className="relative space-y-10">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your account,<br />
              <span className="text-blue-400">always secure</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              We'll send a one-time password to your email so you can get back in safely.
            </p>
          </div>

          <div className="space-y-4">
            {trustSignals.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
            <p className="text-blue-300 text-sm font-semibold mb-1">How it works</p>
            <ol className="space-y-1.5 text-slate-400 text-sm list-decimal list-inside">
              <li>Enter your registered email</li>
              <li>Check inbox for your 6-digit OTP</li>
              <li>Set your new password securely</li>
            </ol>
          </div>
        </div>

        <div className="relative">
          <p className="text-slate-600 text-xs">© 2025 Haulr. Secure logistics platform.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">Haulr</span>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center mb-6">
              <FiMail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Forgot password?</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your email and we'll send you a reset OTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || !!message}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 px-4 py-4 rounded-2xl text-sm">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold mb-0.5">OTP sent!</p>
                  <p>{message} — redirecting you now...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email || !!message}
              className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                <>Send Reset OTP <FiSend className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
