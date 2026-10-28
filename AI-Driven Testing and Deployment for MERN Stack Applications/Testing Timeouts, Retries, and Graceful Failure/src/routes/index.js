import { Router } from "express";
import { protect } from "../middleware/protect.js";
import taskRoutes from "./task.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.routes.js";
import resilienceRoutes from "./resilience.routes.js";
import scalingRoutes from "./scaling.routes.js";
const router = Router();

router.use("/tasks", protect, taskRoutes);
router.use("/projects", protect, projectRoutes);
router.use("/auth", authRoutes);
router.use("/resilience", resilienceRoutes);
if (
  process.env.SCALING_DEMO === "true" &&
  process.env.NODE_ENV !== "production"
) {
  router.use("/scaling", scalingRoutes);
}
export default router;
