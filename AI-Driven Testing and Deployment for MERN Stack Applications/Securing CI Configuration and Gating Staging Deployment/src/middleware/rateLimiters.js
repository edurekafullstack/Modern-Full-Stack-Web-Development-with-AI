import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";
import { failure } from "../utils/response.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => env.nodeEnv === "test",
  handler: (req, res, next, options) => {
    res
      .status(options.statusCode)
      .json(failure("Too many attempts. Please try again later."));
  },
});
