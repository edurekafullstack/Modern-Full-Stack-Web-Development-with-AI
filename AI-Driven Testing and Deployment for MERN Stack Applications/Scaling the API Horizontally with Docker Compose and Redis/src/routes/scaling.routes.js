
import { Router } from "express";
import {
  getInstance,
  getMode,
  incrementCounter,
  getCachedValue,
  setCachedValue,
} from "../services/scalingState.service.js";

const router = Router();

router.get("/instance", (req, res) => {
  res.json({
    instance: getInstance(),
    mode: getMode(),
  });
});

router.get("/rate-limit", async (req, res, next) => {
  try {
    const count = await incrementCounter("demo:requests");

    res.status(count > 5 ? 429 : 200).json({
      instance: getInstance(),
      mode: getMode(),
      requests: count,
      limit: 5,
      allowed: count <= 5,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/cache", async (req, res, next) => {
  try {
    const key = "demo:inventory";
    let value = await getCachedValue(key);
    const cacheHit = value !== null;

    if (!cacheHit) {
      value = JSON.stringify({
        inventory: 12,
        generatedBy: getInstance(),
      });

      await setCachedValue(key, value);
    }

    res.json({
      instance: getInstance(),
      mode: getMode(),
      cacheHit,
      data: JSON.parse(value),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
