import type { Response } from "express";
import {DeliveryModel} from "../deliveries/delivery.model";
import { WalletModel }from "../wallet/wallet.model";
import type { AuthenticatedRequest } from "../../types/auth-request";

export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;

  const wallet = await WalletModel.findOne({ user: userId });

  const totalDeliveries = await DeliveryModel.countDocuments({ user: userId });
  const pendingDeliveries = await DeliveryModel.countDocuments({
    user: userId,
    status: "pending",
  });
  const deliveredDeliveries = await DeliveryModel.countDocuments({
    user: userId,
    status: "delivered",
  });

  res.json({
    balance: wallet?.balance || 0,
    totalDeliveries,
    pendingDeliveries,
    deliveredDeliveries,
  });
};
