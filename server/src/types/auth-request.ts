import type { Request } from "express";
import type { AuthPayload } from "../modules/users/user.types";

export interface AuthenticatedRequest extends Request {
  user: AuthPayload; // NOT optional
}
