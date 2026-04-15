import type { Types } from "mongoose";

export interface Wallet {
  userId: Types.ObjectId;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Transaction {
  userId: Types.ObjectId;
  type: "deposit" | "escrow" | "release" | "withdraw";
  amount: number;
  deliveryId?: Types.ObjectId;
  balanceAfter: number;
  status?: "pending" | "cleared";
  clearedAt?: Date;
  createdAt?: Date;
}

export interface CreateTransactionDTO {
  type: "deposit" | "escrow" | "release" | "withdraw";
  amount: number;
  deliveryId?: Types.ObjectId;
  balanceAfter: number; // ✅ ADD THIS
}
