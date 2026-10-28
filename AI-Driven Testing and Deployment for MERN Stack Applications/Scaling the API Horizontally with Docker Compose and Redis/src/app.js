import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { readFileSync } from "node:fs";
import { success } from "./utils/response.js";
import { dbStatus } from "./config/db.js";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { requestTimer } from "./middleware/requestTimer.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
  app.use(requestTimer);
}
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  const data = {
    name: pkg.name,
    version: pkg.version,
    environment: env.nodeEnv,
  };
  res.status(200).json(success(data, "API is running"));
});

app.get("/health", (req, res) => {
  const data = {
    uptime: Math.floor(process.uptime()),
    database: dbStatus(),
  };
  res.status(200).json(success(data, "Healthy"));
});

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
