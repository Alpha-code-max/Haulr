export type UserRole = "vendor" | "customer" | "hauler" | "admin";
export type KycStatus = "unverified" | "pending" | "verified" | "rejected";

/**
 * Data required to register a user
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

/**
 * Vendor onboarding DTO - only NIN required
 */
export interface VendorOnboardDTO {
  nin: string;
}

/**
 * Hauler onboarding DTO - NIN + vehicle details required
 */
export interface HaulerOnboardDTO {
  nin: string;
  vehicleType: string;
  vehiclePlate: string;
  vehicleImages?: string[];
}

/**
 * Login DTO
 */
export interface LoginDTO {
  password: string;
}

/**
 * Update Profile DTO
 */
export interface UpdateProfileDTO {
  name?: string;
  avatar?: string;
  role?: UserRole;
}

/**
 * What we store inside JWT
 */
export interface AuthPayload {
  id: string;
  role: UserRole;
}

/**
 * Public-safe user object (no password)
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  rating?: number;
  kycStatus?: KycStatus;
  vehicleType?: string;
  vehiclePlate?: string;
  nin?: string;
  avatar?: string;
}
