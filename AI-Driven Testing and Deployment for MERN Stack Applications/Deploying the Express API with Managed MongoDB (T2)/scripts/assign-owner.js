// One-time migration: assigns every task without an owner to the given user.
// Tasks that already have an owner are left untouched.
// Usage: node scripts/assign-owner.js <owner-email>
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Task } from "../src/models/task.model.js";
import { User } from "../src/models/user.model.js";

const ownerEmail = process.argv[2];
if (!ownerEmail) {
  console.error("Usage: node scripts/assign-owner.js <owner-email>");
  process.exit(1);
}

await connectDB();

try {
  const owner = await User.findOne({ email: ownerEmail.toLowerCase() });
  if (!owner) {
    throw new Error(`No user registered with email ${ownerEmail}`);
  }

  const result = await Task.updateMany(
    { owner: { $exists: false } },
    { $set: { owner: owner._id } },
  );
  console.log(`Assigned ${result.modifiedCount} tasks to ${owner.email}`);
} finally {
  await mongoose.disconnect();
}
