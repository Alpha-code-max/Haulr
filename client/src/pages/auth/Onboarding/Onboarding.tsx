import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../services/api";
import {
  FiUserCheck, FiMapPin, FiTruck, FiHash, FiArrowRight,
  FiAlertCircle, FiShield, FiCheckCircle, FiLock,
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";

/* ─── African geometric SVG patterns ─────────────────────────────────────── */

const KenteOverlay: React.FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Kente-cloth diamond tile — gold + terracotta palette */}
      <pattern id="kente-tile" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
        {/* outer diamond */}
        <polygon points="32,3 61,32 32,61 3,32" fill="none" stroke="#D4A017" strokeWidth="1.2" strokeOpacity="0.45" />
        {/* inner filled diamond */}
        <polygon points="32,16 48,32 32,48 16,32" fill="#D4A017" fillOpacity="0.08" />
        {/* centre jewel */}
        <circle cx="32" cy="32" r="3" fill="#D4A017" fillOpacity="0.35" />
        {/* corner accent squares — terracotta */}
        <rect x="0"  y="0"  width="7" height="7" fill="#C65D3A" fillOpacity="0.28" />
        <rect x="57" y="0"  width="7" height="7" fill="#C65D3A" fillOpacity="0.28" />
        <rect x="0"  y="57" width="7" height="7" fill="#C65D3A" fillOpacity="0.28" />
        <rect x="57" y="57" width="7" height="7" fill="#C65D3A" fillOpacity="0.28" />
        {/* horizontal band lines */}
        <line x1="0" y1="32" x2="64" y2="32" stroke="#D4A017" strokeWidth="0.4" strokeOpacity="0.18" />
        <line x1="32" y1="0" x2="32" y2="64" stroke="#D4A017" strokeWidth="0.4" strokeOpacity="0.18" />
      </pattern>

      {/* Kente strip bands — alternating terracotta / gold bars */}
      <pattern id="kente-strips" x="0" y="0" width="64" height="20" patternUnits="userSpaceOnUse">
        <rect width="64" height="4"  y="0"  fill="#C65D3A" fillOpacity="0.12" />
        <rect width="64" height="2"  y="4"  fill="#D4A017"  fillOpacity="0.1"  />
        <rect width="64" height="4"  y="6"  fill="#2E6B3E"  fillOpacity="0.09" />
        <rect width="64" height="2"  y="10" fill="#D4A017"  fillOpacity="0.1"  />
        <rect width="64" height="4"  y="12" fill="#C65D3A" fillOpacity="0.08" />
        <rect width="64" height="2"  y="16" fill="#2E6B3E"  fillOpacity="0.07" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kente-strips)" />
    <rect width="100%" height="100%" fill="url(#kente-tile)" />
  </svg>
);

const AdinkraBackground: React.FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Adinkra-style concentric diamond + dot symbol */}
      <pattern id="adinkra-bg" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
        <polygon points="26,4 48,26 26,48 4,26"  fill="none" stroke="#1e40af" strokeWidth="0.7" strokeOpacity="0.07" />
        <polygon points="26,13 39,26 26,39 13,26" fill="none" stroke="#1e40af" strokeWidth="0.7" strokeOpacity="0.07" />
        <circle cx="26" cy="26" r="2.5" fill="none" stroke="#1e40af" strokeWidth="0.7" strokeOpacity="0.08" />
        {/* small corner marks */}
        <circle cx="0"  cy="0"  r="1.5" fill="#1e40af" fillOpacity="0.05" />
        <circle cx="52" cy="0"  r="1.5" fill="#1e40af" fillOpacity="0.05" />
        <circle cx="0"  cy="52" r="1.5" fill="#1e40af" fillOpacity="0.05" />
        <circle cx="52" cy="52" r="1.5" fill="#1e40af" fillOpacity="0.05" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#adinkra-bg)" />
  </svg>
);

/* ─── Steps sidebar content ───────────────────────────────────────────────── */

const steps = [
  { icon: FiHash,      label: "Identity check",    sub: "Your NIN is verified against NIMC records" },
  { icon: FiTruck,     label: "Vehicle registration", sub: "Haulers add vehicle details for matching" },
  { icon: FiCheckCircle, label: "Start earning",   sub: "Accept jobs and get paid after OTP confirm" },
];

const trustPoints = [
  { icon: FiShield,    text: "NIN data encrypted at rest" },
  { icon: FiLock,      text: "Never shared with third parties" },
  { icon: FiUserCheck, text: "Takes less than 2 minutes" },
];

/* ─── Main component ──────────────────────────────────────────────────────── */

const Onboarding: React.FC = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.kycStatus === "verified") {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({ nin: "", vehicleType: "", vehiclePlate: "" });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  const isHauler = user.role === "hauler";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const submitData = isHauler ? formData : { nin: formData.nin };
      const endpoint = isHauler ? "/users/onboard/hauler" : "/users/onboard/vendor";
      await api.post(endpoint, submitData);

      const userRes = await api.get("/users/me");
      const token = localStorage.getItem("haulr_token");
      if (token) login(token, userRes.data);
      navigate(`/${user.role}`);
    } catch (err: any) {
      const status = err.response?.status;
      const data   = err.response?.data;

      if (!err.response) {
        setError("Unable to reach the server. Check your internet connection and try again.");
        setLoading(false);
        return;
      }

      if (data?.errors && typeof data.errors === "object") {
        setFieldErrors(data.errors);
        setError("Please fix the highlighted fields and try again.");
        setLoading(false);
        return;
      }

      if (status === 409) {
        const msg: string = data?.message ?? "";
        if (msg.toLowerCase().includes("nin")) {
          setError("This NIN is already linked to another Haulr account. If this is you, try logging in instead.");
        } else if (msg.toLowerCase().includes("plate")) {
          setError("This vehicle plate is already registered. Contact support if you believe this is a mistake.");
        } else {
          setError("These details are already registered on another account.");
        }
      } else if (status === 400) {
        setError(data?.message || "Some details you entered are invalid. Please review and try again.");
      } else if (status === 422) {
        setError(data?.message || "Validation failed. Make sure all fields are filled in correctly.");
      } else if (status === 429) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else if (status && status >= 500) {
        setError("Something went wrong on our end. Please try again in a few moments.");
      } else {
        setError(data?.message || "Onboarding failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all";
  const inputErr =
    "border-red-400 focus:border-red-500 focus:ring-red-500/10";

  const canSubmit =
    formData.nin.length === 11 &&
    (!isHauler || (formData.vehicleType !== "" && formData.vehiclePlate.trim() !== ""));

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative overflow-hidden">

      {/* Page-wide Adinkra background (very subtle) */}
      <AdinkraBackground />

      {/* ── Left brand panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-10 relative overflow-hidden">

        {/* Kente pattern overlay */}
        <KenteOverlay />

        {/* Soft radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <FiTruck className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Haulr</span>
        </div>

        {/* Main copy */}
        <div className="relative space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
              <FiUserCheck size={11} /> KYC Verification
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              One quick step<br />
              <span className="text-amber-400">to unlock Haulr</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              {isHauler
                ? "Register your vehicle and verify your identity. Once approved, you can start picking up jobs and earning."
                : "Verify your NIN and you're ready to post deliveries, track packages, and pay securely through escrow."}
            </p>
          </div>

          {/* Step list */}
          <div className="space-y-4">
            {steps.map(({ icon: Icon, label, sub }, i) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-blue-400">{i + 1}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-white text-sm font-bold">{label}</p>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            {trustPoints.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-slate-600 text-xs">© 2025 Haulr. Secure logistics platform.</p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950 overflow-y-auto relative">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">Haulr</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/25">
              <FiUserCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Complete your profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {isHauler
                ? "Verify your identity and add your vehicle to start accepting jobs."
                : "Verify your NIN to start posting deliveries."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NIN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                National Identification Number (NIN)
              </label>
              <div className="relative">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="nin"
                  inputMode="numeric"
                  placeholder="11-digit NIN"
                  value={formData.nin}
                  onChange={(e) =>
                    handleChange({
                      ...e,
                      target: { ...e.target, name: "nin", value: e.target.value.replace(/\D/g, "").slice(0, 11) },
                    })
                  }
                  maxLength={11}
                  className={`${inputBase} ${fieldErrors.nin ? inputErr : ""}`}
                  required
                />
              </div>
              {fieldErrors.nin
                ? <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.nin}</p>
                : <p className="text-xs text-slate-400">Your 11-digit government-issued NIN</p>
              }
            </div>

            {/* Hauler-only fields */}
            {isHauler && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <FiTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none cursor-pointer ${fieldErrors.vehicleType ? inputErr : ""}`}
                      required
                    >
                      <option value="">Select vehicle type</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Tricycle">Tricycle (Keke)</option>
                    </select>
                  </div>
                  {fieldErrors.vehicleType && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.vehicleType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vehicle Plate Number
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      name="vehiclePlate"
                      placeholder="ABC-1234-XY"
                      value={formData.vehiclePlate}
                      onChange={(e) =>
                        handleChange({
                          ...e,
                          target: { ...e.target, name: "vehiclePlate", value: e.target.value.toUpperCase() },
                        })
                      }
                      className={`${inputBase} uppercase tracking-widest font-mono ${fieldErrors.vehiclePlate ? inputErr : ""}`}
                      required
                    />
                  </div>
                  {fieldErrors.vehiclePlate
                    ? <p className="text-xs text-red-500 flex items-center gap-1"><FiAlertCircle className="w-3 h-3" />{fieldErrors.vehiclePlate}</p>
                    : <p className="text-xs text-slate-400">As it appears on your registration document</p>
                  }
                </div>
              </>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-4 py-3.5 rounded-2xl text-sm">
                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <>Complete Onboarding <FiArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8 leading-relaxed">
            Your identity data is encrypted and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
