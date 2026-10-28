import * as taskService from "../services/task.service.js";
import { success, failure } from "../utils/response.js";
import { parseListQuery } from "../utils/listQuery.js";

export async function getTasks(req, res) {
  const query = parseListQuery(req.query);
  const { tasks, total } = await taskService.findAll(query, req.user);

  const pagination = {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
  const data = { count: tasks.length, tasks, pagination };
  res.json(success(data, "Tasks retrieved"));
}

export async function getTaskById(req, res) {
  const task = await taskService.findById(req.params.id, req.user);

  if (!task) {
    return res.status(404).json(failure(`Task ${req.params.id} not found`));
  }

  res.json(success(task, "Task retrieved"));
}

export async function createTask(req, res) {
  const task = await taskService.create(req.body ?? {}, req.user);
  res.status(201).json(success(task, "Task created"));
}

const UPDATABLE_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "dueDate",
  "project",
];

export async function updateTask(req, res) {
  const changes = {};
  for (const field of UPDATABLE_FIELDS) {
    if (req.body?.[field] !== undefined) {
      changes[field] = req.body[field];
    }
  }

  const task = await taskService.updateById(
    req.params.id,
    changes,
    req.user,
  );

  if (!task) {
    return res.status(404).json(failure(`Task ${req.params.id} not found`));
  }

  res.json(success(task, "Task updated"));
}

export async function deleteTask(req, res) {
  const task = await taskService.deleteById(req.params.id, req.user);

  if (!task) {
    return res.status(404).json(failure(`Task ${req.params.id} not found`));
  }

  res.status(204).end();
}
