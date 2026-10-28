# Creating Regression Tests with Claude Code from a Fixed Incident — Claude Code Prompts

**Week 3 · Activity 2 · Step 10**  
**Project:** Existing `Demo_project` MERN application  
**Goal:** Convert the fixed Load more pagination incident into deterministic API regression tests, verify the fix, and document evidence.

## File Placement

```text
Demo_project/
├── docs/
│   └── incidents/
│       └── load-more-pagination.md   # Existing incident log; update at end
└── server/
    ├── src/
    │   ├── controllers/
    │   │   └── task.controller.js    # Validated pagination parameters
    │   ├── services/
    │   │   └── task.service.js       # Task query and sorting
    │   ├── models/
    │   │   └── task.model.js         # Relevant MongoDB indexes
    │   └── utils/
    │       └── listQuery.js          # If present, shared sorting/pagination helpers
    ├── tests/
    │   ├── pagination.test.js        # CREATE for this demo
    │   ├── tasks.test.js             # Existing tests; preserve
    │   └── factories.js             # Existing data factories, if present
    └── package.json
```

**Important:** Confirm where `package.json`, the Jest tests, controller, service, and incident file actually reside before using these paths. The reference has conflicting pagination response examples (`data.items`/`data.nextPage` versus `data.tasks`/`data.pagination`). **Use the real API contract**, not an invented one. The reference's 71-test total is illustrative, not a guaranteed outcome.

## Before Recording — Check the Starting Point

From `Demo_project`:

```bash
git status --short
git branch -a
cd server
npm install
npm test
```

Check whether the incident file exists and read it. Confirm whether `w3-s10-start` and `w3-s04-start` really exist and contain the expected versions. Do not check out a branch or overwrite a controller while the working tree contains unpreserved changes.

## Prompt 1 — Inspect the Incident and API Contract

Copy into Claude Code, starting from **`Demo_project` root**:

```text
Read docs/incidents/load-more-pagination.md and inspect server/src/controllers/task.controller.js, server/src/services/task.service.js, server/src/models/task.model.js, server/src/utils/listQuery.js (if present), and server/tests/tasks.test.js.

Summarise the original Load more bug, its verified cause, the working fix, and the regression tests already present.

Determine the REAL API pagination contract: request query parameters, response collection key, page size, page metadata, last-page behaviour, validation limits, and sorting fields. State explicitly whether nextPage exists or pagination must be computed from page/totalPages.

Also verify existing authentication/test helpers and any database indexes supporting the sort. Identify which paths differ from the reference demo.

Do not change files yet. Do not assume historical Git checkpoints exist.
```

**What to show:** The original issue involved pagination values read as strings; concatenating the string `"2"` with `1` produced `"21"` rather than `3`. The corrected controller should use reliably validated/coerced values, such as values returned by `matchedData()` where applicable.

## Prompt 2 — Propose Regression Test Cases

```text
Using the verified incident report and current task API contract, propose API-level regression tests with Jest and Supertest.

Cover: (1) complete multi-page Load more retrieval, (2) the final page, (3) a request beyond the final page, (4) the maximum allowed page size, and (5) invalid page values including page=0 and page=abc.

For every proposal, explain which user-visible behaviour it protects, whether it would fail against the original string-page bug, and whether an existing test already covers it.

Prefer deterministic integration tests with the existing MongoDB Memory Server and factories. Do not modify any files.
```

Select the complete journey first. Avoid duplicate tests, snapshots, and unit tests that bypass the HTTP request boundary where the original bug occurred.

## Prompt 3 — Create `server/tests/pagination.test.js`

```text
Implement the five selected categories in a NEW file: server/tests/pagination.test.js.

Use the project's existing Jest, Supertest, test database setup, user factory, task factory, and auth header helper. Seed 25 tasks belonging to one authenticated test user.

Implement a complete pagination journey by following the API's REAL response contract: use nextPage if it exists; otherwise, advance using data.pagination.page and data.pagination.totalPages (or the verified equivalent). Include a maximum-request guard.

Assert that all 25 created IDs are returned exactly once: check result count, unique ID count, and equality with the seeded ID set. Avoid relying on order or database records from other tests.

Also test final-page results, a request beyond the last page, the verified maximum page-size rule (50 only if the implementation supports that cap), and invalid page=0/page=abc inputs.

Make all expected statuses and paths match existing route validation. Do not modify production code, existing tests, or validators. Show the created file and describe each test.
```

Run from `Demo_project/server`:

```bash
npm test -- tests/pagination.test.js
```

**Expected behaviour:** The test file runs against the current application. Do not claim that it will necessarily fail or pass in a particular way; compare actual returned IDs, pagination metadata, and assertions.

## Prompt 4 — Diagnose Unstable Pagination Ordering (Only if Evidence Supports It)

```text
Review the pagination test results. If multi-page retrieval shows duplicate IDs or missing IDs while the total count is correct, investigate whether the task query sorts only by createdAt and multiple tasks share identical timestamps.

Inspect the service, the shared query helper if present, and the relevant Mongoose indexes. Identify whether sorting is deterministic. Show evidence before changing code.

Propose the smallest correction: sort by createdAt descending and _id descending where that matches the existing sort contract, and adjust the indexes needed for the actual filter patterns.

Do not modify tests or production files until you have explained the diagnosis and proposed exact changes. If the current code already uses a unique tie-breaker, report that instead of inventing this defect.
```

If confirmed, apply a focused follow-up prompt:

```text
Apply the reviewed deterministic sorting fix to the actual query implementation (src/services/task.service.js or src/utils/listQuery.js, whichever owns the sort).

Preserve permissions, filters, response fields, and pagination semantics. Add _id: -1 after createdAt: -1. Review relevant indexes in src/models/task.model.js and update only those that should support this query shape. Do not change regression test expectations to hide the defect.

Show the exact diff and rerun the pagination tests.
```

The intended sort, if appropriate, is:

```js
.sort({ createdAt: -1, _id: -1 })
```

Index examples (adapt to real query filters, **do not add blindly**):

```js
taskSchema.index({ owner: 1, createdAt: -1, _id: -1 });
taskSchema.index({ owner: 1, status: 1, createdAt: -1, _id: -1 });
```

Run:

```bash
npm test -- tests/pagination.test.js
npm test
```

## Prompt 5 — Plan a Safe Original-Defect Reproduction

```text
Check git status and verify whether the historical w3-s04-start checkpoint exists and actually contains the original pagination controller defect.

If that checkpoint is unavailable, inspect the incident documentation and propose a temporary isolated simulation of the string-page defect, without changing the working controller yet.

Explain exactly how to save the current corrected implementation, which tests should fail against the defective version, and how to restore and verify the corrected file. Do not modify or overwrite application files yet. Never claim the historical defect was reproduced without an actual failing test run.
```

**Do not perform the fault injection on production or shared environments.** Preserve the working controller before any experiment; preferably use a disposable Git worktree or a separately copied test project.

### If a verified historical checkpoint exists

Run from `Demo_project` only after preserving all current changes:

```bash
git show w3-s04-start:server/src/controllers/task.controller.js
```

Review that file before replacing anything. If the correct path is different, adjust it.

### If there is no historical checkpoint

Keep the original working file untouched. Use Claude Code to prepare and run a controlled defect simulation in a disposable copy. Record that it was a **simulation**, not the historical commit.

## Prompt 6 — Verify the Regression Tests Against the Defect

```text
In a disposable copy or verified isolated worktree, run the new pagination tests and the existing task tests against the original defective controller (if verifiably available) or a clearly labelled simulated string-page defect.

Record which tests fail and why. In particular check whether the full 25-task journey stops early because the page number is concatenated as a string. Keep the failing output as evidence.

Restore the corrected controller from the saved known-good version, NOT from HEAD unless HEAD has been verified as corrected. Rerun the same tests, then the full backend suite.

Do not leave any defective code or weaken tests. Report actual results and test totals only.
```

Commands to execute from `Demo_project/server` after intentionally applying the defect **only in the isolated copy**:

```bash
npm test -- tests/pagination.test.js tests/tasks.test.js
```

Restore the known-good implementation, then:

```bash
npm test -- tests/pagination.test.js tests/tasks.test.js
npm test
```

**Interpretation:** A strong regression test should fail when the original behaviour is broken and pass when the verified correction is restored.

## Prompt 7 — Update the Incident Report

```text
Update docs/incidents/load-more-pagination.md with a section named "Regression Verification".

Document:
- The tests added in server/tests/pagination.test.js.
- The measured result of the 25-task complete pagination journey.
- Whether deterministic _id sorting was already implemented or had to be added, and its actual source location.
- Whether supporting MongoDB indexes were changed, inspected only, or remain pending review.
- Whether the experiment used the verified historical checkpoint or an isolated simulation.
- Exactly which tests failed against the defect and which passed after restoring the fix.
- The final observed test totals.

Do not claim 71 passing tests, updated indexes, or historical Git restoration unless the actual project evidence proves those results. Do not modify application source or tests for this documentation step.
```

## Final Demo Commands

Use the project's real backend directory and test script:

```bash
npm test -- tests/pagination.test.js
npm test -- tests/pagination.test.js tests/tasks.test.js
npm test
```

## Final Verification Checklist

- [ ] Existing incident document and real API response contract inspected.
- [ ] New test file at `server/tests/pagination.test.js`.
- [ ] All 25 seeded tasks belong to the authenticated user.
- [ ] Multi-page test checks counts, identity set, and duplicates.
- [ ] A maximum request guard prevents infinite traversal.
- [ ] Final-page, beyond-last-page, page-size, and invalid-input cases covered.
- [ ] Sorting and indexes verified; corrections made only if supported by evidence.
- [ ] Defect reproduction run only in a disposable environment.
- [ ] Corrected implementation restored and full tests rerun.
- [ ] `docs/incidents/load-more-pagination.md` updated with accurate evidence.
- [ ] No temporary defective code remains.

**Recording note:** The demo is aimed at roughly seven minutes. Prepare test dependencies and checkpoint verification before recording. Show actual test output rather than copying the reference's 71-test count.
