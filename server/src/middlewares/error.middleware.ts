import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 📝 Log full error details for development
  if (err.name === 'ZodError') {
    console.error("❌ [VALIDATION ERROR]:", JSON.stringify(err.issues, null, 2));
  } else {
    console.error("❌ [API ERROR]:", err.message || err);
    if (err.stack) console.error(err.stack);
  }

  if (err instanceof AppError || err.statusCode) {
    return res.status(err.statusCode || 400).json({
      message: err.message || err.toString(),
      errors: err.issues || (err.name === 'ZodError' ? err.issues : undefined)
    });
  }

  console.error("Unexpected internal error", err);

  res.status(500).json({
    message: err?.message ? `Internal Server Error: ${err.message}` : "Internal Server Error",
  });
};
