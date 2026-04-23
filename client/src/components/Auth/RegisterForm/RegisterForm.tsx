import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../services/api";
import {
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff,
  FiArrowRight, FiTag, FiTruck, FiPackage, FiCheckCircle,
  FiUserCheck, FiDollarSign, FiAlertCircle,
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const trustSignals = [
  { icon: FiCheckCircle, label: "OTP-verified every delivery" },
  { icon: FiUserCheck, label: "KYC-backed hauler network" },
  { icon: FiDollarSign, label: "Instant escrow payouts" },
];

const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"vendor" | "hauler">("vendor");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: "Very Weak", color: "text-red-500" };
    if (score === 2) return { score, label: "Weak", color: "text-orange-500" };
    if (score === 3) return { score, label: "Medium", color: "text-yellow-500" };
    if (score === 4) return { score, label: "Strong", color: "text-emerald-500" };
    return { score, label: "Very Strong", color: "text-emerald-600" };
  }, [password]);

  const strengthBarColor =
    passwordStrength.score <= 1 ? "bg-red-500" :
    passwordStrength.score === 2 ? "bg-orange-500" :
    passwordStrength.score === 3 ? "bg-yellow-500" :
    passwordStrength.score === 4 ? "bg-emerald-500" : "bg-emerald-600";

  const strengthBarWidth =
    passwordStrength.score === 0 ? "w-0" :
    passwordStrength.score === 1 ? "w-1/5" :
    passwordStrength.score === 2 ? "w-2/5" :
    passwordStrength.score === 3 ? "w-3/5" :
    passwordStrength.score === 4 ? "w-4/5" : "w-full";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);


    if (passwordStrength.score < 3) {
      setError("Your password is too weak. Use at least 8 characters with uppercase, lowercase, and a number.");
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, string> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      };
      if (referralCode.trim()) {
        payload.referralCode = referralCode.trim().toUpperCase();
      }

      const response = await api.post("/users/register", payload);
      const token = response.data.token;
      localStorage.setItem("haulr_token", token);
      const userRes = await api.get("/users/me");
      login(token, userRes.data);
      navigate(
        userRes.data.role === "vendor" || userRes.data.role === "hauler"
          ? "/onboarding"
          : `/${userRes.data.role}`
      );
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (!err.response) {
        setError("Unable to reach the server. Check your internet connection and try again.");
        setLoading(false);
        return;
      }

      // Field-level validation errors from the backend (e.g. { errors: { email: "...", phone: "..." } })
      if (data?.errors && typeof data.errors === "object") {
        setFieldErrors(data.errors);
        setError("Please fix the highlighted fields and try again.");
        setLoading(false);
        return;
      }

      // Map status codes to user-friendly messages
      if (status === 409) {
        const msg: string = data?.message ?? "";
        if (msg.toLowerCase().includes("email")) {
          setError("An account with this email already exists. Try logging in, or use a different email.");
        } else if (msg.toLowerCase().includes("phone")) {
          setError("This phone number is already registered. Try logging in, or use a different number.");
        } else {
          setError("An account with these details already exists. Try logging in instead.");
        }
      } else if (status === 400) {
        setError(data?.message || "Some of the information you entered is invalid. Please review and try again.");
      } else if (status === 422) {
        setError(data?.message || "Validation failed. Make sure all fields are filled in correctly.");
      } else if (status === 429) {
        setError("Too many registration attempts. Please wait a moment and try again.");
      } else if (status && status >= 500) {
        setError("Something went wrong on our end. Please try again in a few moments.");
      } else {
        setError(data?.message || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 relative overflow-hidden">
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
              Join the future of<br />
              <span className="text-blue-400">smart logistics</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Whether you're shipping goods or hauling packages — Haulr has your back with secure, transparent deliveries.
            </p>
          </div>

          {/* Role preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <div className="w-9 h-9 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
                <FiPackage className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Vendor</p>
                <p className="text-slate-400 text-xs">Post deliveries, pay on confirmation</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/60 border border-slate-700/40 rounded-2xl">
              <div className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                <FiTruck className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Hauler</p>
                <p className="text-slate-400 text-xs">Pick up jobs, earn after OTP</p>
              </div>
            </div>
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
        </div>

        <div className="relative">
          <p className="text-slate-600 text-xs">© 2025 Haulr. Secure logistics platform.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">Haulr</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join Haulr and start shipping smarter</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
                  className={`${inputClass} ${fieldErrors.name ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  required
                />
              </div>
              {fieldErrors.name && <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                  className={`${inputClass} ${fieldErrors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  required
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  placeholder="08012345678"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: "" })); }}
                  className={`${inputClass} ${fieldErrors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  required
                />
              </div>
              {fieldErrors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthBarColor} ${strengthBarWidth}`} />
                  </div>
                  <p className={`text-xs font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">I am joining as</label>
              <div className="grid grid-cols-2 gap-3">
                {(["vendor", "hauler"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                      role === r
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    {r === "vendor" ? <FiPackage className="w-4 h-4 shrink-0" /> : <FiTruck className="w-4 h-4 shrink-0" />}
                    {r === "vendor" ? "Vendor" : "Hauler"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {role === "vendor" ? "Post deliveries and pay after confirmation." : "Browse jobs and earn after OTP verification."}
              </p>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Referral Code <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="HAULR-XXXXXXXX"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className={`${inputClass} tracking-wider font-mono`}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3.5 rounded-2xl text-sm">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || passwordStrength.score < 3}
              className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Account <FiArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
