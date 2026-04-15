// Rewired to use the wallet module's TransactionModel (single source of truth)

import type { Response } from 'express';
import { TransactionModel } from '../wallet/wallet.model';
import type { AuthenticatedRequest } from '../../types/auth-request';
import { asyncHandler } from '../../utils/asyncHandler';

export const getTransactions = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const transactions = await TransactionModel.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  }
);