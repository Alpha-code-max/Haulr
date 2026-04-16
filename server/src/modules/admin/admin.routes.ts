import { Router } from "express";
import { AdminController } from "./admin.controllers";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// General admin routes (admin + super_admin via middleware bypass)
router.use(protect(["admin"]));

router.get("/stats", AdminController.getDashboardStats);
router.get("/users", AdminController.getUsers);
router.get("/deliveries", AdminController.getDeliveries);

// Promote a user to admin or super_admin — super_admin only
router.patch("/promote", protect(["super_admin"]), AdminController.promoteUser);

export default router;
