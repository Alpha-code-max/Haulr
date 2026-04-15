import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { UserController } from "./user.controllers";
import { UserService } from "./user.services";
import type { VendorOnboardDTO, HaulerOnboardDTO } from "./user.types";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [vendor, customer, hauler, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */

import { z } from "zod";
import { validate } from "../../middlewares/validate.middleware";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["vendor", "customer", "hauler", "admin"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/register", validate(registerSchema), UserController.register);
router.post("/login", validate(loginSchema), UserController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), UserController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), UserController.resetPassword);
router.get("/me", protect(), UserController.me);

const vendorOnboardSchema = z.object({
  nin: z.string().length(11, "NIN must be exactly 11 digits").regex(/^\d+$/, "NIN must be numeric"),
});

const haulerOnboardSchema = z.object({
  nin: z.string().length(11, "NIN must be exactly 11 digits").regex(/^\d+$/, "NIN must be numeric"),
  vehicleType: z.string().min(2, "Vehicle type required"),
  vehiclePlate: z.string().min(3, "Vehicle plate required"),
  vehicleImages: z.array(z.string()).optional(),
});

// Separate controllers for different roles
const onboardVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data: VendorOnboardDTO = req.body;
    const user = await UserService.onboardVendor(userId, data);
    res.status(200).json({
      message: "Vendor onboarding successful – KYC verified",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const onboardHauler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data: HaulerOnboardDTO = req.body;
    const user = await UserService.onboardHauler(userId, data);
    res.status(200).json({
      message: "Hauler onboarding successful – KYC verified",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/onboard/vendor:
 *   post:
 *     summary: Complete vendor onboarding with KYC (NIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nin
 *             properties:
 *               nin:
 *                 type: string
 *                 description: 11-digit National Identification Number
 *     responses:
 *       200:
 *         description: Vendor onboarding successful
 *       400:
 *         description: Invalid NIN
 *       403:
 *         description: Not a vendor
 */

/**
 * @swagger
 * /api/users/onboard/hauler:
 *   post:
 *     summary: Complete hauler onboarding with KYC (NIN + vehicle details)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nin
 *               - vehicleType
 *               - vehiclePlate
 *             properties:
 *               nin:
 *                 type: string
 *                 description: 11-digit National Identification Number
 *               vehicleType:
 *                 type: string
 *                 description: Type of vehicle (Car, Van, Motorcycle, etc.)
 *               vehiclePlate:
 *                 type: string
 *                 description: Vehicle registration plate number
 *               vehicleImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional array of vehicle image URLs
 *     responses:
 *       200:
 *         description: Hauler onboarding successful
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Not a hauler
 */
router.post("/onboard/vendor", protect(["vendor"]), validate(vendorOnboardSchema), onboardVendor);
router.post("/onboard/hauler", protect(["hauler"]), validate(haulerOnboardSchema), onboardHauler);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get full user profile with KYC status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile with KYC info
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protect(), UserController.getProfile);
router.patch("/profile", protect(), UserController.updateProfile);
router.patch("/bank-details", protect(), UserController.updateBankDetails);

export default router;
