import React from "react";
import { FiPackage, FiTruck, FiMapPin } from "react-icons/fi";
import { useDeliveryStore } from "../../../store/useDeliveryStore";
import type { DeliveryItem } from "../../../store/useDeliveryStore";

interface HaulerDeliveryActionsProps {
  delivery: DeliveryItem;
  onAction: () => void;
}

const HaulerDeliveryActions: React.FC<HaulerDeliveryActionsProps> = ({
  delivery,
  onAction,
}) => {
  const { markPickedUp, markInTransit, isLoading } = useDeliveryStore();

  const handlePickup = async () => {
    try {
      await markPickedUp(delivery._id);
      onAction();
    } catch (error) {
      // Error handled in store
    }
  };

  const handleInTransit = async () => {
    try {
      await markInTransit(delivery._id);
      onAction();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 ">Delivery Actions</h3>
        <span className="text-sm text-gray-500 ">ID: {delivery._id.slice(-8)}</span>
      </div>

      <div className="space-y-2">
        {delivery.status === 'paid' && (
          <button
            onClick={handlePickup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPackage className="w-4 h-4" />
            {isLoading ? "Picking up..." : "Mark as Picked Up"}
          </button>
        )}

        {delivery.status === 'picked_up' && (
          <button
            onClick={handleInTransit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <FiTruck className="w-4 h-4" />
            {isLoading ? "Updating..." : "Mark In Transit"}
          </button>
        )}

        {delivery.status === 'in_transit' && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-cyan-600 ">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm font-medium">In Transit - Use OTP Inbox to Complete</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HaulerDeliveryActions;