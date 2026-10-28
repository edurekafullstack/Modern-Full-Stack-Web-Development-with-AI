import { fetchInventory } from "./demoDependency.service.js";

const TIMEOUT_MS = 500;
const MAX_ATTEMPTS = 3;

export async function fetchWithRetry(mode = "normal") {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(new Error("Dependency timeout")),
      TIMEOUT_MS
    );

    try {
      const data = await Promise.race([
        fetchInventory(mode, controller.signal),
        new Promise((_, reject) => {
          controller.signal.addEventListener(
            "abort",
            () => reject(controller.signal.reason),
            { once: true }
          );
        }),
      ]);

      return { data, attempts: attempt };
    } catch (error) {
      lastError = error;
      console.log(
        `Read attempt ${attempt} failed: ${error.message}`
      );
    } finally {
      clearTimeout(timer);
    }
  }

  const error = new Error(
    `Inventory dependency failed: ${lastError.message}`
  );

  error.statusCode = 503;
  throw error;
}