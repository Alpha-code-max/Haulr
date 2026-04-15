import type { RequestHandler } from "express";
import { WalletService } from "./wallet.services";
import { PaystackService } from "./paystack";
import { User } from "../users/user.models";
import { AppError } from "../../utils/AppError";

export class WalletController {
  static getWallet: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const wallet = await WalletService.getWallet(req.user.id);
      res.status(200).json(wallet);
    } catch (err) {
      next(err);
    }
  };

  static createTransaction: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const transaction = await WalletService.createTransaction(
        req.user.id,
        req.body
      );

      res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  };

  static getTransactions: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const transactions = await WalletService.getTransactions(req.user.id);
      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Initialize a Paystack payment for wallet funding
   */
  static initializePayment: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { amount } = req.body;
      if (!amount || amount <= 0) {
        throw new AppError("Amount must be a positive number", 400);
      }

      // Get user email for Paystack
      const user = await User.findById(req.user.id);
      if (!user) throw new AppError("User not found", 404);

      const paystackData = await PaystackService.initializeTransaction(
        user.email,
        amount,
        { userId: req.user.id }
      );

      res.status(200).json({
        authorization_url: paystackData.authorization_url,
        access_code: paystackData.access_code,
        reference: paystackData.reference,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Verify a Paystack payment and credit the wallet
   */
  static verifyPayment: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const reference = req.query.reference as string;
      if (!reference) {
        throw new AppError("Payment reference is required", 400);
      }

      const paystackData = await PaystackService.verifyTransaction(reference);

      if (paystackData.status !== "success") {
        throw new AppError(
          `Payment not successful. Status: ${paystackData.status}`,
          400
        );
      }

      // Convert kobo back to Naira
      const amountInNaira = paystackData.amount / 100;

      // Credit the user's wallet
      const transaction = await WalletService.createTransaction(req.user.id, {
        type: "deposit",
        amount: amountInNaira,
        balanceAfter: 0, // Computed inside service
      });

      const wallet = await WalletService.getWallet(req.user.id);

      res.status(200).json({
        message: "Payment verified and wallet credited",
        transaction,
        wallet,
      });
    } catch (err) {
      next(err);
    }
  };
}
