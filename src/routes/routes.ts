import { Router } from "express";
import authRoutes from "./auth.routes.js";
import menuRoutes from "./menu.routes.js";
import roleRoutes from "./role.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/roles", roleRoutes);

export default router;
