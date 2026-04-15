import { Router } from "express";
import { AdminController } from "./admin.controllers";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

// All admin routes are protected and require "admin" role
router.use(protect(["admin"]));

router.get("/stats", AdminController.getDashboardStats);
router.get("/users", AdminController.getUsers);
router.get("/deliveries", AdminController.getDeliveries);

export default router;
