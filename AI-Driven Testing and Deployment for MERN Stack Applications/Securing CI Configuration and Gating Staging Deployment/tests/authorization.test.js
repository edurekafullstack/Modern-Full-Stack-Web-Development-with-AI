import request from "supertest";
import app from "../src/app.js";
import { Task } from "../src/models/task.model.js";
import { Project } from "../src/models/project.model.js";
import { connect, clear, close } from "./helpers/db.js";
import { createUser, authHeader } from "./helpers/auth.js";

beforeAll(connect, 60_000);
afterEach(clear);
afterAll(close);

const TASK_FORBIDDEN = "You do not have permission to access this task";
const ROLE_FORBIDDEN = "You do not have permission to perform this action";

let owner;
let otherUser;
let admin;
let task;

beforeEach(async () => {
  owner = await createUser();
  otherUser = await createUser();
  admin = await createUser({ role: "admin" });

  const res = await request(app)
    .post("/api/v1/tasks")
    .set(authHeader(owner))
    .send({ title: "Owner's private task", priority: "low" });
  task = res.body.data;
});

describe("task ownership", () => {
  it("returns 403 when another user reads the owner's task", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${task._id}`)
      .set(authHeader(otherUser));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(TASK_FORBIDDEN);
    expect(res.body).not.toHaveProperty("data");
  });

  it("returns 403 for another user's PATCH and leaves the task unchanged", async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${task._id}`)
      .set(authHeader(otherUser))
      .send({ title: "Hijacked", status: "done" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(TASK_FORBIDDEN);

    const stored = await Task.findById(task._id);
    expect(stored.title).toBe("Owner's private task");
    expect(stored.status).toBe("todo");
    expect(stored.owner.equals(owner._id)).toBe(true);
  });

  it("returns 403 for another user's DELETE and keeps the task", async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${task._id}`)
      .set(authHeader(otherUser));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(TASK_FORBIDDEN);
    expect(await Task.exists({ _id: task._id })).not.toBeNull();
  });

  it("excludes the owner's tasks from another user's task list", async () => {
    await request(app)
      .post("/api/v1/tasks")
      .set(authHeader(otherUser))
      .send({ title: "Other user's task" });

    const res = await request(app)
      .get("/api/v1/tasks")
      .set(authHeader(otherUser));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tasks retrieved");
    expect(res.body.data.count).toBe(1);
    expect(res.body.data.tasks.map((t) => t.title)).toEqual([
      "Other user's task",
    ]);
    expect(res.body.data.tasks.map((t) => t._id)).not.toContain(task._id);
  });

  it("lets an administrator update another user's task", async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${task._id}`)
      .set(authHeader(admin))
      .send({ status: "in-progress" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task updated");
    expect(res.body.data.status).toBe("in-progress");
    expect(res.body.data.owner).toBe(owner.id);
  });

  it("does not let a PATCH reassign the task owner", async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${task._id}`)
      .set(authHeader(owner))
      .send({ title: "Renamed task", owner: otherUser.id });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task updated");
    expect(res.body.data.title).toBe("Renamed task");
    expect(res.body.data.owner).toBe(owner.id);

    const stored = await Task.findById(task._id);
    expect(stored.owner.equals(owner._id)).toBe(true);

    const otherView = await request(app)
      .get(`/api/v1/tasks/${task._id}`)
      .set(authHeader(otherUser));
    expect(otherView.status).toBe(403);
    expect(otherView.body.message).toBe(TASK_FORBIDDEN);
  });
});

describe("POST /api/v1/projects", () => {
  it("returns 403 for a regular user and creates nothing", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set(authHeader(owner))
      .send({ name: "Unauthorised project" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(ROLE_FORBIDDEN);
    expect(await Project.countDocuments()).toBe(0);
  });

  it("lets an administrator create a project", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set(authHeader(admin))
      .send({ name: "Admin project", description: "Created by an admin" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Project created");
    expect(res.body.data).toMatchObject({
      name: "Admin project",
      description: "Created by an admin",
    });
    expect(await Project.countDocuments()).toBe(1);
  });
});
