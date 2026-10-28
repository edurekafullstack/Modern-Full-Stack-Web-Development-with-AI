import { Router } from "express";
import { getProjects, createProject } from "../controllers/project.controller.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getProjects);
router.post("/", authorize("admin"), createProject);

export default router;
