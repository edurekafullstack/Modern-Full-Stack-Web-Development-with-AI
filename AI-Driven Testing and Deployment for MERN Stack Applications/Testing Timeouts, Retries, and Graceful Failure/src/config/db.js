import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  mongoose.set("debug", process.env.MONGOOSE_DEBUG === "true");
  const conn = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  const { host, name } = conn.connection;
  console.log(`MongoDB connected: ${host}/${name}`);

  mongoose.connection.on("error", (err) => {
    console.error(`[db] ${err.message}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] Disconnected");
  });
}

export function dbStatus() {
  const connected = mongoose.connection.readyState === 1;
  return connected ? "connected" : "disconnected";
}
