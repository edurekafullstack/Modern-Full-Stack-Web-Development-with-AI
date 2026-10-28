# Measuring Express API Latency Under Controlled Load — Claude Code Prompts

## Project Setup and File Placement

Use the existing `Demo_project` Express backend at the repository root (not inside `client`). Prepare `scripts/perf-server.js` **before recording**. Create `scripts/load-test.js` **during recording** using Claude Code.

```text
Demo_project/
├── scripts/
│   ├── perf-server.js       # Prepared before recording
│   └── load-test.js         # Created during the demo
├── perf/
│   ├── token.txt            # Generated; do not commit
│   ├── baseline.json
│   ├── baseline-2.json
│   ├── me.json
│   ├── health.json
│   ├── small-dataset.json
│   └── baseline-notes.md
├── src/
│   └── services/
│       └── task.service.js
├── client/
├── package.json
└── .gitignore
```

### Before Recording: Performance Server

Place the prepared performance server at `Demo_project/scripts/perf-server.js`. Verify that it starts an isolated MongoDB Memory Server on port `27018`, seeds 50 users and 100,000 tasks by default, starts the API on port `3002`, writes a test bearer token to `perf/token.txt`, and accepts an optional task count (such as `1000`). Confirm the actual implementation and API routes in your project; these behaviors are requirements, not a claim that the file already exists.

Add this script to the **existing** root `package.json` scripts without replacing other entries:

```json
"perf:server": "node scripts/perf-server.js"
```

Add `perf/token.txt` to `.gitignore` to avoid committing credentials. Ensure the backend dependencies, including MongoDB Memory Server, are installed.

Run from the project root:

```powershell
npm install
npm run perf:server
```

Expected behavior: 50 users and 100,000 tasks are seeded into the isolated test database and the API listens on port `3002`. Leave this terminal running.

## Prompt 1 — Generate the Load-Test Script

Create `scripts/load-test.js` using the `autocannon` programmatic API for our existing Express application.

Requirements:

1. Accept a run label and optional endpoint path from command-line arguments.
2. Default to `/api/v1/tasks?status=todo`.
3. Target `http://localhost:3002`.
4. Read the bearer token from `perf/token.txt` and attach it to requests where needed.
5. Use 10 concurrent connections.
6. Run a 5-second warm-up and discard its measurements.
7. Run a separate 20-second measurement.
8. Report requests per second, p50, p97.5, p99, maximum latency, total requests, failures, and error rate.
9. Count non-2xx HTTP responses, connection errors, and timeouts as failures; do not treat fast error responses as successful throughput.
10. Save the results to `perf/<label>.json`, creating the directory if necessary.
11. Add a `load-test` npm script to the existing root `package.json` without deleting other scripts.
12. Preserve all existing API files, endpoints, and business logic.

Before making changes, inspect the current project layout and reuse its conventions.

### Run the Baseline

Install autocannon in the backend root if needed:

```powershell
npm install -D autocannon
```

In a second terminal, run:

```powershell
npm run load-test -- baseline
npm run load-test -- baseline-2
```

Confirm that `perf/baseline.json` and `perf/baseline-2.json` exist. Compare the measured throughput, latency percentiles, and error rates. Actual numbers depend on the machine.

## Prompt 2 — Compare Control Endpoints

Inspect the existing Express routes and verify whether `/api/v1/auth/me` and `/api/v1/health` exist. Confirm that the health endpoint does not query MongoDB before using it as a lightweight control. Do not modify application files or invent replacement endpoints. Report any mismatch before testing.

After verification, run:

```powershell
npm run load-test -- me /api/v1/auth/me
npm run load-test -- health /api/v1/health
```

For a smaller dataset, stop the performance server and restart it from the project root:

```powershell
npm run perf:server -- 1000
```

Then run in the second terminal:

```powershell
npm run load-test -- small-dataset
```

Preserve the original baseline JSON files when changing the dataset size.

## Prompt 3 — Analyze the Performance Evidence

Read the performance JSON files in `perf/` and inspect `src/services/task.service.js`.

Based only on the available measurements and source code, identify where time is likely being spent in `GET /api/v1/tasks?status=todo`.

Requirements:

1. Compare the task-list endpoint with the authentication and health controls.
2. Compare the 100,000-task and 1,000-task datasets.
3. Explain relevant filtering, sorting, pagination, and counting operations found in the service.
4. Separate directly supported findings from hypotheses requiring MongoDB explain-plan evidence.
5. Do not claim that missing indexes or a specific index improvement are confirmed without measurements.
6. Do not modify application code or add indexes.

## Prompt 4 — Record the Baseline Findings

Create `perf/baseline-notes.md` using the **actual** saved measurements.

Include:

1. Endpoint and test environment.
2. Dataset size and connection count.
3. Warm-up duration and measurement duration.
4. Throughput, p50, p97.5, p99, maximum latency, and error rate.
5. A concise comparison of the task-list, authentication, and health endpoints.
6. A comparison of large and small datasets.
7. Supported conclusions and unverified hypotheses in separate sections.
8. A note that MongoDB query plans and indexes will be investigated in the next demo.

Do not invent results or overwrite the original performance JSON files.

## Final Verification

- `scripts/perf-server.js` is prepared before the recording.
- `scripts/load-test.js` is created with Claude Code during the recording.
- The isolated test API runs on port `3002` and MongoDB Memory Server uses port `27018`.
- `perf/token.txt` is excluded from Git.
- Both baseline runs and all control/small-dataset tests save separate JSON files.
- Non-2xx responses and network failures are counted.
- `perf/baseline-notes.md` uses measured rather than illustrative values.
- No database indexes or business-logic optimizations are introduced in this demo.
