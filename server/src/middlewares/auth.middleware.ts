import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const protect =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    try {
      const decoded: any = verifyToken(token);
      console.log(`[AUTH DEBUG] Decoded token:`, decoded);
      console.log(`[AUTH DEBUG] Required roles:`, roles);

      // super_admin bypasses all role restrictions
      if (roles.length && !roles.includes(decoded.role) && decoded.role !== "super_admin") {
        console.error(`[AUTH DEBUG] Forbidden: User role ${decoded.role} not in ${roles}`);
        return res.status(403).json({ message: "Forbidden: Role mismatch" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error(`[AUTH DEBUG] Auth failed:`, err);
      return res.status(401).json({ message: "Token expired or invalid" });
    }
  };
