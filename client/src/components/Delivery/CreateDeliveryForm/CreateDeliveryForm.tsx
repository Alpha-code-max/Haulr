import React, { useState, useEffect } from "react";
import { FiMapPin, FiPackage, FiTruck, FiUser, FiX, FiImage, FiCheck } from "react-icons/fi";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
interface CreateDeliveryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}
const CreateDeliveryForm: React.FC<CreateDeliveryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuthStore();
  const { createDelivery, isLoading, error } = useDeliveryStore();
  const [formData, setFormData] = useState({
    customerId: user?._id || "",
    pickupAddress: "",
    deliveryAddress: "",
    itemDescription: "",
    itemWeight: "",
    referenceImage: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  useEffect(() => {
    if (user?._id) {
      setFormData((prev) => ({ ...prev, customerId: user._id }));
    }
  }, [user?._id]);
  useEffect(() => {
    if (error) {
      setFormError(
        typeof error === "string" ? error : "Failed to create delivery",
      );
    }
  }, [error]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.pickupAddress.trim() || !formData.deliveryAddress.trim()) {
      setFormError("Pickup and Delivery addresses are required");
      return;
    }
    const payload = {
      customerId: formData.customerId,
      pickupAddress: formData.pickupAddress.trim(),
      deliveryAddress: formData.deliveryAddress.trim(),
      itemDescription: formData.itemDescription.trim() || undefined,
      itemWeight: formData.itemWeight
        ? parseFloat(formData.itemWeight)
        : undefined,
      referenceImage: formData.referenceImage || undefined,
    };
    try {
      await createDelivery(payload);
      setFormData({
        customerId: user?._id || "",
        pickupAddress: "",
        deliveryAddress: "",
        itemDescription: "",
        itemWeight: "",
        referenceImage: "",
      });
      onSuccess?.();
    } catch (err) {
      setFormError("Failed to create delivery. Please try again.");
    }
  };
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      {" "}
      <DialogContent className="sm:max-w-lg bg-white border border-slate-200 rounded-3xl p-0 overflow-hidden z-[100]">
        {" "}
        {/* Fixed Header */}{" "}
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center">
                {" "}
                <FiTruck className="w-6 h-6 text-blue-600 " />{" "}
              </div>{" "}
              <div>
                {" "}
                <DialogTitle className="text-2xl font-semibold">
                  New Delivery
                </DialogTitle>{" "}
                <p className="text-sm text-slate-500 ">
                  Create a new shipment
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
              className="text-slate-500 hover:text-slate-700"
            >
              {" "}
              <FiX className="w-5 h-5" />{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Scrollable Form Area */}{" "}
        <div className="flex-1 overflow-y-auto p-8 max-h-[75vh] custom-scroll">
          {" "}
          <form onSubmit={handleSubmit} className="space-y-8">
            {" "}
            {/* Vendor ID */}{" "}
            <div className="space-y-2">
              {" "}
              <label className="text-xs uppercase tracking-widest font-medium text-slate-500 flex items-center gap-2">
                {" "}
                <FiUser className="w-4 h-4" /> VENDOR ID{" "}
              </label>{" "}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm text-slate-600 break-all">
                {" "}
                {formData.customerId || "Loading..."}{" "}
              </div>{" "}
            </div>{" "}
            {/* Pickup Address */}{" "}
            <div className="space-y-2">
              {" "}
              <label
                htmlFor="pickupAddress"
                className="text-xs uppercase tracking-widest font-medium text-slate-500 flex items-center gap-2"
              >
                {" "}
                <FiMapPin className="w-4 h-4 text-blue-600" /> PICKUP ADDRESS{" "}
                <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <textarea
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Enter full pickup address"
                value={formData.pickupAddress}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full min-h-[88px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-y"
              />{" "}
            </div>{" "}
            {/* Delivery Address */}{" "}
            <div className="space-y-2">
              {" "}
              <label
                htmlFor="deliveryAddress"
                className="text-xs uppercase tracking-widest font-medium text-slate-500 flex items-center gap-2"
              >
                {" "}
                <FiMapPin className="w-4 h-4 text-emerald-600" /> DELIVERY
                ADDRESS <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                placeholder="Enter full delivery address"
                value={formData.deliveryAddress}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full min-h-[88px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-y"
              />{" "}
            </div>{" "}
            {/* Item Description */}{" "}
            <div className="space-y-2">
              {" "}
              <label
                htmlFor="itemDescription"
                className="text-xs uppercase tracking-widest font-medium text-slate-500 flex items-center gap-2"
              >
                {" "}
                <FiPackage className="w-4 h-4" /> ITEM DESCRIPTION{" "}
              </label>{" "}
              <textarea
                id="itemDescription"
                name="itemDescription"
                placeholder="What are you shipping? (optional)"
                value={formData.itemDescription}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full min-h-[72px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-y"
              />{" "}
            </div>{" "}
            {/* Item Weight */}{" "}
            <div className="space-y-2">
              {" "}
              <label
                htmlFor="itemWeight"
                className="text-xs uppercase tracking-widest font-medium text-slate-500"
              >
                {" "}
                ITEM WEIGHT (KG){" "}
              </label>{" "}
              <Input
                id="itemWeight"
                type="number"
                name="itemWeight"
                placeholder="e.g. 3.5"
                value={formData.itemWeight}
                onChange={handleChange}
                disabled={isLoading}
                step="0.1"
                min="0"
                className="rounded-2xl"
              />{" "}
            </div>{" "}
            {/* Reference Image Upload */}{" "}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest font-medium text-slate-500 flex items-center gap-2">
                <FiImage size={14} /> ITEM PHOTO (REFERENCE)
              </label>
              <div
                className={`relative group h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  formData.referenceImage
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400"
                }`}
                onClick={() => document.getElementById("ref-upload")?.click()}
              >
                <input
                  id="ref-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Mock upload
                      setFormData((prev) => ({
                        ...prev,
                        referenceImage: `https://haulr.sh/ref/${file.name}`,
                      }));
                    }
                  }}
                />
                {formData.referenceImage ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <FiCheck className="text-emerald-500 mb-1" size={24} />
                    <p className="text-xs font-bold text-emerald-700">
                      Photo Added: {formData.referenceImage.split("/").pop()}
                    </p>
                    <p className="text-[9px] text-emerald-600 opacity-60">
                      Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <FiImage size={24} className="mb-1" />
                    <p className="text-xs font-bold">Upload item photo</p>
                    <p className="text-[9px] uppercase tracking-tighter opacity-50">
                      Haulers use this to verify the shipment
                    </p>
                  </div>
                )}
              </div>
            </div>{" "}
            {/* Error Message */}{" "}
            {(formError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {" "}
                {formError || error}{" "}
              </div>
            )}{" "}
            {/* Action Buttons */}{" "}
            <div className="flex gap-4 pt-6">
              {" "}
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 h-12 rounded-2xl"
              >
                {" "}
                Cancel{" "}
              </Button>{" "}
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold"
              >
                {" "}
                {isLoading ? "Creating..." : "Create Delivery"}{" "}
              </Button>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
};
export default CreateDeliveryForm;
