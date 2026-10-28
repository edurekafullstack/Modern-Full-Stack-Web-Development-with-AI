import mongoose from "mongoose";
import { failure } from "../utils/response.js";

export function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json(failure(`Invalid id: ${req.params.id}`));
  }

  next();
}
