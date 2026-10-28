import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let server;

export async function connect() {
  mongoose.set("debug", process.env.MONGOOSE_DEBUG === "true");
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
}

export async function clear() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((c) => c.deleteMany({})));
}

export async function close() {
  await mongoose.disconnect();
  await server?.stop();
}
