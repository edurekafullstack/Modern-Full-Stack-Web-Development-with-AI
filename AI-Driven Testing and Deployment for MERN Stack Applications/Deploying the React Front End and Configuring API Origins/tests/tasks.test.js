import request from "supertest";
import app from "../src/app.js";
import { connect, clear, close } from "./helpers/db.js";
import { createUser, authHeader } from "./helpers/auth.js";

beforeAll(connect, 60_000);
afterEach(clear);
afterAll(close);

const UNKNOWN_ID = "000000000000000000000000";

let user;

beforeEach(async () => {
  user = await createUser();
});

async function createTask(fields = {}) {
  const res = await request(app)
    .post("/api/v1/tasks")
    .set(authHeader(user))
    .send({ title: "Write the first test", ...fields });
  return res.body.data;
}

describe("POST /api/v1/tasks", () => {
  it("creates a task with defaults and returns 201", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set(authHeader(user))
      .send({ title: "  Write the first test  ", priority: "high" });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      title: "Write the first test",
      status: "todo",
      priority: "high",
    });
    expect(res.body.data._id).toEqual(expect.any(String));
  });

  it("returns 400 with a message for each invalid field", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set(authHeader(user))
      .send({ title: "", status: "blocked" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { field: "title", message: "Title is required" },
        {
          field: "status",
          message: "Status must be one of: todo, in-progress, done",
        },
      ]),
    );
  });

  it("creates a task without a due date when dueDate is omitted", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set(authHeader(user))
      .send({ title: "Write the README" });

    expect(res.status).toBe(201);
    expect(res.body.data).not.toHaveProperty("dueDate");
  });

  it("returns 400 when dueDate is an empty string", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set(authHeader(user))
      .send({ title: "Write the README", dueDate: "" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { field: "dueDate", message: "Due date must be a valid date" },
      ]),
    );
  });
});

describe("GET /api/v1/tasks", () => {
  it("filters by status and reports pagination", async () => {
    await createTask({ title: "Task one" });
    await createTask({ title: "Task two", status: "done" });
    await createTask({ title: "Task three", status: "done" });

    const res = await request(app)
      .get("/api/v1/tasks?status=done&limit=1")
      .set(authHeader(user));

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(1);
    expect(res.body.data.tasks[0].status).toBe("done");
    expect(res.body.data.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    });
  });
});

describe("GET /api/v1/tasks/:id", () => {
  it("returns the task", async () => {
    const task = await createTask();
    const res = await request(app)
      .get(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user));

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Write the first test");
  });

  it("returns 404 for an id that matches no task", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${UNKNOWN_ID}`)
      .set(authHeader(user));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(`Task ${UNKNOWN_ID} not found`);
  });

  it("returns 400 for a malformed id", async () => {
    const res = await request(app)
      .get("/api/v1/tasks/abc")
      .set(authHeader(user));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid id: abc");
  });
});

describe("PATCH /api/v1/tasks/:id", () => {
  it("returns the updated task", async () => {
    const task = await createTask();
    const res = await request(app)
      .patch(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user))
      .send({ status: "done" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("done");
  });

  it("rejects an invalid status and leaves the task unchanged", async () => {
    const task = await createTask();
    const res = await request(app)
      .patch(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user))
      .send({ status: "blocked" });

    expect(res.status).toBe(400);
    const stored = await request(app)
      .get(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user));
    expect(stored.body.data.status).toBe("todo");
  });
});

describe("DELETE /api/v1/tasks/:id", () => {
  it("returns 204 and removes the task", async () => {
    const task = await createTask();
    const res = await request(app)
      .delete(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user));

    expect(res.status).toBe(204);
    const stored = await request(app)
      .get(`/api/v1/tasks/${task._id}`)
      .set(authHeader(user));
    expect(stored.status).toBe(404);
  });

  it("returns 404 for an id that matches no task", async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${UNKNOWN_ID}`)
      .set(authHeader(user));

    expect(res.status).toBe(404);
  });
});
