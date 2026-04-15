import jwt from "jsonwebtoken";
import type { AuthPayload } from "../modules/users/user.types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const signToken = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};
