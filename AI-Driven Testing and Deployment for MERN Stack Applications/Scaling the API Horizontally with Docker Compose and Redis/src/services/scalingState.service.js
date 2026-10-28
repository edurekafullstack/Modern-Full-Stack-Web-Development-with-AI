
import { createClient } from "redis";

const instance = process.env.INSTANCE_NAME || "local";
const useRedis = process.env.USE_REDIS === "true";

const memory = new Map();
let redis;

export async function initialiseScalingState() {
  if (!useRedis) return;

  redis = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379",
  });

  redis.on("error", (error) => {
    console.error("[redis]", error.message);
  });

  await redis.connect();
}

export function getInstance() {
  return instance;
}

export function getMode() {
  return useRedis ? "redis" : "memory";
}

export async function incrementCounter(key) {
  if (useRedis) {
    return redis.incr(key);
  }

  const value = (memory.get(key) || 0) + 1;
  memory.set(key, value);
  return value;
}

export async function getCachedValue(key) {
  if (useRedis) {
    return redis.get(key);
  }

  return memory.get(key) || null;
}

export async function setCachedValue(key, value) {
  if (useRedis) {
    await redis.set(key, value, { EX: 60 });
  } else {
    memory.set(key, value);
  }
}
