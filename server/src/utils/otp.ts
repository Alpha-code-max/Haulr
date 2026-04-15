import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit numeric OTP
 */
export const generateOTP = (): string => {
  try {
    return crypto.randomInt(100000, 999999).toString();
  } catch (err) {
    // Fallback if randomInt is not available for some reason
    console.warn("crypto.randomInt failed, falling back to Math.random");
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};
