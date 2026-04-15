import React from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import StatusBadge from "../StatusBadge/StatusBadge";
import type { DeliveryItem } from "../../../store/useDeliveryStore";
import "./DeliveryCard.css";

interface DeliveryCardProps {
  delivery: DeliveryItem;
  role: "vendor" | "hauler" | "customer";
  actions?: React.ReactNode;
}

function getName(field: any): string {
  if (typeof field === "object" && field?.name) return field.name;
  return "—";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery, role, actions }) => {
  return (
    <div className="delivery-card glass-panel">
      <div className="delivery-card-header">
        <StatusBadge status={delivery.status} />
        <span className="delivery-card-id">#{delivery._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="delivery-card-body">
        <div className="delivery-field">
          <span className="delivery-field-label"><FiMapPin size={11} /> Pickup</span>
          <span className="delivery-field-value">{delivery.pickupAddress}</span>
        </div>
        <div className="delivery-field">
          <span className="delivery-field-label"><FiNavigation size={11} /> Delivery</span>
          <span className="delivery-field-value">{delivery.deliveryAddress}</span>
        </div>

        {delivery.itemDescription && (
          <div className="delivery-field">
            <span className="delivery-field-label">Item</span>
            <span className="delivery-field-value">{delivery.itemDescription}</span>
          </div>
        )}

        <div className="delivery-field">
          <span className="delivery-field-label">Fee</span>
          <span className="delivery-fee">₦{delivery.deliveryFee?.toLocaleString() || 'N/A'}</span>
        </div>

        {role === "vendor" && (
          <div className="delivery-field">
            <span className="delivery-field-label">Customer</span>
            <span className="delivery-field-value">{getName(delivery.customerId)}</span>
          </div>
        )}

        {role === "vendor" && delivery.haulerId && (
          <div className="delivery-field">
            <span className="delivery-field-label">Hauler</span>
            <span className="delivery-field-value">{getName(delivery.haulerId)}</span>
          </div>
        )}

        {role === "hauler" && (
          <div className="delivery-field">
            <span className="delivery-field-label">Vendor</span>
            <span className="delivery-field-value">{getName(delivery.vendorId)}</span>
          </div>
        )}

        {role === "customer" && (
          <div className="delivery-field">
            <span className="delivery-field-label">Vendor</span>
            <span className="delivery-field-value">{getName(delivery.vendorId)}</span>
          </div>
        )}

        <div className="delivery-field">
          <span className="delivery-field-label">Created</span>
          <span className="delivery-field-value">{formatDate(delivery.createdAt)}</span>
        </div>
      </div>

      {actions && <div className="delivery-card-actions">{actions}</div>}
    </div>
  );
};

export default DeliveryCard;
