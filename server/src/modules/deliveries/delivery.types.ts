import type { Types } from "mongoose";

export type DeliveryStatus =
  | "pending"
  | "accepted"
  | "priced"
  | "paid"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface GeoLocation {
  lat: number;
  lng: number;
  updatedAt?: Date;
}

export interface CreateDeliveryDTO {
  customerId: Types.ObjectId | string;
  pickupAddress: string;
  deliveryAddress: string;
  itemDescription?: string;
  itemWeight?: number;
}

export interface Delivery {
  vendorId: Types.ObjectId;
  customerId: Types.ObjectId;
  haulerId?: Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  status: DeliveryStatus;
  deliveryFee?: number;
  platformFee?: number;
  otp?: string;
  otpExpiresAt?: Date;
  otpAttempts?: number;
  isLocked?: boolean;
  podImage?: string;
  rating?: number;
  itemDescription?: string;
  itemWeight?: number;
  currentLocation?: GeoLocation;
  createdAt?: Date;
  updatedAt?: Date;
}

