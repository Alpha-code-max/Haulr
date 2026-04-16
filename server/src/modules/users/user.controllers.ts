import type { CreateUserDTO, LoginDTO, VendorOnboardDTO, HaulerOnboardDTO, UpdateProfileDTO } from "./user.types";
import { UserService } from "./user.services";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export class UserController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const data: CreateUserDTO = req.body;

    const user = await UserService.createUser(data);

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    res.status(201).json({
      message: "User created",
      token,
    });
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const data: LoginDTO = req.body;

    const user = await UserService.loginUser(data);

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  }

  static async me(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const user = await UserService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  }

  static async onboard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.role === "vendor") {
        const data: VendorOnboardDTO = req.body;
        const updatedUser = await UserService.onboardVendor(userId, data);
        res.status(200).json({
          message: "Vendor onboarding successful – KYC verified",
          user: updatedUser,
        });
      } else if (user.role === "hauler") {
        const data: HaulerOnboardDTO = req.body;
        const updatedUser = await UserService.onboardHauler(userId, data);
        res.status(200).json({
          message: "Hauler onboarding successful – KYC verified",
          user: updatedUser,
        });
      } else {
        throw new AppError("Invalid role for onboarding", 403);
      }
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user!.id;
    const user = await UserService.getProfile(userId);
    res.status(200).json(user);
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const otp = await UserService.forgotPassword(email);
      
      res.status(200).json({
        message: "If an account exists with that email, an OTP has been sent.",
        // Only including OTP in response for development convenience
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, otp, newPassword } = req.body;
      await UserService.resetPassword(email, otp, newPassword);
      
      res.status(200).json({
        message: "Password reset successful"
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const data: UpdateProfileDTO = req.body;

      const user = await UserService.updateProfile(userId, data);

      res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBankDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const data = req.body;

      const user = await UserService.updateBankDetails(userId, data);

      res.status(200).json({
        message: "Bank details updated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReferrals(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const data = await UserService.getReferrals(userId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
