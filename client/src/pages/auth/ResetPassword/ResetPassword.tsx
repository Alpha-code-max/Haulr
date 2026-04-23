import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { FiMail, FiLock, FiCheckCircle, FiArrowRight, FiTruck, FiArrowLeft, FiKey } from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const { resetPassword, isLoading } = useAuthStore();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword });
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP or reset failed");
      setStep(1);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center max-w-sm">
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Password updated!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25"
          >
            Go to Login <FiArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-slate-400 text-xs mt-4">Redirecting automatically...</p>
        </div>
      </div>
    );
  }

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
              Reset your<br />
              <span className="text-blue-400">password securely</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Use the OTP we sent to your email to verify your identity and set a new password.
            </p>
          </div>

          {/* Steps visual */}
          <div className="space-y-4">
            {[
              { n: "1", label: "Enter your OTP code", active: step === 1 },
              { n: "2", label: "Set your new password", active: step === 2 },
              { n: "3", label: "Sign in with new credentials", active: false },
            ].map(({ n, label, active }) => (
              <div key={n} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                active
                  ? "bg-blue-600/15 border border-blue-500/30"
                  : "opacity-50"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                  active ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400"
                }`}>
                  {n}
                </div>
                <span className={`text-sm font-medium ${active ? "text-slate-200" : "text-slate-500"}`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <FiKey className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-slate-400 text-sm">OTP codes expire in 10 minutes. Check your spam if you don't see it.</p>
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

          {/* Step indicator (mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${step === 1 ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"}`}>
              {step === 1 ? "1" : <FiCheckCircle className="w-4 h-4" />}
            </div>
            <div className={`h-0.5 flex-1 rounded ${step === 2 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`} />
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
              2
            </div>
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center mb-6">
              <FiLock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {step === 1 ? "Verify OTP" : "New password"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {step === 1
                ? "Enter the 6-digit code sent to your email"
                : "Create a new secure password for your account"}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleVerifyOTP : handleResetPassword} className="space-y-5">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full text-center text-4xl font-mono tracking-[0.5em] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-6 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white transition-all"
                    required
                  />
                  <p className="text-xs text-slate-400 text-center">Check your inbox — codes expire in 10 minutes</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a new password"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className={`${inputClass} ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-400 focus:border-red-400"
                          : confirmPassword && confirmPassword === newPassword
                          ? "border-emerald-400 focus:border-emerald-400"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500">Passwords don't match</p>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || (step === 1 && otp.length !== 6)}
              className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : step === 1 ? (
                <>Continue <FiArrowRight className="w-4 h-4" /></>
              ) : (
                <>Reset Password <FiArrowRight className="w-4 h-4" /></>
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

export default ResetPassword;
