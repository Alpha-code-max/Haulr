import mongoose, { Schema, Document } from "mongoose";
import type { UserRole, KycStatus } from "./user.types";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  rating?: number;
  nin?: string;
  vehicleImages?: string[];
  kycStatus: KycStatus;
  vehicleType?: string;
  vehiclePlate?: string;
  avatar?: string;
  resetPasswordOTP?: string;
  resetPasswordExpire?: Date;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔐 never return password
    },

    role: {
      type: String,
      enum: ["vendor", "customer", "hauler", "admin"],
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    nin: {
      type: String,
      trim: true,
    },

    vehicleImages: {
      type: [String],
      default: [],
    },

    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },

    vehicleType: {
      type: String,
      trim: true,
    },

    vehiclePlate: {
      type: String,
      trim: true,
      uppercase: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    bankDetails: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      accountName: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);
