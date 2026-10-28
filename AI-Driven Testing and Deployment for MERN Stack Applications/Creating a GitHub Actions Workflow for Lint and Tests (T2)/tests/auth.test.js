import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import { User } from "../src/models/user.model.js";
import { connect, clear, close } from "./helpers/db.js";
import { createUser, tokenFor, PASSWORD } from "./helpers/auth.js";

beforeAll(async () => {
  await connect();
  await User.init();
}, 60_000);
afterEach(clear);
afterAll(close);

const ASHA = {
  name: "Asha",
  email: "asha@example.com",
  password: PASSWORD,
};

function register(fields = {}) {
  return request(app)
    .post("/api/v1/auth/register")
    .send({ ...ASHA, ...fields });
}

function login(fields = {}) {
  return request(app)
    .post("/api/v1/auth/login")
    .send({ email: ASHA.email, password: ASHA.password, ...fields });
}

function me(authorization) {
  const req = request(app).get("/api/v1/auth/me");
  return authorization ? req.set("Authorization", authorization) : req;
}

describe("POST /api/v1/auth/register", () => {
  it("returns 201 without exposing the password", async () => {
    const res = await register();

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Account created");
    expect(res.body.data).toMatchObject({
      name: "Asha",
      email: "asha@example.com",
    });
    expect(res.body.data).not.toHaveProperty("password");
    expect(JSON.stringify(res.body)).not.toContain(PASSWORD);
  });

  it("ignores a role supplied in the request body", async () => {
    const res = await register({ role: "admin" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Account created");
    expect(res.body.data.role).toBe("user");

    const stored = await User.findById(res.body.data._id);
    expect(stored.role).toBe("user");
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => register());

  it("returns a JWT that works with GET /api/v1/auth/me", async () => {
    const res = await login();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged in");
    expect(res.body.data.token).toEqual(expect.any(String));

    const profile = await me(`Bearer ${res.body.data.token}`);
    expect(profile.status).toBe(200);
    expect(profile.body.message).toBe("Current user");
    expect(profile.body.data._id).toBe(res.body.data.user._id);
    expect(profile.body.data.email).toBe("asha@example.com");
    expect(profile.body.data).not.toHaveProperty("password");
  });

  it("returns 401 for an incorrect password", async () => {
    const res = await login({ password: "WrongPassword1!" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email or password",
    });
  });

  it("returns the same generic 401 for an unknown email", async () => {
    const res = await login({ email: "nobody@example.com" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email or password",
    });
  });
});

describe("GET /api/v1/auth/me", () => {
  it("returns 401 when the token is missing", async () => {
    const res = await me();

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication required");
  });

  it("returns 401 for a malformed token", async () => {
    const res = await me("Bearer not-a-real-token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it("returns 401 for a token signed with a different secret", async () => {
    const user = await createUser();
    const forged = jwt.sign({ sub: user.id }, "another-secret", {
      expiresIn: "1h",
    });

    const res = await me(`Bearer ${forged}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it('returns 401 with "Token has expired" for an expired token', async () => {
    const user = await createUser();
    const expired = tokenFor(user, { expiresIn: "-1m" });
    const res = await me(`Bearer ${expired}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token has expired");
  });

  it("returns 401 for a valid token whose user has been deleted", async () => {
    const user = await createUser();
    const token = tokenFor(user);
    await User.deleteOne({ _id: user._id });

    const res = await me(`Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User no longer exists");
  });
});
