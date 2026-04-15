import mongoose, { Schema, model, Document, Types } from "mongoose";
import type { Wallet, Transaction } from "./wallet.types";

export interface WalletDoc extends Wallet, Document {}
export interface TransactionDoc extends Transaction, Document {}

const walletSchema = new Schema<WalletDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const transactionSchema = new Schema<TransactionDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "escrow", "release", "withdraw"],
      required: true,
    },
    amount: { type: Number, required: true },
    deliveryId: { type: Schema.Types.ObjectId, ref: "Delivery" },
    balanceAfter: { type: Number, required: true},
    status: {
      type: String,
      enum: ["pending", "cleared"],
      default: "cleared",
    },
    clearedAt: { type: Date },
  },
  { timestamps: true }
);

// Safe exports – prevents OverwriteModelError during hot-reload
export const WalletModel =
  (mongoose.models.Wallet as mongoose.Model<WalletDoc> | undefined) ||
  model<WalletDoc>("Wallet", walletSchema);

export const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<TransactionDoc> | undefined) ||
  model<TransactionDoc>("Transaction", transactionSchema);
