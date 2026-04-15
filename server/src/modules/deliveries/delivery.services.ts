import { DeliveryModel } from "./delivery.model";
import type { CreateDeliveryDTO } from "./delivery.types";
import mongoose from "mongoose";
import { WalletService } from "../wallet/wallet.services";
import { User } from "../users/user.models";
import { AppError } from "../../utils/AppError";
import { generateOTP } from "../../utils/otp";

export class DeliveryService {
  static async createDelivery(vendorId: string, data: CreateDeliveryDTO) {
    // Verify vendor is KYC-verified
    const vendor = await User.findById(vendorId);
    if (!vendor) throw new AppError("Vendor not found", 404);
    if (vendor.kycStatus !== "verified") {
      throw new AppError("Complete onboarding before creating deliveries. Please finish vendor/hauler onboarding.", 403);
    }

    if (!data.customerId || !data.pickupAddress || !data.deliveryAddress) {
      throw new AppError("Invalid delivery data: customerId, pickupAddress, deliveryAddress are required.", 400);
    }

    // Generate 6-digit OTP with 24-hour expiry
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const delivery = await DeliveryModel.create({
      ...data,
      otp,
      otpExpiresAt,
      vendorId,
    });
    return delivery;
  }

  /**
   * Hauler accepts a pending delivery and sets the delivery fee
   */
  static async acceptDelivery(deliveryId: string, haulerId: string, deliveryFee: number) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.status !== "pending") {
      throw new AppError("Only pending deliveries can be accepted", 400);
    }

    // Verify hauler is KYC-verified
    const hauler = await User.findById(haulerId);
    if (!hauler) throw new AppError("Hauler not found", 404);
    if (hauler.kycStatus !== "verified") {
      throw new AppError("Complete onboarding before accepting deliveries", 403);
    }

    if (!deliveryFee || deliveryFee <= 0) {
      throw new AppError("Delivery fee must be a positive number", 400);
    }

    delivery.haulerId = new mongoose.Types.ObjectId(haulerId);
    delivery.deliveryFee = deliveryFee;
    delivery.status = "accepted";
    await delivery.save();

    return delivery;
  }

  /**
   * Vendor pays for an accepted delivery — escrows funds from vendor wallet
   */
  static async payForDelivery(deliveryId: string, vendorId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.vendorId.toString() !== vendorId) {
      throw new AppError("You are not the vendor for this delivery", 403);
    }
    if (delivery.status !== "accepted") {
      throw new AppError("Delivery must be accepted by a hauler before payment", 400);
    }
    if (!delivery.deliveryFee) {
      throw new AppError("No delivery fee set", 400);
    }

    // Escrow funds from vendor wallet
    await WalletService.createTransaction(vendorId, {
      type: "escrow",
      amount: delivery.deliveryFee,
      deliveryId: delivery._id as any,
      balanceAfter: 0, // Will be computed inside WalletService
    });

    delivery.status = "paid";
    await delivery.save();

    return delivery;
  }

  /**
   * Delete a pending delivery (Vendor/Creator only, before acceptance)
   */
  static async deleteDelivery(deliveryId: string, userId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.vendorId.toString() !== userId.toString()) {
      throw new AppError("You are not the creator for this delivery", 403);
    }
    if (delivery.status !== "pending") {
      throw new AppError("Only pending deliveries can be deleted", 400);
    }

    await DeliveryModel.findByIdAndDelete(deliveryId);
    return { message: "Delivery deleted successfully" };
  }

  static async cancelAcceptance(deliveryId: string, vendorId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.vendorId.toString() !== vendorId) throw new AppError("You are not the vendor for this delivery", 403);
    if (delivery.status !== "accepted") throw new AppError("Delivery must be accepted to cancel acceptance", 400);

    // Reset delivery to pending state
    delivery.haulerId = undefined;
    delivery.deliveryFee = undefined;
    delivery.status = "pending";
    await delivery.save();
    return delivery;
  }

  static async pickupPackage(deliveryId: string, haulerId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.status !== "paid") throw new AppError("Delivery must be paid for first", 400);
    if (delivery.haulerId?.toString() !== haulerId) throw new AppError("You are not the assigned hauler", 403);

    delivery.status = "picked_up";
    await delivery.save();
    return delivery;
  }

  /**
   * Hauler withdraws their acceptance of a job (Pre-payment only)
   * This tells the vendor what happened and frees the job for others.
   */
  static async withdrawAcceptance(deliveryId: string, haulerId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.status !== "accepted") {
      throw new AppError("You can only withdraw acceptance before the vendor pays.", 400);
    }
    if (delivery.haulerId?.toString() !== haulerId) {
      throw new AppError("You are not the assigned hauler for this delivery.", 403);
    }

    delivery.haulerId = undefined;
    delivery.deliveryFee = undefined;
    delivery.status = "pending";
    await delivery.save();
    return delivery;
  }

  /**
   * Manually regenerate OTP (Vendor/Creator only)
   */
  static async regenerateOTP(deliveryId: string, userId: string) {
    console.log(`[OTP DEBUG] Request: DeliveryId=${deliveryId}, RequestUserId=${userId}`);
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) {
      console.error(`[OTP DEBUG] Delivery not found: ${deliveryId}`);
      throw new AppError("Delivery not found", 404);
    }
    
    const deliveryVendorId = delivery.vendorId.toString();
    const deliveryCustomerId = delivery.customerId.toString();
    const requestUserId = userId.toString();
    
    console.log(`[OTP DEBUG] Comparing IDs: Vendor=${deliveryVendorId}, Customer=${deliveryCustomerId}, Request=${requestUserId}`);
    
    const isOwner = deliveryVendorId === requestUserId || deliveryCustomerId === requestUserId;
    
    if (!isOwner) {
      console.error(`[OTP DEBUG] Ownership mismatch! Request user ${requestUserId} is neither Vendor ${deliveryVendorId} nor Customer ${deliveryCustomerId}`);
      throw new AppError("Only the creator or the recipient can regenerate the OTP", 403);
    }

    if (["delivered", "cancelled"].includes(delivery.status)) {
      throw new AppError(`Cannot regenerate OTP for ${delivery.status} delivery`, 400);
    }

    delivery.otp = generateOTP();
    delivery.otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    delivery.otpAttempts = 0;
    delivery.isLocked = false;
    
    await delivery.save();
    return delivery;
  }

  static async markInTransit(deliveryId: string, haulerId: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.status !== "picked_up") throw new AppError("Delivery must be picked up first", 400);
    if (delivery.haulerId?.toString() !== haulerId) throw new AppError("You are not the assigned hauler", 403);

    delivery.status = "in_transit";
    await delivery.save();
    return delivery;
  }

  static async updateLocation(deliveryId: string, haulerId: string, lat: number, lng: number) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    if (delivery.haulerId?.toString() !== haulerId) throw new AppError("You are not the assigned hauler", 403);
    if (!["picked_up", "in_transit"].includes(delivery.status)) {
      throw new AppError("Can only update location during active delivery", 400);
    }

    delivery.currentLocation = { lat, lng, updatedAt: new Date() };
    await delivery.save();
    return delivery;
  }

  static async deliverPackage(deliveryId: string, haulerId: string, otp: string, podImage?: string) {
    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) throw new AppError("Delivery not found", 404);
    
    // 1. Security Check: Is the delivery locked?
    if (delivery.isLocked) {
      throw new AppError("This delivery is LOCKED due to too many failed OTP attempts. Please contact the vendor to regenerate a new security code.", 403);
    }

    if (!["picked_up", "in_transit"].includes(delivery.status)) {
      throw new AppError("Delivery must be 'Picked Up' or 'In Transit' before you can verify the code.", 400);
    }
    if (delivery.haulerId?.toString() !== haulerId) {
      throw new AppError("You are not the assigned hauler for this delivery.", 403);
    }

    // 2. Proof of Delivery Check
    if (!podImage) {
      throw new AppError("Proof of Delivery (Photo) is required to complete this shipment. Please upload a delivery photo.", 400);
    }

    // 3. OTP Verification
    if (delivery.otp !== otp) {
      // Increment attempts
      delivery.otpAttempts = (delivery.otpAttempts || 0) + 1;
      
      if (delivery.otpAttempts >= 5) {
        delivery.isLocked = true;
        await delivery.save();
        throw new AppError("CRITICAL: Too many failed attempts. This delivery has been LOCKED for security. The vendor must issue a new OTP.", 403);
      }

      await delivery.save();
      throw new AppError(`Invalid OTP code. You have ${5 - delivery.otpAttempts} attempts remaining before this shipment locks.`, 400);
    }

    // 4. Expiry Check
    if (delivery.otpExpiresAt && new Date() > delivery.otpExpiresAt) {
      throw new AppError("The security code has expired. Please ask the vendor to regenerate it.", 400);
    }

    delivery.status = "delivered";
    delivery.podImage = podImage;
    await delivery.save();

    // 5. Release escrow to hauler with 24h holding period
    await WalletService.createTransaction(haulerId, {
      type: "release",
      amount: delivery.deliveryFee || 0,
      deliveryId: delivery._id as any,
      balanceAfter: 0,
    });

    return delivery;
  }

  static async getDeliveriesForUser(userId: string) {
    return DeliveryModel.find({
      $or: [{ customerId: userId }, { haulerId: userId }, { vendorId: userId }],
    })
      .populate("vendorId", "name phone")
      .populate("customerId", "name phone")
      .populate("haulerId", "name phone")
      .sort({ createdAt: -1 });
  }

  static async getAvailableDeliveries() {
    return DeliveryModel.find({ status: "pending" })
      .populate("vendorId", "name phone")
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });
  }

  static async getDeliveryById(deliveryId: string) {
    const delivery = await DeliveryModel.findById(deliveryId)
      .populate("vendorId", "name phone")
      .populate("customerId", "name phone")
      .populate("haulerId", "name phone");
    if (!delivery) throw new AppError("Delivery not found", 404);
    return delivery;
  }
}
