import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";

async function assertProjectExists(projectId) {
  if (projectId && !(await Project.exists({ _id: projectId }))) {
    const error = new Error(`Project ${projectId} not found`);
    error.statusCode = 400;
    throw error;
  }
}

function isAdmin(user) {
  return user.role === "admin";
}

function assertCanAccess(task, user) {
  if (isAdmin(user) || task.owner.equals(user._id)) return;

  const error = new Error("You do not have permission to access this task");
  error.statusCode = 403;
  throw error;
}

export async function findAll({ filter, sort, page, limit }, user) {
  const scoped = isAdmin(user) ? filter : { ...filter, owner: user._id };

  const [tasks, total] = await Promise.all([
    Task.find(scoped)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("project", "name"),
    Task.countDocuments(scoped),
  ]);

  return { tasks, total };
}

export async function findById(id, user) {
  const task = await Task.findById(id).populate("project", "name description");
  if (!task) return null;

  assertCanAccess(task, user);
  return task;
}

export async function create(data, user) {
  await assertProjectExists(data.project);
  // The owner always comes from the authenticated user, never the client.
  const task = await Task.create({ ...data, owner: user._id });
  return task.populate("project", "name");
}

export async function updateById(id, changes, user) {
  const task = await Task.findById(id);
  if (!task) return null;

  assertCanAccess(task, user);
  // Ownership cannot be transferred through an update.
  const { owner, ...allowed } = changes;
  await assertProjectExists(allowed.project);
  return Task.findByIdAndUpdate(id, allowed, {
    returnDocument: "after",
    runValidators: true,
  }).populate("project", "name");
}

export async function deleteById(id, user) {
  const task = await Task.findById(id);
  if (!task) return null;

  assertCanAccess(task, user);
  await task.deleteOne();
  return task;
}
