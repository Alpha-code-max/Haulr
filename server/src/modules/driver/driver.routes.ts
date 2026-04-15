import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { createDriver, getDrivers } from "./driver.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management
 */

/**
 * @swagger
 * /drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone]
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, on_delivery]
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createDriver as any);

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers for authenticated user
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [available, on_delivery]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getDrivers as any);

export default router;
