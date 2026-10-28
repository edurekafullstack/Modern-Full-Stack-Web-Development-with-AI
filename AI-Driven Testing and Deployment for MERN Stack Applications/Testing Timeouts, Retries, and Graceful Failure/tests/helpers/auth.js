import jwt from "jsonwebtoken";
import { User } from "../../src/models/user.model.js";
import { env } from "../../src/config/env.js";

export const PASSWORD = "CorrectHorse9!";

let counter = 0;

// Creates a user in the test database. Each call gets a unique name and email.
export async function createUser(fields = {}) {
  counter += 1;
  const tag = `${Date.now()}-${counter}`;
  return User.create({
    name: `Test User ${tag}`,
    email: `user-${tag}@example.com`,
    password: PASSWORD,
    ...fields,
  });
}

// Signs a token the same way the app does: user id in `sub`, signed with env.jwtSecret.
export function tokenFor(user, options = { expiresIn: "1h" }) {
  return jwt.sign({ sub: user.id }, env.jwtSecret, options);
}

export function authHeader(user) {
  return { Authorization: `Bearer ${tokenFor(user)}` };
}
