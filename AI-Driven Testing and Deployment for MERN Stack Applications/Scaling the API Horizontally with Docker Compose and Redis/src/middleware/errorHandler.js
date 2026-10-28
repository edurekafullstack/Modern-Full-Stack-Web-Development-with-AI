import mongoose from "mongoose";
import { env } from "../config/env.js";
import { failure } from "../utils/response.js";

function fieldMessage(error) {
  if (error.name === "CastError") {
    return `${error.path} must be a valid ${error.kind}`;
  }
  return error.message;
}

function normaliseError(err) {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: fieldMessage(error),
    }));
    return { statusCode: 400, message: "Validation failed", errors };
  }

  if (err instanceof mongoose.Error.CastError) {
    const message = `Invalid value for ${err.path}: ${err.value}`;
    return { statusCode: 400, message };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    const message = `A record with that ${field} already exists`;
    return { statusCode: 409, message, errors: [{ field, message }] };
  }

  const statusCode = err.statusCode || err.status || 500;
  return { statusCode, message: err.message };
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const { statusCode, message, errors } = normaliseError(err);
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(`[error] ${err.stack}`);

  const clientMessage =
    isServerError && env.nodeEnv === "production"
      ? "Something went wrong"
      : message;

  res.status(statusCode).json(failure(clientMessage, errors));
}
