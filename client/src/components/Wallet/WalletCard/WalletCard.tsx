import React, { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiPlusCircle,
  FiClock,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiDollarSign
} from "react-icons/fi";

import { useWalletStore } from "../../../store/useWalletStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

const WalletCard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    wallet,
    transactions,
    isLoading,
    error,
    fetchWallet,
    fetchTransactions,
    initializePayment,
    verifyPayment,
    deposit,
    clearError,
  } = useWalletStore();

  const [fundAmount, setFundAmount] = useState("");
  const [showFundInput, setShowFundInput] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [fundSuccess, setFundSuccess] = useState("");

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  const handlePaystackFund = async () => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount < 100) return;

    try {
      const paystackData = await initializePayment(amount);
      
      if (!paystackData?.reference) throw new Error("Invalid payment data");

      const PaystackPop = (window as any).PaystackPop;

      if (PaystackPop) {
        const handler = PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: user?.email,
          amount: amount * 100,
          currency: "NGN",
          ref: paystackData.reference,
          callback: async (response: { reference: string }) => {
            await verifyPayment(response.reference);
            setFundSuccess(`₦${amount.toLocaleString()} successfully added!`);
            setShowFundInput(false);
            setFundAmount("");
            setTimeout(() => setFundSuccess(""), 4000);
          },
          onClose: () => console.log("Payment closed"),
        });
        handler.openIframe();
      } else if (paystackData.authorization_url) {
        window.location.href = paystackData.authorization_url;
      }
    } catch (err) {
      // Demo fallback
      if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes("placeholder")) {
        await deposit(amount);
        setFundSuccess(`₦${amount.toLocaleString()} added (demo mode)`);
        setShowFundInput(false);
        setFundAmount("");
        setTimeout(() => setFundSuccess(""), 4000);
      }
    }
  };

  const quickAmounts = [1000, 2500, 5000, 10000];

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
      case "release":
        return <FiArrowUpCircle className="text-emerald-500 w-6 h-6" />;
      case "escrow":
        return <FiCreditCard className="text-amber-500 w-6 h-6" />;
      case "withdraw":
        return <FiArrowDownCircle className="text-red-500 w-6 h-6" />;
      default:
        return <FiClock className="text-slate-400 w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Balance Header */}
      <div className="p-10 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">AVAILABLE BALANCE</p>
            <div className="mt-3 text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
              ₦{wallet?.balance?.toLocaleString() ?? "0.00"}
            </div>
          </div>

          <div className="px-5 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-medium flex items-center gap-2">
            <FiDollarSign className="w-5 h-5" />
            Active
          </div>
        </div>

        {fundSuccess && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-400 text-sm">
            {fundSuccess}
          </div>
        )}

        {error && (
          <div 
            className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm cursor-pointer"
            onClick={clearError}
          >
            {error} <span className="text-xs">(tap to dismiss)</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!showFundInput ? (
        <div className="p-8 flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setShowFundInput(true)}
            className="flex-1 h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold text-base shadow-lg shadow-blue-500/20"
          >
            <FiPlusCircle className="mr-3 w-6 h-6" />
            Fund Wallet
          </Button>

          <Button 
            variant="outline"
            onClick={() => setShowTransactions(!showTransactions)}
            className="flex-1 h-16 rounded-2xl font-semibold text-base"
          >
            <FiClock className="mr-3 w-6 h-6" />
            Transaction History
          </Button>
        </div>
      ) : (
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-4">Quick Amounts</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFundAmount(amt.toString())}
                  className="py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium transition-all"
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Custom Amount</label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Minimum ₦100"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="flex-1 rounded-2xl h-14 text-lg"
                min="100"
              />
              <Button 
                onClick={handlePaystackFund}
                disabled={!fundAmount || parseFloat(fundAmount) < 100 || isLoading}
                className="h-14 px-12 rounded-2xl font-semibold"
              >
                {isLoading ? "Processing..." : "Fund Now"}
              </Button>
            </div>
          </div>

          <button
            onClick={() => {
              setShowFundInput(false);
              setFundAmount("");
            }}
            className="w-full text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Transactions */}
      {showTransactions && (
        <div className="px-8 pb-8 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-6">Recent Activity</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No transactions yet</div>
          ) : (
            <div className="space-y-6">
              {transactions.slice(0, 10).map((tx) => (
                <div key={tx._id} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium capitalize text-slate-900 dark:text-white">{tx.type}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold text-xl ${tx.type === 'deposit' || tx.type === 'release' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'deposit' || tx.type === 'release' ? '+' : '-'}₦{tx.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletCard;