import { Router } from "express";
import {
  createRecord,
  getWriteCount,
  getReadAttempts,
  resetDemo,
} from "../services/demoDependency.service.js";
import { fetchWithRetry } from "../services/resilience.service.js";

const router = Router();

router.get("/inventory", async (req, res, next) => {
  try {
    const result = await fetchWithRetry(
      req.query.mode || "normal"
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/record", async (req, res, next) => {
  try {
    const result = await createRecord();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/status", (req, res) => {
  res.json({
    readAttempts: getReadAttempts(),
    totalWrites: getWriteCount(),
  });
});

router.post("/reset", (req, res) => {
  resetDemo();
  res.json({ message: "Demo state reset" });
});

export default router;