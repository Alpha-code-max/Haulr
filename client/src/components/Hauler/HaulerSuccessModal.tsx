import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

const HaulerSuccessModal: React.FC<Props> = ({ open, onClose }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-6 z-[80]">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
        <FiCheckCircle size={48} />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Delivery Verified!</h2>
        <p className="text-slate-500">
          The payout has been released and is in the 24-hour settlement period for final clearance.
        </p>
      </div>
      <Button
        onClick={onClose}
        className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-lg"
      >
        Complete Terminal
      </Button>
    </DialogContent>
  </Dialog>
);

export default HaulerSuccessModal;
