import type { Request, Response, NextFunction } from "express";
import { DeliveryService } from "./delivery.services";

export class DeliveryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const vendorId = req.user!.id;
    const delivery = await DeliveryService.createDelivery(vendorId, req.body);
    res.status(201).json(delivery);
  }

  static async acceptDelivery(req: Request, res: Response, next: NextFunction) {
    const { deliveryId, deliveryFee } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.acceptDelivery(deliveryId, haulerId, deliveryFee);
    res.status(200).json(delivery);
  }

  static async payForDelivery(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.body;
    const vendorId = req.user!.id;
    const delivery = await DeliveryService.payForDelivery(deliveryId, vendorId);
    res.status(200).json(delivery);
  }

  static async cancelAcceptance(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.body;
    const vendorId = req.user!.id;
    const delivery = await DeliveryService.cancelAcceptance(deliveryId, vendorId);
    res.status(200).json(delivery);
  }

  static async withdrawAcceptance(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.withdrawAcceptance(deliveryId, haulerId);
    res.status(200).json(delivery);
  }

  static async pickup(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.pickupPackage(deliveryId, haulerId);
    res.status(200).json(delivery);
  }

  static async markInTransit(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.markInTransit(deliveryId, haulerId);
    res.status(200).json(delivery);
  }

  static async updateLocation(req: Request, res: Response, next: NextFunction) {
    const { deliveryId, lat, lng } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.updateLocation(deliveryId, haulerId, lat, lng);
    res.status(200).json(delivery);
  }

  static async deliver(req: Request, res: Response, next: NextFunction) {
    const { deliveryId, otp, podImage } = req.body;
    const haulerId = req.user!.id;
    const delivery = await DeliveryService.deliverPackage(deliveryId, haulerId, otp, podImage);
    res.status(200).json(delivery);
  }

  static async resendOTP(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const vendorId = req.user!.id;
    
    // 1. Regenerate the OTP
    await DeliveryService.regenerateOTP(id, vendorId);
    
    // 2. Fetch the updated delivery with populations so the frontend state stays consistent
    const updatedDelivery = await DeliveryService.getDeliveryById(id);
    
    res.status(200).json(updatedDelivery);
  }

  static async getUserDeliveries(req: Request, res: Response, next: NextFunction) {
    const userId = req.user!.id;
    const deliveries = await DeliveryService.getDeliveriesForUser(userId);
    res.status(200).json(deliveries);
  }

  static async getAvailable(req: Request, res: Response, next: NextFunction) {
    const deliveries = await DeliveryService.getAvailableDeliveries();
    res.status(200).json(deliveries);
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const delivery = await DeliveryService.getDeliveryById(req.params.id as string);
    res.status(200).json(delivery);
  }

  static async deleteDelivery(req: Request, res: Response, next: NextFunction) {
    const vendorId = req.user!.id;
    const result = await DeliveryService.deleteDelivery(req.params.id as string, vendorId);
    res.status(200).json(result);
  }
}
