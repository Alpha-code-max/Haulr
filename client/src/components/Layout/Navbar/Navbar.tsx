import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTheme } from "../../../context/ThemeContext";
import {
  FiLogOut,
  FiTruck,
  FiUser,
  FiDollarSign,
  FiHelpCircle,
  FiSun,
  FiMoon
} from "react-icons/fi";
import HelpModal from "../../Help/HelpModal";

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
              <FiTruck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-2xl tracking-tighter text-slate-900 dark:text-slate-100">
              Haulr
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user && (
              <>
                {/* Help & Support */}
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
                  title="Logistics Guide & Support"
                >
                  <FiHelpCircle size={19} />
                  <span className="hidden sm:inline">Help</span>
                </button>

                {/* Wallet Button (for Vendors) */}
                {user.role === 'vendor' && (
                  <Link
                    to="/vendor/wallet"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
                  >
                    <FiDollarSign size={19} />
                    <span className="hidden sm:inline">Wallet</span>
                  </Link>
                )}

                {/* User Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={18} className="text-slate-600 dark:text-slate-300" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => logout()}
                  className="ml-2 px-5 py-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 hover:text-red-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <FiLogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        defaultTab={user?.role === "vendor" ? "vendor" : "hauler"}
      />
    </>
  );
};

export default Navbar;
