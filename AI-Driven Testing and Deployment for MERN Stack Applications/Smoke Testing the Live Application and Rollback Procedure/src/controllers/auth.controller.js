import * as authService from "../services/auth.service.js";
import { success } from "../utils/response.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  const user = await authService.register({ name, email, password });
  res.status(201).json(success(user, "Account created"));
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { token, user } = await authService.login({ email, password });
  res.json(success({ token, user }, "Logged in"));
}

export function me(req, res) {
  res.json(success(req.user, "Current user"));
}
