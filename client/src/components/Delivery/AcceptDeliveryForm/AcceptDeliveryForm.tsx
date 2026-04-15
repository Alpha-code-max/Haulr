import React, { useState } from "react";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Truck, DollarSign, AlertCircle, X } from "lucide-react";

interface AcceptDeliveryFormProps {
  deliveryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AcceptDeliveryForm: React.FC<AcceptDeliveryFormProps> = ({
  deliveryId,
  onSuccess,
  onCancel,
}) => {
  const { acceptDelivery, isLoading, error } = useDeliveryStore();

  const [formData, setFormData] = useState({
    deliveryFee: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.deliveryFee.trim()) {
      setFormError("Please enter your delivery fee");
      return;
    }

    const fee = parseFloat(formData.deliveryFee);
    if (isNaN(fee) || fee <= 0) {
      setFormError("Delivery fee must be greater than 0");
      return;
    }

    try {
      await acceptDelivery(deliveryId, fee);
      onSuccess?.();
    } catch (err) {
      setFormError(error || "Failed to accept delivery. Please try again.");
    }
  };

  const currentFee = parseFloat(formData.deliveryFee) || 0;
  const platformCharge = 25;
  const totalCustomerPays = currentFee + platformCharge;

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-lg p-8">
        {/* Header */}
        <DialogHeader className="space-y-6 pb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-3xl flex items-center justify-center flex-shrink-0">
              <Truck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold">Accept Delivery</DialogTitle>
              <DialogDescription className="text-base">
                Set your preferred delivery fee to proceed
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          {/* Fee Input Section */}
          <div className="space-y-3">
            <Label htmlFor="deliveryFee" className="text-base font-medium flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              Your Delivery Fee (₦)
            </Label>

            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                ₦
              </div>
              <Input
                id="deliveryFee"
                type="number"
                name="deliveryFee"
                placeholder="0.00"
                value={formData.deliveryFee}
                onChange={handleChange}
                disabled={isLoading}
                step="0.01"
                min="0"
                className="pl-12 text-3xl font-semibold h-16 border-2 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Live Preview */}
            {currentFee > 0 && (
              <div className="bg-muted/50 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You will earn</span>
                  <span className="font-medium">₦{currentFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform charge</span>
                  <span className="font-medium text-amber-600">+ ₦{platformCharge}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Customer pays</span>
                  <span>₦{totalCustomerPays.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="flex gap-3 text-sm text-muted-foreground bg-muted/30 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p>
              An additional ₦25 platform service charge will be added to your fee. 
              The customer will see the total amount.
            </p>
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-2xl p-5">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{formError || error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-14 text-base font-medium"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !formData.deliveryFee}
              className="flex-1 h-14 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 transition-all"
            >
              {isLoading ? (
                "Accepting Delivery..."
              ) : (
                `Accept Delivery • ₦${totalCustomerPays.toFixed(0)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptDeliveryForm;