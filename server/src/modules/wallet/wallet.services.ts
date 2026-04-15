import { WalletModel, TransactionModel } from "./wallet.model";
import type { CreateTransactionDTO } from "./wallet.types";
import mongoose from "mongoose";
import { AppError } from "../../utils/AppError";

export class WalletService {
  static async getWallet(userId: string) {
    let wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      wallet = await WalletModel.create({ userId, balance: 0 });
    }
    return wallet;
  }

  static async createTransaction(userId: string, dto: CreateTransactionDTO) {
    const wallet = await this.getWallet(userId);

    if (dto.type === "escrow" && wallet.balance < dto.amount) {
      throw new AppError("Insufficient funds for escrow. Please deposit more to your wallet before creating these deliveries.", 400);
    }

    if (dto.type === "withdraw" && wallet.balance < dto.amount) {
      throw new AppError("Insufficient funds for withdrawal.", 400);
    }

    let newBalance = wallet.balance;
    if (dto.type === "deposit") newBalance += dto.amount;
    if (dto.type === "withdraw" || dto.type === "escrow") newBalance -= dto.amount;
    if (dto.type === "release") newBalance += dto.amount;

    wallet.balance = newBalance;
    await wallet.save();

    const isRelease = dto.type === "release";
    
    const transaction = await TransactionModel.create({
      userId,
      type: dto.type,
      amount: dto.amount,
      balanceAfter: newBalance,
      deliveryId: dto.deliveryId ? new mongoose.Types.ObjectId(dto.deliveryId) : undefined,
      status: isRelease ? "pending" : "cleared",
      clearedAt: isRelease ? new Date(Date.now() + 24 * 60 * 60 * 1000) : new Date(),
    });

    return transaction;
  }

  static async getTransactions(userId: string) {
    return TransactionModel.find({ userId }).sort({ createdAt: -1 });
  }
}
