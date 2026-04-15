import type { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.services";

export class AdminController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStats();
      const activities = await AdminService.getRecentActivities();
      res.status(200).json({ stats, activities });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveries = await AdminService.getAllDeliveries();
      res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  }
}
