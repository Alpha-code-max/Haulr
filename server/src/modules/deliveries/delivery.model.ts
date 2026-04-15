import mongoose, { Schema, model, Document, Types } from "mongoose";
import type { Delivery } from "./delivery.types";

// Extend the interface with Mongoose Document
export interface DeliveryDoc extends Delivery, Document {}

const deliverySchema = new Schema<DeliveryDoc>(
  {
    vendorId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    haulerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    pickupAddress: { 
      type: String, 
      required: true 
    },
    deliveryAddress: { 
      type: String, 
      required: true 
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "priced", "paid", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryFee: { 
      type: Number
    },
    otp: { 
      type: String 
    },
    otpExpiresAt: {
      type: Date
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    podImage: {
      type: String
    },
    referenceImage: {
      type: String
    },
    rating: { 
      type: Number, 
      default: 0 
    },
    itemDescription: {
      type: String,
      trim: true,
    },
    itemWeight: {
      type: Number,
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// ────────────────────────────────────────────────
// Safe model export – prevents OverwriteModelError in dev with tsx watch / nodemon
// ────────────────────────────────────────────────
export const DeliveryModel = 
  (mongoose.models.Delivery as mongoose.Model<DeliveryDoc> | undefined) ||
  model<DeliveryDoc>("Delivery", deliverySchema);
