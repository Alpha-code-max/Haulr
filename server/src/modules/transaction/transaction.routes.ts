import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getTransactions } from "./transaction.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Wallet transaction history
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get authenticated user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [deposit, escrow, release, withdraw]
 *                   amount:
 *                     type: number
 *                   balanceAfter:
 *                     type: number
 *                   deliveryId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect(), getTransactions);

export default router;
