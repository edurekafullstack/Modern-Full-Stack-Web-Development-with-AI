# Testing Authentication and Authorization Flows with Jest and Supertest — Claude Code Prompts

## Prompt 1 — Step 2 — Create a User and JWT Test Helper

Create tests/helpers/auth.js with reusable authentication test helpers.

Requirements:

1. Export createUser(fields).
   - Create a user in the test database.
   - Generate a unique name and email on each call.
   - Use the password CorrectHorse9!.
   - Allow field overrides, including role.
2. Export tokenFor(user, options).
   - Sign a JWT containing the user's ID in the sub claim.
   - Use env.jwtSecret.
   - Default expiry to 1h.
   - Allow JWT signing options to be overridden.
3. Export authHeader(user).
   - Return an Authorization header object.
   - Use the Bearer token format.

Preserve the existing Jest and MongoDB Memory Server setup.

## Prompt 2 — Step 3 — Bring the Existing Task Tests Back to Green

Update tests/tasks.test.js to run every test as an authenticated user.

Requirements:

- Import createUser and authHeader from tests/helpers/auth.js.
- Create a fresh user in beforeEach.
- Attach authHeader(user) to every Supertest request.
- Include the Authorization header in the createTask helper.
- Preserve all existing test assertions.
- Do not modify the API implementation.

## Prompt 3 — Step 4 — Generate Authentication and Authorization Tests

Create automated security tests using Jest and Supertest.

Create tests/auth.test.js.

Test:

- Registration returns 201 without exposing the password.
- Registration ignores a role supplied in the request body.
- Login returns a JWT that works with GET /api/v1/auth/me.
- Incorrect passwords return 401 with "Invalid email or password".
- Unknown email addresses return the same generic 401 message.
- GET /auth/me returns 401 for a missing token.
- GET /auth/me returns 401 for an invalid token.
- GET /auth/me returns 401 with "Token has expired" for an expired token.

Create tests/authorization.test.js.

Test:

- Another user receives 403 for GET, PATCH, and DELETE on an owner's task.
- Rejected modifications do not change the stored task.
- Another user's task list does not contain the owner's tasks.
- An administrator can update another user's task.
- PATCH requests cannot reassign the task owner.
- Regular users cannot create projects.
- Administrators can create projects.

Use the existing authentication helpers.

Assert both HTTP status codes and response messages.

Keep authentication and authorization tests in separate files.

## Prompt 4 — Step 6 — Diagnose Without Editing

The test "returns 401 for an expired token" in tests/auth.test.js is failing.

Expected message:\
"Token has expired"

Actual message:\
"Invalid token"

The HTTP status is correctly 401.

The protect middleware returns "Token has expired" only for TokenExpiredError.

Explain why the generated test produces a different JWT verification error.

Inspect the test, token helper, and JWT configuration.

Do not modify any files yet.

## Prompt 5 — Step 6 — Fix the Test

Fix the expired-token test in tests/auth.test.js.

Replace the direct jwt.sign call that uses "test-secret" with the existing tokenFor helper.

Generate the expired token using:

tokenFor(user, { expiresIn: '-1m' })

Do not change the protect middleware or any other test behavior.

## Prompt 6 — Step 7 — Review Coverage

Review the authentication and authorization test coverage.

List every protected endpoint and access-control rule in the API.

For each rule, identify which tests in:

- tests/auth.test.js
- tests/authorization.test.js
- tests/tasks.test.js

cover:

- Successful access
- HTTP 401 failures
- HTTP 403 failures

Identify any missing access-control scenarios.

Do not modify any files.

## Prompt 7 — Step 7 — Add the Missing Test

Add one authentication test to tests/auth.test.js for a deleted user.

Test steps:

1. Create a user using createUser.
2. Generate a valid JWT using tokenFor.
3. Delete the user from the test database.
4. Send GET /api/v1/auth/me with the token.
5. Assert HTTP 401.
6. Assert the message is "User no longer exists".

Do not modify the application code or existing assertions.
