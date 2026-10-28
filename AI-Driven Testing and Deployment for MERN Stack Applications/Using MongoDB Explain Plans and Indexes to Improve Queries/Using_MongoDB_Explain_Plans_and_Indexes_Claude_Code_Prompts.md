# Using MongoDB Explain Plans and Indexes to Improve Queries — Claude Code Prompts

## Project Setup and File Placement

Use the existing `Demo_project` with the Express backend at the repository root. This demo continues the previous API latency test; **do not recreate** the performance server or load-test script.

```text
Demo_project/
├── scripts/
│   ├── perf-server.js       # Prepared in the previous demo
│   └── load-test.js         # Created in the previous demo
├── perf/
│   ├── token.txt            # Generated; do not commit
│   ├── baseline.json        # Previous demo's measurement
│   ├── after-index.json     # Generated during this demo
│   └── baseline-notes.md    # Updated at the end
├── src/
│   ├── models/
│   │   └── task.model.js    # Persist indexes here at the end
│   └── services/
│       └── task.service.js
├── client/
│   └── src/components/TaskList.jsx
└── package.json
```

Before recording, verify that `npm run perf:server` starts the seeded API on port 3002 with MongoDB on port 27018, and `npm run load-test -- baseline` is supported. Preserve `perf/baseline.json`. Do not add the proposed indexes before recording. The optional Git checkpoint `w2-s04-start` should only be used if it exists and preserves the required baseline.

## Step 1 — Trace Slow Queries

From the project root, start the server:

```powershell
npm install
npm run perf:server
```

In a second terminal:

```powershell
npx mongosh mongodb://127.0.0.1:27018/perf
```

In `mongosh`:

```javascript
db.setProfilingLevel(1, { slowms: 20 })
```

In another PowerShell terminal:

```powershell
$token = (Get-Content .\perf\token.txt -Raw).Trim()
curl.exe -H "Authorization: Bearer $token" "http://localhost:3002/api/v1/tasks?status=todo"
```

Back in `mongosh`:

```javascript
db.system.profile.find(
  { ns: 'perf.tasks' },
  { op: 1, command: 1, planSummary: 1, keysExamined: 1, docsExamined: 1, nreturned: 1, millis: 1 }
).sort({ ts: -1 }).limit(2)
```

## Step 2 — Inspect the Explain Plan

In `mongosh`:

```javascript
const owner = db.users.findOne({ email: 'load1@example.com' })._id

db.tasks.find({ owner, status: 'todo' })
  .sort({ createdAt: -1 })
  .limit(10)
  .explain('executionStats')
```

Record the actual winning plan, `totalDocsExamined`, `totalKeysExamined`, and `nReturned`. The reference demo illustrates `COLLSCAN` and `SORT`, but your actual results may differ.

## Prompt 1 — Propose a Compound Index

The task-list query filters tasks by owner and status, sorts by createdAt descending, and limits the result to 10 records.

The countDocuments operation uses the same filter.

MongoDB explain shows a COLLSCAN examining 100,000 documents and an in-memory SORT in the reference walkthrough. Check our actual query and explain output before accepting that diagnosis.

Propose one compound index that improves both queries. Explain the order of indexed fields and how the index supports filtering, sorting, and counting.

Do not modify any files yet.

## Step 3 — Test the First Index

In `mongosh`, create the proposed index:

```javascript
db.tasks.createIndex({ owner: 1, status: 1, createdAt: -1 })

db.tasks.find({ owner, status: 'todo' })
  .sort({ createdAt: -1 })
  .limit(10)
  .explain('executionStats')
```

Inspect the count query by temporarily capturing all operations:

```javascript
db.setProfilingLevel(1, { slowms: 0 })
```

Repeat the authenticated API request and inspect `db.system.profile` again. **Disable profiling before the load test:**

```javascript
db.setProfilingLevel(0)
```

From the backend root:

```powershell
npm run load-test -- after-index
```

Verify that `perf/after-index.json` exists and compare it with the original `perf/baseline.json`. Do not overwrite the baseline or present reference measurements as actual results.

## Prompt 2 — Analyze Query Coverage

Inspect the existing React client and Express API.

List every query executed against the tasks collection, including its filters and sort order.

Determine whether the compound index `{ owner: 1, status: 1, createdAt: -1 }` fully supports each query.

Identify any frequently used query that may require a different index.

Do not modify any files yet.

## Step 4 — Test the Unfiltered Task List

In `mongosh`:

```javascript
db.tasks.find({ owner })
  .sort({ createdAt: -1 })
  .limit(10)
  .explain('executionStats')
```

If this query needs a separate sort or examines excessive keys, test:

```javascript
db.tasks.createIndex({ owner: 1, createdAt: -1 })

db.tasks.find({ owner })
  .sort({ createdAt: -1 })
  .limit(10)
  .explain('executionStats')
```

Compare execution statistics. Discuss the reference experiment's trade-off: more indexes can speed reads but increase insertion cost and index storage. Do not claim write-performance measurements unless you have actually benchmarked inserts under each configuration.

## Prompt 3 — Persist Verified Indexes

Update only `src/models/task.model.js` to define the two compound indexes tested in MongoDB Shell:

- `{ owner: 1, status: 1, createdAt: -1 }` for status-filtered task lists.
- `{ owner: 1, createdAt: -1 }` for unfiltered task lists.

Use the schema variable already defined in the project and place the index declarations after the schema definition but before model creation.

Preserve existing fields, validation, model exports, and business logic. Do not change controllers, services, routes, or frontend components.

Explain how to verify that the indexes exist after restarting the performance server, noting that a fresh MongoDB Memory Server database may need indexes to be recreated.

## Step 5 — Verify and Document

After restarting the performance server and reconnecting to `mongosh`:

```javascript
db.tasks.getIndexes()
```

Confirm both compound indexes are present, then run the existing backend tests:

```powershell
npm test
```

## Prompt 4 — Record Performance Findings

Read `perf/baseline.json`, `perf/after-index.json`, and the actual MongoDB explain results available from this demo.

Update `perf/baseline-notes.md` with the measured throughput, p50, p97.5, p99, error rate, index choices, explain-plan changes, and any observed read/write trade-offs.

Separate verified measurements from hypotheses and reference-example numbers. Do not invent benchmark results or modify application code.

## Final Verification Checklist

- [ ] Previous baseline remains saved in `perf/baseline.json`.
- [ ] `scripts/perf-server.js` and `scripts/load-test.js` remain in the backend-root `scripts` directory.
- [ ] MongoDB profiler identifies task-list operations.
- [ ] Original explain statistics are recorded.
- [ ] First compound index is created and tested.
- [ ] Profiling is disabled before autocannon testing.
- [ ] `perf/after-index.json` is saved.
- [ ] Client and backend query patterns are inspected.
- [ ] Second compound index is tested for unfiltered queries.
- [ ] Index trade-offs are explained without invented results.
- [ ] Verified index definitions are saved in `src/models/task.model.js`.
- [ ] Indexes exist after restarting the seeded server.
- [ ] Backend tests are run.
- [ ] `perf/baseline-notes.md` contains actual evidence.

**Recording note:** Reference timings and throughput figures are examples, not guaranteed outcomes. Keep the original baseline for a fair comparison, and prepare long-running seeding or benchmark steps in advance.
