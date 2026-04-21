import { Link, Navigate } from "react-router-dom";
import {
  FiTruck, FiArrowRight, FiCheck, FiShield, FiMapPin,
  FiKey, FiMessageCircle, FiDollarSign, FiUserCheck,
  FiLock, FiPackage, FiStar, FiCreditCard, FiAlertOctagon,
  FiNavigation, FiCpu, FiBarChart2, FiUsers, FiBox,
  FiCheckCircle, FiClock, FiZap,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import HaulrAdvantages from "../../components/Landing/HaulrAdvantages";

// ── DATA ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "100%", label: "Fraud-proof deliveries", sub: "Every naira escrow-protected" },
  { value: "3-step", label: "Hauler verification", sub: "NIN · Vehicle · Face ID" },
  { value: "6-digit", label: "OTP proof of delivery", sub: "Unique per delivery" },
  { value: "15s", label: "Live location refresh", sub: "Real-time GPS tracking" },
];

const features = [
  {
    icon: FiLock,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-100 dark:border-blue-900",
    title: "Double-Locked Escrow",
    desc: "Vendor funds are frozen the moment payment is made and only released when the recipient enters a unique 6-digit OTP — no hauler can touch earnings without confirmed delivery.",
  },
  {
    icon: FiUserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900",
    title: "3-Layer Hauler KYC",
    desc: "Every hauler submits a government-issued NIN, current vehicle registration, and vehicle photographs. Unverified accounts cannot accept or complete deliveries.",
  },
  {
    icon: FiNavigation,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-100 dark:border-violet-900",
    title: "Live GPS Tracking",
    desc: "Hauler coordinates are broadcast every 15 seconds while in transit. Vendors see a live map pin — not a status update, an actual location — so there's never any guessing.",
  },
  {
    icon: FiKey,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-100 dark:border-amber-900",
    title: "OTP Delivery Proof",
    desc: "A cryptographically unique 6-digit code is generated per delivery and sent only to the recipient. Entering the correct code is the sole trigger for escrow release — zero workarounds.",
  },
  {
    icon: FiMessageCircle,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-100 dark:border-rose-900",
    title: "Per-Delivery Chat",
    desc: "Every delivery has a dedicated chat channel between vendor and hauler. No personal numbers exchanged, no lost WhatsApp threads — every message is tied to the job.",
  },
  {
    icon: FiCpu,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-100 dark:border-indigo-900",
    title: "Automated Status Engine",
    desc: "From marketplace listing → acceptance → pickup → transit → OTP confirmation, every stage transition is logged and timestamped. Full audit trail, zero manual tracking.",
  },
  {
    icon: FiBarChart2,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-100 dark:border-teal-900",
    title: "Hauler Earnings Analytics",
    desc: "Haulers see a full breakdown of cleared, escrowed, and settling earnings with visual charts across 7, 30, and 90-day windows — so income planning is always data-driven.",
  },
  {
    icon: FiCreditCard,
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-100 dark:border-cyan-900",
    title: "Instant Bank Settlements",
    desc: "Cleared hauler earnings can be withdrawn directly to any Nigerian bank account. No wallet locks, no minimum hold periods beyond the standard 24-hour clearing window.",
  },
];

const steps = [
  {
    n: "01",
    icon: FiBox,
    color: "bg-blue-600",
    label: "Post a Delivery",
    sub: "Vendor enters pickup address, drop-off address, item description, and weight. The job is immediately listed on the hauler marketplace.",
  },
  {
    n: "02",
    icon: FiUserCheck,
    color: "bg-violet-600",
    label: "Hauler Bids & Pays",
    sub: "A KYC-verified hauler reviews the route and submits their delivery fee. Vendor approves the quote and pays from their Haulr wallet — funds enter escrow instantly.",
  },
  {
    n: "03",
    icon: FiNavigation,
    color: "bg-amber-600",
    label: "Live Transit Tracking",
    sub: "Hauler picks up the package and starts transit. Their GPS location broadcasts every 15 seconds. Vendor watches live on a map pin — not a vague status badge.",
  },
  {
    n: "04",
    icon: FiKey,
    color: "bg-emerald-600",
    label: "OTP Confirms Delivery",
    sub: "Recipient enters their unique 6-digit code with the hauler present. Correct code instantly releases escrow funds to the hauler — delivery is cryptographically proven.",
  },
];

const vendorBenefits = [
  { icon: FiLock, text: "Funds locked in escrow until delivery is proven" },
  { icon: FiAlertOctagon, text: "OTP lockout after 3 failed hauler attempts" },
  { icon: FiRefreshCw, text: "Regenerate expired OTPs from your dashboard" },
  { icon: FiNavigation, text: "Watch your package move on a live map" },
  { icon: FiMessageCircle, text: "Chat directly with your hauler per delivery" },
  { icon: FiStar, text: "Rate haulers to surface the best in the network" },
];

const haulerBenefits = [
  { icon: FiZap, text: "Browse and accept jobs from the open marketplace" },
  { icon: FiDollarSign, text: "Set your own delivery fee — you control income" },
  { icon: FiBarChart2, text: "Track cleared, escrow, and settling earnings" },
  { icon: FiCreditCard, text: "Withdraw directly to any Nigerian bank account" },
  { icon: FiShield, text: "Escrow protects your earnings — vendors can't withhold" },
  { icon: FiUsers, text: "Build a rating that attracts higher-value jobs" },
];

// ── HELPER COMPONENTS ────────────────────────────────────────────────────────

const FiRefreshCw = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ?? 16}
    height={size ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ── PAGE ─────────────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user && user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-28 sm:pt-32 sm:pb-40">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-widest text-blue-300 mb-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Nigeria's Escrow-Backed Haulage Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.04] tracking-tight mb-7 max-w-4xl">
            Move Goods.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Get Paid.
            </span>
            <br />
            Zero Disputes.
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
            Haulr connects vendors with verified haulers through a smart escrow system that
            holds funds until a unique OTP confirms the package reached the right hands.
            No cash risks. No payment arguments. No missing drivers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 h-14 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-colors shadow-lg shadow-blue-900/50 text-base"
            >
              Start for Free <FiArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 h-14 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 transition-colors text-base"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: FiLock, text: "Escrow-secured funds" },
              { icon: FiUserCheck, text: "KYC-verified haulers" },
              { icon: FiKey, text: "OTP proof of delivery" },
              { icon: FiNavigation, text: "Live GPS tracking" },
              { icon: FiCreditCard, text: "Instant bank payouts" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/12 rounded-full text-sm text-slate-300 font-medium">
                <Icon size={13} className="text-emerald-400" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{value}</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-0.5">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
            Platform Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-5 leading-tight">
            Everything a modern logistics operation needs — and nothing it doesn't.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Haulr was built from the ground up to close the trust gap between senders and haulers
            in the Nigerian market. Every feature exists to protect a real transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, color, bg, border, title, desc }) => (
            <div
              key={title}
              className={`group p-6 rounded-2xl border ${border} ${bg} hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mb-5 shadow-sm`}>
                <Icon className={color} size={20} />
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 mb-2 leading-snug">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="mb-16 max-w-xl">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
              The Delivery Lifecycle
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              Four steps. Fully automated. Completely fraud-proof.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Every delivery on Haulr follows the same secure workflow — no shortcuts, no cash,
              no ambiguity about who got paid and when.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 dark:from-blue-900 dark:via-violet-900 dark:to-emerald-900 z-0" />

            {steps.map(({ n, icon: Icon, color, label, sub }) => (
              <div key={n} className="relative z-10 flex flex-col items-start gap-5">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon size={26} className="text-white" />
                </div>
                <div>
                  <span className="text-5xl font-black font-mono text-slate-100 dark:text-slate-800 leading-none block mb-3">{n}</span>
                  <p className="font-black text-slate-900 dark:text-slate-100 text-base mb-2">{label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR VENDORS / FOR HAULERS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Who is Haulr for?</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
            Built for two sides of every delivery
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Whether you're sending goods or moving them, Haulr gives you the tools, protection,
            and transparency to operate with full confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vendor side */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 rounded-xl">
                  <FiBox size={18} className="text-white" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-200">For Vendors</p>
              </div>
              <h3 className="text-2xl font-black mb-2">Ship with confidence</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Post a delivery in under 2 minutes. Your money stays locked in escrow until
                a unique code confirms the right person received the package.
              </p>
              <ul className="space-y-3 mb-8">
                {vendorBenefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-white" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-black rounded-xl text-sm hover:bg-blue-50 transition-colors"
              >
                Register as Vendor <FiArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Hauler side */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 rounded-xl">
                  <FiTruck size={18} className="text-white" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-200">For Haulers</p>
              </div>
              <h3 className="text-2xl font-black mb-2">Earn on your schedule</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-8">
                Browse open deliveries, set your own fee, and get paid the moment your OTP
                is verified. Your earnings are always protected — vendors can never withhold.
              </p>
              <ul className="space-y-3 mb-8">
                {haulerBenefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-emerald-100">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-white" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-black rounded-xl text-sm hover:bg-emerald-50 transition-colors"
              >
                Register as Hauler <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HAULR VS TRADITIONAL ─────────────────────────────────────────── */}
      <HaulrAdvantages />

      {/* ── SECURITY SPOTLIGHT ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Security Architecture</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              The Haulr Shield — why nobody can steal your money
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Traditional logistics relies on trust. Haulr relies on cryptography. Every payment
              is mechanically locked until a one-time code — sent only to the recipient — is
              verified in real time. There is no override, no manual release, no workaround.
            </p>
            <div className="space-y-4">
              {[
                { icon: FiLock, title: "Escrow vault", desc: "Funds move from vendor wallet → escrow at payment. Neither party can access them until OTP is confirmed." },
                { icon: FiKey, title: "One-time OTP", desc: "Each delivery generates a unique 6-digit code. Expires after use. 3 wrong entries triggers a security lock." },
                { icon: FiCheckCircle, title: "Instant release", desc: "Correct OTP → escrow releases to hauler's cleared balance in milliseconds. No manual approval needed." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual lockbox diagram */}
          <div className="flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-900 animate-spin" style={{ animationDuration: "20s" }} />
              {/* Middle ring */}
              <div className="absolute inset-8 rounded-full border border-blue-300 dark:border-blue-800" />
              {/* Inner ring */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-300 dark:shadow-blue-900">
                <FiLock size={40} className="text-white" />
              </div>
              {/* Orbiting labels */}
              {[
                { label: "Vendor funds", angle: 0 },
                { label: "Escrow lock", angle: 120 },
                { label: "OTP release", angle: 240 },
              ].map(({ label, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 42 * Math.sin(rad);
                const y = 50 - 42 * Math.cos(rad);
                return (
                  <div
                    key={label}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black text-slate-700 dark:text-slate-300 shadow-sm whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl px-10 py-16 sm:py-20 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-xs font-bold uppercase tracking-widest text-blue-300 mb-6">
                <FiClock size={11} /> Takes under 2 minutes to get started
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-5 leading-tight">
                Your next delivery should be
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  impossible to dispute.
                </span>
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join vendors and haulers across Nigeria who've replaced cash-and-call logistics
                with a secure, transparent, automated platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-colors shadow-xl shadow-blue-900/40 text-base"
                >
                  Create Free Account <FiArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-2xl transition-colors text-base"
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 justify-center">
                {["No credit card required", "Free to register", "Instant KYC verification"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <FiCheck size={13} className="text-emerald-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                  <FiTruck className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">Haulr</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Nigeria's escrow-backed haulage marketplace. Every delivery is secured, tracked,
                and cryptographically confirmed.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Register as Vendor", to: "/register" },
                  { label: "Register as Hauler", to: "/register" },
                  { label: "Sign In", to: "/login" },
                  { label: "Forgot Password", to: "/forgot-password" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Security Promises</p>
              <ul className="space-y-2.5">
                {[
                  "Double-locked escrow on every payment",
                  "3-layer KYC for all haulers",
                  "OTP delivery confirmation",
                  "24h earnings clearing window",
                  "Full audit trail per delivery",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <FiShield size={13} className="text-blue-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} Haulr Technologies. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <FiShield size={12} className="text-emerald-500" />
              Escrow-backed · KYC-verified · OTP-secured
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
