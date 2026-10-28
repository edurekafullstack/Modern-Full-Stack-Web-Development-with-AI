# Automating a Login-to-CRUD Journey with Playwright — Claude Code Prompts

**Week 1 · Activity 2 · Step 9**  
**Project:** Existing `Demo_project` MERN application  
**Goal:** Automate login → create task → complete task → delete task, then inspect a deliberate failure with Playwright Trace Viewer.

## File Placement (Important)

Work in the **existing project**. The Playwright project belongs in a separate `e2e/` folder at the repository root, **not** inside `client/` or `server/`.

```text
Demo_project/
├── server/
│   ├── scripts/
│   │   └── e2e-server.js          # Isolated MongoDB Memory Server + API startup
│   ├── src/
│   │   ├── server.js
│   │   └── app.js
│   └── package.json               # e2e:api script
├── client/
│   ├── .env.e2e                   # E2E API URL only
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskModal.jsx
│   │   │   └── TaskList.jsx
│   │   └── api/
│   │       └── client.js
│   └── package.json               # e2e:client script
└── e2e/
    ├── tests/
    │   ├── recorded.spec.js       # Temporary Codegen output; later remove
    │   └── task-journey.spec.js   # Final reliable E2E test
    ├── playwright.config.js
    ├── package.json
    ├── test-results/              # Generated failure traces
    └── playwright-report/         # Generated HTML report
```

**Ports:** Express API `3001`; React/Vite `5174`; MongoDB Memory Server uses an isolated ephemeral database. All terminal commands below are relative to `Demo_project/` unless stated otherwise. Do not connect this demo to a real development or production database.

## Prompt 1 — Inspect the Existing Project and Plan the E2E Environment

```text
Inspect this existing MERN Demo_project before making changes. Check server/src/server.js, server/src/app.js, server/package.json, client/package.json, client/src/api/client.js, client/src/components/TaskModal.jsx, client/src/components/TaskList.jsx, the login page and the registration flow. Identify the actual database URI environment variable, CORS origin setting, JWT setting, API base URL, health endpoint, login and registration routes, task update ID shape, and task completion and deletion controls. Confirm whether branch w1-s09-start exists; do not create it if missing. Summarize the exact compatibility checks and planned files. Do not modify any files yet.
```

**Recording check:** The demo uses `TaskModal.jsx` for creation, so it must open the modal rather than replacing it with an inline task form.

## Prompt 2 — Create the Isolated E2E API and Client Configuration

```text
Set up an isolated Playwright E2E environment for this existing project. Create server/scripts/e2e-server.js, using MongoDB Memory Server and the environment variable names verified in Prompt 1. Ensure the in-memory database URI and test JWT settings are applied before the backend connects; ensure any dotenv loading cannot override the isolated database connection. Start the API on port 3001 and configure CORS for http://localhost:5174. Preserve the existing Express application and its normal environment behavior. Add "e2e:api": "node scripts/e2e-server.js" to the existing server/package.json scripts without removing other scripts.

Create client/.env.e2e with the API URL expected by the existing Vite API client (for example VITE_API_URL=http://localhost:3001/api/v1 only if that variable is genuinely supported). Add "e2e:client": "vite --mode e2e --port 5174 --strictPort" to the existing client/package.json scripts. Verify or document the real health endpoint. Do not change production configuration, database contents or unrelated application code. Show all proposed changes before applying them.
```

**File locations:** `server/scripts/e2e-server.js`, `server/package.json`, `client/.env.e2e`, `client/package.json`.

**Check dependencies and startup:**

```powershell
cd server
npm install
npm run e2e:api
```

In another terminal, from `Demo_project/`:

```powershell
cd client
npm install
npm run e2e:client
```

Verify the API health endpoint actually implemented by the project and open `http://localhost:5174` in a browser.

## Prompt 3 — Install and Configure Playwright at the Project Root

From `Demo_project/`:

```powershell
npm init playwright@latest e2e
```

Choose **JavaScript**, **tests** as the test folder, **No** for the GitHub Actions workflow, and **Yes** to install browsers. If the installer does not create the expected nested layout, check where it wrote files before moving or editing them.

```text
Review e2e/playwright.config.js and adapt it for this existing project. Configure testDir './tests', the Chromium/Desktop Chrome project, baseURL http://localhost:5174, trace 'retain-on-failure', list and HTML reporters, and a webServer array that starts the existing server/package.json e2e:api script and client/package.json e2e:client script. Use the actual working API health URL for backend readiness, not an invented route. Keep the frontend readiness URL http://localhost:5174. Use appropriate cwd values relative to the e2e project, CI-safe reuseExistingServer behavior, and a startup timeout long enough for MongoDB Memory Server. Preserve any needed existing settings. Remove only the generated Playwright example test. Do not modify React or Express business logic.
```

**Expected location:** `e2e/playwright.config.js`. Verify `npm` scripts resolve from `e2e/` and that no real database is used.

## Prompt 4 — Record the Login-to-CRUD Journey with Codegen

Start the isolated API and client manually in separate terminals (as described in Prompt 2). Register a temporary user through `/register`, log in, create two example tasks, and log out. These manual records are **only for the recording stage**, not for the final reliable test.

From `Demo_project/e2e/`:

```powershell
npx playwright codegen http://localhost:5174/login
```

Record: log in → open task creation modal → enter **Write the README** → click **Create Task** → complete the new task → delete it → confirm deletion if the app requests confirmation.

Save the generated code at `e2e/tests/recorded.spec.js`. Do not substitute guessed selectors for the selectors generated from the actual interface.

```text
Review e2e/tests/recorded.spec.js without editing it. Identify hard-coded user data, selectors using first()/nth(), assumptions about existing tasks, missing assertions, fixed sleeps, and places where the TaskModal-based creation flow may be handled incorrectly. Briefly explain why Codegen output is a starting point rather than an independent, reliable end-to-end test. Do not modify any files yet.
```

## Prompt 5 — Demonstrate Unreliable Recorded Tests

From `Demo_project/e2e/`:

```powershell
npx playwright test tests/recorded.spec.js --repeat-each=5
```

Inspect actual results; failures may vary and are not guaranteed. Stop and restart the isolated API to demonstrate that manually registered accounts vanish with the in-memory database. If the recording fails at login afterward, explain the data-dependency problem. Do not weaken assertions to force a demonstration failure.

## Prompt 6 — Build a Reliable, Self-Contained Playwright Test

```text
Create e2e/tests/task-journey.spec.js with one reliable Playwright test for: register a unique test user through the isolated API, log in through the real React UI, open TaskModal, create a uniquely titled task, assert that the task is visible, mark it completed, assert the completed state, reload and confirm persistence, delete the same task, and assert that it disappears. Use crypto.randomUUID() for unique test email and task title, role- and label-based selectors where the actual markup supports them, and a task-specific locator rather than first()/nth(). Inspect TaskModal.jsx, TaskList.jsx, the login page and API routes before choosing locators. Respect the actual completion control (checkbox, button or dropdown) and any deletion confirmation. Use Playwright auto-waiting expectations; avoid arbitrary timeouts. Ensure the test does not require manually prepared users or tasks and works against a fresh MongoDB Memory Server. Do not change application behavior just to fit selectors. Show changes for review before applying them.
```

**Keep:** `e2e/tests/task-journey.spec.js`. Once it is verified, delete `e2e/tests/recorded.spec.js` so the unreliable test does not run in the final suite.

## Prompt 7 — Review Selectors and Run the Journey Headlessly

```text
Inspect client/src/components/TaskModal.jsx, client/src/components/TaskList.jsx, the real login page, and e2e/tests/task-journey.spec.js. Verify that selectors match the actual accessible labels, modal-opening button, task container, completion control, and deletion confirmation. Correct only necessary Playwright selectors/interactions. Do not change unrelated application code. Confirm that the test verifies task creation, status persistence after reload, and disappearance after deletion.
```

Stop manually started E2E servers before the following command so Playwright can manage both services through `webServer`. From `Demo_project/e2e/`:

```powershell
npx playwright test --repeat-each=5
```

**Target:** Five successful runs of the same independent journey. Report the real test output rather than assuming all runs pass.

## Prompt 8 — Introduce an Intentional Task Update Failure and Inspect the Trace

```text
Inspect client/src/components/TaskList.jsx and identify the exact task-update handler and identifier property. Explain whether task objects use _id or id and where they are mapped. Do not edit anything yet. If the handler uses task._id and task.id is undefined, propose the smallest TEMPORARY change from task._id to task.id to demonstrate a failed update request. If this does not match the implementation, explain why and propose an equally small, reversible task-update mistake specific to this project. Do not touch the backend, real database or unrelated functionality.
```

Apply only the confirmed, reversible client-side mistake and save the original code for restoration. From `Demo_project/e2e/`:

```powershell
npx playwright test
```

Expected **type** of failure: the task-completion assertion fails and a failed PATCH/update request appears in the trace. In the reference demo, the erroneous path is `/api/v1/tasks/undefined`; your project may behave differently.

Use the trace path printed by Playwright:

```powershell
npx playwright show-trace "test-results/<actual-folder-name>/trace.zip"
```

Inspect **Actions**, **Snapshot**, **Network**, **Console**, and **Errors**. Identify the actual failed request and do not invent an HTTP status code.

## Prompt 9 — Restore the Application and Verify Final Success

```text
Restore only the original task identifier or other temporary task-update code changed for the intentional failure. Verify that client/src/components/TaskList.jsx matches its pre-demonstration behavior. Confirm that the isolated database configuration remains separate from development/production, that the unreliable recorded.spec.js is removed, and that only the reliable task-journey.spec.js remains. Do not change unrelated files or loosen test expectations. List all modified files and any outstanding project-specific issues.
```

From `Demo_project/e2e/`:

```powershell
npx playwright test
```

**Target:** One passing login → create → complete → delete test, with the intentional application error completely reverted.

## Final Recording Checklist

- [ ] `server/scripts/e2e-server.js` is in the backend scripts folder and starts an isolated test database.
- [ ] `client/.env.e2e` points to the dedicated E2E API using the actual supported variable name.
- [ ] API (`3001`) and client (`5174`) startup scripts exist and work.
- [ ] `e2e/playwright.config.js` starts both services and retains failure traces.
- [ ] Codegen captures the TaskModal-based journey.
- [ ] The recorded test's reliability weaknesses are demonstrated.
- [ ] The final test registers its own unique user and creates its own task.
- [ ] Stable selectors and assertions verify creation, completion, persistence and deletion.
- [ ] The final test passes repeated headless runs.
- [ ] A temporary update failure generates a usable trace.
- [ ] The Trace Viewer is used to identify the failed network request.
- [ ] The temporary code change is reverted and the final test passes.

**Recording note:** Reference outputs in the demo are illustrative; use actual test counts, routes, status codes, trace paths and accessible element names from the local project.
