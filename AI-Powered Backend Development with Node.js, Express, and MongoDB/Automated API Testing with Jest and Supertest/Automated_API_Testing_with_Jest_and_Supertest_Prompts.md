# Automated API Testing with Jest and Supertest — Claude Code Prompts

## Prompt 1 — Step 2: Configure Jest and Supertest

Install jest, supertest, and mongodb-memory-server

as development dependencies.



Configure Jest in package.json to support native

ES modules.



Requirements:

\- Add an npm test script that runs Jest using Node.js

  with the --experimental-vm-modules flag.

\- Use the node test environment.

\- Disable code transforms.

\- Add tests/setup-env.js under setupFiles.

\- Set NODE_ENV to test.

\- Set MONGODB_URI to a placeholder value.



In src/app.js, skip morgan and requestTimer

when NODE_ENV is test.



Preserve the existing application configuration.

## Prompt 2 — Step 3: Create a Separate In-Memory Test Database

Create tests/helpers/db.js.



Use mongodb-memory-server and Mongoose.



Export three async functions:



1\. connect:

   Start MongoMemoryServer and connect Mongoose

   to the generated database URI.



2\. clear:

   Delete all documents from every collection

   without dropping indexes.



3\. close:

   Disconnect Mongoose and stop MongoMemoryServer.



Use optional chaining when stopping the server

so cleanup remains safe if startup fails.



Do not connect to MongoDB Atlas.

## Prompt 3 — Step 4: Generate Automated CRUD Tests

Create tests/tasks.test.js using Jest and Supertest.



Import the Express app from src/app.js and the

test database helpers from tests/helpers/db.js.



Use:

\- beforeAll to connect with a 60-second timeout.

\- afterEach to clear the database.

\- afterAll to close the database.



Create tests for:



1\. POST creates a task with defaults and returns 201.

2\. POST invalid data returns 400 with field errors.

3\. GET list filters by status and returns pagination.

4\. GET by ID returns the task.

5\. GET unknown ID returns 404.

6\. GET malformed ID returns 400.

7\. PATCH updates a task and returns the new values.

8\. PATCH invalid status returns 400 and preserves the task.

9\. DELETE removes a task and returns 204.

10\. DELETE unknown ID returns 404.



Use meaningful assertions on response bodies,

not only HTTP status codes.



Each test must create the data it needs.
