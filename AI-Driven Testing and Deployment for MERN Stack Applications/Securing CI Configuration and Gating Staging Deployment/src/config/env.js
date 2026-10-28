import dotenv from "dotenv";

dotenv.config({ quiet: true });

for (const name of ["MONGODB_URI", "JWT_SECRET"]) {
  if (!process.env[name]) {
    throw new Error(`${name} is not set. Add it to your .env file.`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  clientOrigins: (process.env.CLIENT_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
