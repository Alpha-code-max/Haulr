import type { Response, NextFunction } from "express";
import Driver from "./driver.model";
import type { AuthenticatedRequest } from "../../types/auth-request";

export const createDriver = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const driver = await Driver.create({
      ...req.body,
      user: req.user!.id,
    });

    res.status(201).json(driver);
  } catch (err) {
    next(err);
  }
};

export const getDrivers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const drivers = await Driver.find({ user: req.user!.id });
    res.json(drivers);
  } catch (err) {
    next(err);
  }
};