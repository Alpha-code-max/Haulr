import { Router } from "express";
import { WalletController } from "./wallet.controllers";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet, transactions, and Paystack payment management
 */

/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Get user wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wallet
 */
router.get("/", protect(), WalletController.getWallet);

/**
 * @swagger
 * /api/wallet/transaction:
 *   post:
 *     summary: Create a wallet transaction (deposit, escrow, release, withdraw)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [deposit, escrow, release, withdraw]
 *               amount:
 *                 type: number
 *               deliveryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post("/transaction", protect(), WalletController.createTransaction);

/**
 * @swagger
 * /api/wallet/transactions:
 *   get:
 *     summary: Get all user transactions
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user transactions
 */
router.get("/transactions", protect(), WalletController.getTransactions);

/**
 * @swagger
 * /api/wallet/fund/initialize:
 *   post:
 *     summary: Initialize a Paystack payment to fund wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in Naira to fund
 *     responses:
 *       200:
 *         description: Paystack authorization URL and reference
 *       400:
 *         description: Invalid amount
 *       503:
 *         description: Paystack not configured
 */
router.post("/fund/initialize", protect(), WalletController.initializePayment);

/**
 * @swagger
 * /api/wallet/fund/verify:
 *   get:
 *     summary: Verify Paystack payment and credit wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified and wallet credited
 *       400:
 *         description: Payment not successful or missing reference
 */
router.get("/fund/verify", protect(), WalletController.verifyPayment);

export default router;
