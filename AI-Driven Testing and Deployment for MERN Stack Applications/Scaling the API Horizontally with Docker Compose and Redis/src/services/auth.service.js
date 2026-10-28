import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

function invalidCredentials() {
  const error = new Error("Invalid email or password");
  error.statusCode = 401;
  return error;
}

// Compared against when no user matches, so every failed login takes
// about the same time. Its cost factor must match the User model's.
const DUMMY_HASH =
  "$2b$12$9UKLgSuCBCSyGMLHr2C4bOMp5sPKRRBrL8erDyGDmStPcu2I3O0Ue";

export function register({ name, email, password }) {
  return User.create({ name, email, password });
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  const hash = user?.password ?? DUMMY_HASH;
  const passwordMatches = await bcrypt.compare(password, hash);

  if (!user || !passwordMatches) {
    throw invalidCredentials();
  }

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  return { token, user };
}
