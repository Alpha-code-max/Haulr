import { Router } from "express";
import { z } from "zod";
import { DeliveryController } from "./delivery.controllers";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Validation schemas
const createDeliverySchema = z.object({
  customerId: z.string()
    .min(1, "Customer ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Customer ID must be a valid MongoDB ID"),
  pickupAddress: z.string()
    .min(5, "Pickup address must be at least 5 characters")
    .max(500, "Pickup address is too long"),
  deliveryAddress: z.string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(500, "Delivery address is too long"),
  itemDescription: z.string()
    .max(500, "Item description is too long")
    .optional(),
  itemWeight: z.number()
    .positive("Item weight must be greater than 0")
    .optional(),
});

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Delivery management and logistics
 */

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Create a new delivery order (vendor only, must be KYC verified)
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - pickupAddress
 *               - deliveryAddress
 *             properties:
 *               customerId:
 *                 type: string
 *               pickupAddress:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               itemDescription:
 *                 type: string
 *               itemWeight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not KYC verified
 */
router.post("/", protect(["customer", "vendor"]), validate(createDeliverySchema), asyncHandler(DeliveryController.create));

/**
 * @swagger
 * /api/deliveries/available:
 *   get:
 *     summary: Get all available (pending) deliveries for haulers to browse
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available deliveries
 */
router.get("/available", protect(["hauler"]), asyncHandler(DeliveryController.getAvailable));

/**
 * @swagger
 * /api/deliveries/me:
 *   get:
 *     summary: Get all deliveries for the logged-in user
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deliveries for user
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect(), asyncHandler(DeliveryController.getUserDeliveries));

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a single delivery by ID
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery details
 *       404:
 *         description: Not found
 */
router.get("/:id", protect(), asyncHandler(DeliveryController.getById));

/**
 * @swagger
 * /api/deliveries/accept:
 *   post:
 *     summary: Hauler accepts a delivery and sets fee
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *               - deliveryFee
 *             properties:
 *               deliveryId:
 *                 type: string
 *               deliveryFee:
 *                 type: number
 *                 description: Fee set by hauler (additional 25 will be added)
 *     responses:
 *       200:
 *         description: Delivery accepted and priced
 *       400:
 *         description: Invalid data or delivery not available
 *       403:
 *         description: Not a hauler
 */
router.post("/accept", protect(["hauler"]), asyncHandler(DeliveryController.acceptDelivery));

/**
 * @swagger
 * /api/deliveries/pay:
 *   post:
 *     summary: Vendor pays for accepted delivery (escrow)
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful, delivery in escrow
 *       400:
 *         description: Invalid data or insufficient funds
 *       403:
 *         description: Not the vendor for this delivery
 */
router.post("/pay", protect(["vendor"]), asyncHandler(DeliveryController.payForDelivery));

/**
 * @swagger
 * /api/deliveries/cancel-acceptance:
 *   post:
 *     summary: Vendor cancels hauler acceptance
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acceptance cancelled, delivery back to pending
 *       400:
 *         description: Invalid data or delivery not accepted
 *       403:
 *         description: Not the vendor for this delivery
 */
router.post("/cancel-acceptance", protect(["vendor"]), asyncHandler(DeliveryController.cancelAcceptance));
router.post("/withdraw-acceptance", protect(["hauler"]), asyncHandler(DeliveryController.withdrawAcceptance));

/**
 * @swagger
 * /api/deliveries/pickup:
 *   post:
 *     summary: Mark a delivery as picked up by hauler
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery marked as picked up
 */
router.post("/pickup", protect(["hauler"]), asyncHandler(DeliveryController.pickup));

/**
 * @swagger
 * /api/deliveries/in-transit:
 *   post:
 *     summary: Mark a delivery as in transit
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *             properties:
 *               deliveryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery marked as in transit
 */
router.post("/in-transit", protect(["hauler"]), asyncHandler(DeliveryController.markInTransit));

/**
 * @swagger
 * /api/deliveries/update-location:
 *   post:
 *     summary: Update hauler GPS location for a delivery
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *               - lat
 *               - lng
 *             properties:
 *               deliveryId:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated
 */
router.post("/update-location", protect(["hauler"]), asyncHandler(DeliveryController.updateLocation));

/**
 * @swagger
 * /api/deliveries/deliver:
 *   post:
 *     summary: Complete delivery using OTP — releases escrow to hauler
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryId
 *               - otp
 *             properties:
 *               deliveryId:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery completed, escrow released
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/deliver", protect(["hauler"]), asyncHandler(DeliveryController.deliver));

/**
 * @swagger
 * /api/deliveries/{id}/resend-otp:
 *   post:
 *     summary: Regenerate and resend delivery completion OTP (vendor only)
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OTP regenerated successfully
 *       403:
 *         description: Not the vendor for this delivery
 */
router.post("/:id/resend-otp", protect(["vendor", "customer"]), asyncHandler(DeliveryController.resendOTP));

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     summary: Delete a pending delivery (vendor or customer creator only, before acceptance)
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery deleted
 *       400:
 *         description: Delivery cannot be deleted (not pending)
 *       403:
 *         description: Not the creator for this delivery
 *       404:
 *         description: Delivery not found
 */
router.delete("/:id", protect(["vendor", "customer"]), asyncHandler(DeliveryController.deleteDelivery));

export default router;
