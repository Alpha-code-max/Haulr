import React from "react";
import WalletCard from "../../../components/Wallet/WalletCard/WalletCard";
import { FiDollarSign, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const VendorWallet: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 section-container">
      <div className="py-6">
        <Link
          to="/vendor"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <div className="max-w-3xl">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <FiDollarSign className="w-8 h-8" />
              </div>
              My Wallet
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              Manage your funds, track escrow payments, and fund your wallet securely.
            </p>
          </div>
          <div className="py-4">
            <WalletCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorWallet;
