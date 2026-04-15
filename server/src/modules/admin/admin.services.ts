import { User } from "../users/user.models";
import { DeliveryModel } from "../deliveries/delivery.model";
import { WalletModel, TransactionModel } from "../wallet/wallet.model";

export class AdminService {
  /**
   * Get global stats for the admin dashboard
   */
  static async getStats() {
    const totalUsers = await User.countDocuments();
    const totalDeliveries = await DeliveryModel.countDocuments();
    const activeDeliveries = await DeliveryModel.countDocuments({ 
      status: { $in: ["paid", "picked_up", "in_transit"] } 
    });
    
    const walletStats = await WalletModel.aggregate([
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
    ]);

    const escrowStats = await TransactionModel.aggregate([
      { $match: { type: "escrow" } },
      { $group: { _id: null, totalEscrow: { $sum: "$amount" } } }
    ]);

    return {
      users: totalUsers,
      deliveries: totalDeliveries,
      activeDeliveries,
      totalBalance: walletStats[0]?.totalBalance || 0,
      totalEscrow: escrowStats[0]?.totalEscrow || 0,
    };
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities() {
    // Combine recent users and recent transactions/deliveries
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentDeliveries = await DeliveryModel.find()
      .populate("vendorId", "name")
      .populate("haulerId", "name")
      .sort({ updatedAt: -1 })
      .limit(5);

    return {
      recentUsers,
      recentDeliveries,
    };
  }

  /**
   * Get all users with full details
   */
  static async getAllUsers() {
    return User.find().sort({ createdAt: -1 });
  }

  /**
   * Get all deliveries with full details
   */
  static async getAllDeliveries() {
    return DeliveryModel.find()
      .populate("vendorId", "name phone")
      .populate("customerId", "name phone")
      .populate("haulerId", "name phone")
      .sort({ createdAt: -1 });
  }
}
