
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initialiseScalingState } from "./services/scalingState.service.js";

async function start() {
  try {
    const demoMode =
      process.env.RESILIENCE_DEMO === "true" ||
      process.env.SCALING_DEMO === "true";

    if (demoMode && env.nodeEnv === "production") {
      throw new Error("Demo mode is disabled in production");
    }

    if (!demoMode) {
      await connectDB();
    } else {
      console.log("[demo] Starting without MongoDB");
    }

    if (process.env.SCALING_DEMO === "true") {
      await initialiseScalingState();
    }

    app.listen(env.port, () => {
      const { nodeEnv, port } = env;

      console.log(
        `Server running in ${nodeEnv} mode on port ${port}`
      );
    });
  } catch (error) {
    console.error("[startup] Failed to start:", error.message);

    if (error.reason?.servers) {
      for (const [address, server] of error.reason.servers) {
        console.error("----------------------------");
        console.error("Server:", address);
        console.error("State:", server.type);
        console.error("Cause:", server.error);
      }
    }

    process.exit(1);
  }
}

start();
