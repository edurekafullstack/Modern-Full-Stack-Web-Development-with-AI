import { validationResult } from "express-validator";
import { failure } from "../utils/response.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));
  res.status(400).json(failure("Validation failed", errors));
}
