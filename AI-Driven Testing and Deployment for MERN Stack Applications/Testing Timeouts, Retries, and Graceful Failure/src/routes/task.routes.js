import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";
import { taskRules } from "../validators/task.validators.js";

const router = Router();

router.get("/", getTasks);
router.post("/", taskRules(), validate, createTask);
router.get("/:id", validateObjectId, getTaskById);
router.patch(
  "/:id",
  validateObjectId,
  taskRules({ isUpdate: true }),
  validate,
  updateTask,
);
router.delete("/:id", validateObjectId, deleteTask);

export default router;
