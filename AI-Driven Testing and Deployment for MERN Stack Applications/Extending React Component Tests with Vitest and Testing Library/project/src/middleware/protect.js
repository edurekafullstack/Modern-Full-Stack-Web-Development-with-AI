import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

function unauthorized(message) {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

function readBearerToken(header) {
  const [scheme, token, ...rest] = (header ?? "").trim().split(/\s+/);
  if (scheme !== "Bearer" || !token || rest.length > 0) return null;
  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw unauthorized("Token has expired");
    }
    throw unauthorized("Invalid token");
  }
}

export async function protect(req, res, next) {
  const token = readBearerToken(req.headers.authorization);
  if (!token) throw unauthorized("Authentication required");

  const { sub } = verifyToken(token);
  // A validly signed token with a missing or malformed sub is still unusable.
  if (!mongoose.isValidObjectId(sub)) throw unauthorized("Invalid token");

  const user = await User.findById(sub);
  if (!user) throw unauthorized("User no longer exists");

  req.user = user;
  next();
}
