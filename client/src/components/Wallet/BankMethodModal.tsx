import React from "react";
import { 
  FiCreditCard, 
  FiAlertCircle, 
  FiCheckCircle,
  FiInfo
} from "react-icons/fi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthStore } from "../../store/useAuthStore";

interface BankMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

const BankMethodModal: React.FC<BankMethodModalProps> = ({ isOpen, onClose, balance }) => {
  const { user, updateBankDetails } = useAuthStore();
  const [bankName, setBankName] = React.useState(user?.bankDetails?.bankName || "");
  const [accountNumber, setAccountNumber] = React.useState(user?.bankDetails?.accountNumber || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.bankDetails) {
      setBankName(user.bankDetails.bankName);
      setAccountNumber(user.bankDetails.accountNumber);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      await updateBankDetails({ bankName, accountNumber });
      setIsSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8 border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <FiCreditCard className="text-blue-600" />
            Payout Settings
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <FiCheckCircle size={40} />
            </div>
            <h3 className="text-xl font-semibold">Details Updated</h3>
            <p className="text-slate-500">Your bank information has been saved for future payouts.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {/* Wallet Info Block */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Internal Balance</span>
                <FiInfo className="text-slate-400 w-4 h-4 cursor-help" title="Funds cleared from completed deliveries" />
              </div>
              <p className="text-3xl font-bold text-slate-900">₦{balance.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-2">Available for withdrawal to your bank account.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="e.g. Zenith Bank, Kuda"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10-digit account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                <FiAlertCircle className="text-amber-600 mt-1 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Ensure account details are correct. Haulr is not liable for transfers made to incorrect bank accounts.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100 italic">
                   {error}
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 rounded-xl h-12"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-semibold shadow-lg shadow-blue-600/20"
                  disabled={isSaving || accountNumber.length < 10}
                >
                  {isSaving ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BankMethodModal;
