import { Link, Navigate } from "react-router-dom";
import {
  FiTruck,
  FiShield,
  FiMessageSquare,
  FiZap,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";

const features = [
  {
    icon: FiShield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Escrow Protection",
    desc: "Funds are held securely until delivery is verified via OTP. Eliminate payment disputes completely.",
  },
  {
    icon: FiTruck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Verified Haulers",
    desc: "Every driver undergoes rigorous KYC including NIN verification and vehicle documentation.",
  },
  {
    icon: FiMessageSquare,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Real-time Chat",
    desc: "Direct communication channel between vendors and haulers for seamless coordination.",
  },
  {
    icon: FiZap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Automated Workflows",
    desc: "From booking to delivery confirmation — smart OTP verification keeps everything moving.",
  },
];

const steps = [
  { n: "01", label: "Create a delivery", sub: "Set pickup & drop-off address and agree on terms" },
  { n: "02", label: "Assign a hauler", sub: "Verified haulers accept jobs from the marketplace" },
  { n: "03", label: "Track in real-time", sub: "Monitor status changes from picked-up to in-transit" },
  { n: "04", label: "OTP confirmation", sub: "Recipient confirms delivery — escrow releases instantly" },
];

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Admin users belong in the separate admin app — let them see the landing page
  if (isAuthenticated && user && user.role !== "admin") {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-widest text-blue-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Next-Gen Logistics Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 max-w-3xl">
            The Escrow-Backed{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Haulage Marketplace
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl mb-10">
            Secure, transparent delivery management for vendors and haulers.
            Every naira protected by smart escrow until proof of delivery is confirmed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-900/40 text-sm"
            >
              Get Started Free <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 h-12 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3">
            {["Escrow-secured funds", "KYC-verified haulers", "OTP delivery proof", "24h settlement"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <FiCheck className="text-emerald-400" size={14} />
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="mb-14">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">
            Why Haulr?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            Built for trust. Built for scale.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">
            A complete logistics stack that protects every party from booking through delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all bg-white dark:bg-slate-900"
            >
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={color} size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Four steps from booking to payout
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ n, label, sub }) => (
              <div key={n} className="flex flex-col gap-4">
                <span className="text-4xl font-black font-mono text-slate-200 dark:text-slate-700">{n}</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">{label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 sm:p-16 text-white text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to move your goods?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
              Join businesses streamlining their logistics with escrow-protected deliveries.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 h-13 py-3.5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors shadow-xl text-sm"
            >
              Join Haulr for Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            Haulr
          </div>
          <p>© {new Date().getFullYear()} Haulr. Escrow-backed logistics.</p>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
