import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { FiMail, FiLock, FiCheckCircle, FiArrowRight } from "react-icons/fi";
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
      setStep(1); // Go back to OTP step on failure
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Password Reset Successful</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">You can now login with your new password.</p>
          <Link 
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-3xl flex items-center justify-center mb-6">
            <FiLock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            {step === 1 ? "Verify OTP" : "Set New Password"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3">
            {step === 1 
              ? "Enter the 6-digit code sent to your email" 
              : "Create a new secure password"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8">
          <form onSubmit={step === 1 ? handleVerifyOTP : handleResetPassword} className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full text-center text-4xl font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-6 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || (step === 1 && otp.length !== 6)}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
            >
              {isLoading 
                ? "Processing..." 
                : step === 1 
                  ? "Continue" 
                  : "Reset Password"}
              <FiArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <FiArrowRight className="rotate-180" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;