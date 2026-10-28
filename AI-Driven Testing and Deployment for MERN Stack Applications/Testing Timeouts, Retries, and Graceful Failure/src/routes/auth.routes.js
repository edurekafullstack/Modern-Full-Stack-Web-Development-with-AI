import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { validate } from "../middleware/validate.js";
import { registerRules, loginRules } from "../validators/auth.validators.js";

const router = Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.get("/me", protect, me);

export default router;
