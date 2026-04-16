import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "./user.models";
import type { CreateUserDTO, LoginDTO, VendorOnboardDTO, HaulerOnboardDTO, UpdateProfileDTO } from "./user.types";
import { AppError } from "../../utils/AppError";
import { generateOTP } from "../../utils/otp";

function generateReferralCode(): string {
  return "HAULR-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

/**
 * Mock NIN validator – accepts any 11-digit numeric string.
 * Swap this with a real KYC provider (VerifyMe, Smile Identity, etc.)
 */
function validateNIN(nin: string): boolean {
  return /^\d{11}$/.test(nin);
}

export class UserService {
  /**
   * Register new user
   */
  static async createUser(data: CreateUserDTO) {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Validate incoming referral code if provided
    let referredBy: string | null = null;
    if (data.referralCode) {
      const code = data.referralCode.trim().toUpperCase();
      const referrer = await User.findOne({ referralCode: code });
      if (!referrer) throw new AppError("Invalid referral code", 400);
      referredBy = code;
    }

    // Generate a unique referral code for the new user
    let referralCode = generateReferralCode();
    let attempts = 0;
    while (await User.exists({ referralCode }) && attempts < 5) {
      referralCode = generateReferralCode();
      attempts++;
    }

    try {
      // Explicitly set non-registration fields to their initial states
      const user = await User.create({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: hashedPassword,
        role: data.role,
        kycStatus: "unverified",
        isVerified: false,
        vehicleImages: [],
        referralCode,
        referredBy,
      });
      return user;
    } catch (error: any) {
      // 🐞 FORCED DEBUGGING: Write error to a file we can read
      try {
        const fs = await import("fs");
        const logMsg = `\n[${new Date().toISOString()}] REGISTRATION FAILED:\n${JSON.stringify(error, null, 2)}\nMessage: ${error.message}\nStack: ${error.stack}\n`;
        fs.appendFileSync("registration_debug.log", logMsg);
      } catch (logErr) {
        console.error("Failed to write to debug log", logErr);
      }

      console.error("❌ [DB ERROR] User creation failed:", error);
      
      // Handle MongoDB Duplicate Key Error (11000)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new AppError(`An account with this ${field} already exists`, 400);
      }

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        console.error("❌ [VALIDATION DETAILS]:", messages);
        throw new AppError(`Registration Error: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  static async loginUser(data: LoginDTO) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    return User.findById(id);
  }

  /**
   * Onboard vendor – validate NIN only
   */
  static async onboardVendor(userId: string, data: VendorOnboardDTO) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.role !== "vendor") {
      throw new AppError("Only vendors can use vendor onboarding", 403);
    }
    if (user.kycStatus === "verified") {
      throw new AppError("Already verified", 400);
    }

    // Validate NIN format
    if (!validateNIN(data.nin)) {
      throw new AppError("Invalid NIN – must be 11 digits", 400);
    }

    // Update user with NIN only
    user.nin = data.nin;
    user.kycStatus = "verified";
    user.isVerified = true;
    await user.save();

    return user;
  }

  /**
   * Onboard hauler – validate NIN + vehicle info
   */
  static async onboardHauler(userId: string, data: HaulerOnboardDTO) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.role !== "hauler") {
      throw new AppError("Only haulers can use hauler onboarding", 403);
    }
    if (user.kycStatus === "verified") {
      throw new AppError("Already verified", 400);
    }

    // Validate NIN format
    if (!validateNIN(data.nin)) {
      throw new AppError("Invalid NIN – must be 11 digits", 400);
    }

    // Update user with onboarding data
    user.nin = data.nin;
    user.vehicleType = data.vehicleType;
    user.vehiclePlate = data.vehiclePlate;
    user.vehicleImages = data.vehicleImages || [];
    user.kycStatus = "verified";
    user.isVerified = true;
    await user.save();

    return user;
  }

  /**
   * Get full vendor/hauler profile with KYC info
   */
  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  /**
   * Request password reset – generates OTP
   */
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak user existence – return success regardless
      return;
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    console.log(`\n[AUTH] Password Reset OTP for ${email}: ${otp}\n`);

    // 📧 Send this via email
    try {
      const { sendEmail } = await import("../../utils/email");
      await sendEmail({
        to: email,
        subject: "Haulr Password Reset Verification",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>You requested to reset your password on Haulr. Your verification code is:</p>
            <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (err) {
      console.error("Failed to send email to", email, err);
      // We don't throw an error here, the OTP is generated and the user can check the backend logs for development if SMTP fails.
    }

    return otp; // Return it for development/testing convenience
  }

  /**
   * Reset password using OTP
   */
  static async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpire: { $gt: new Date() }
    }).select("+password +resetPasswordOTP +resetPasswordExpire");

    if (!user) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return user;
  }

  /**
   * Update User Profile
   */
  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // If role is changing, check KYC status
    if (data.role && data.role !== user.role) {
      // Logic: Only allow switching between vendor and hauler if verified
      if (user.role === "customer" || data.role === "admin") {
        throw new AppError("Direct role change to/from this role is restricted", 403);
      }

      if (user.kycStatus !== "verified") {
        throw new AppError(`Verification required to switch to ${data.role} role. Please complete onboarding first.`, 403);
      }
      
      user.role = data.role;
    }

    if (data.name) user.name = data.name;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    await user.save();
    return user;
  }

  /**
   * Get referral stats for current user
   */
  static async getReferrals(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const count = user.referralCode
      ? await User.countDocuments({ referredBy: user.referralCode })
      : 0;

    return { referralCode: user.referralCode || null, count };
  }

  /**
   * Update Bank Details
   */
  static async updateBankDetails(userId: string, data: { bankName: string; accountNumber: string; accountName?: string }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.bankDetails = {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
    };

    await user.save();
    return user;
  }
}

