// Development only: creates 120 sample tasks in a "Load Test" project.
// Usage: node scripts/seed-tasks.js <owner-email>
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Project } from "../src/models/project.model.js";
import { Task } from "../src/models/task.model.js";
import { User } from "../src/models/user.model.js";

const STATUSES = ["todo", "in-progress", "done"];
const PRIORITIES = ["low", "medium", "high"];
const DAY = 24 * 60 * 60 * 1000;

const ownerEmail = process.argv[2];
if (!ownerEmail) {
  console.error("Usage: node scripts/seed-tasks.js <owner-email>");
  process.exit(1);
}

await connectDB();

const owner = await User.findOne({ email: ownerEmail.toLowerCase() });
if (!owner) {
  console.error(`No user registered with email ${ownerEmail}`);
  await mongoose.disconnect();
  process.exit(1);
}

const project = await Project.create({ name: "Load Test" });

const tasks = Array.from({ length: 120 }, (_, i) => ({
  title: `Sample task ${String(i + 1).padStart(3, "0")}`,
  status: STATUSES[i % 3],
  priority: PRIORITIES[Math.floor(i / 3) % 3],
  dueDate: new Date(Date.now() + (i + 1) * DAY),
  project: project._id,
  owner: owner._id,
}));

await Task.insertMany(tasks);
console.log(
  `Created ${tasks.length} tasks in project ${project._id} for ${owner.email}`,
);

await mongoose.disconnect();
