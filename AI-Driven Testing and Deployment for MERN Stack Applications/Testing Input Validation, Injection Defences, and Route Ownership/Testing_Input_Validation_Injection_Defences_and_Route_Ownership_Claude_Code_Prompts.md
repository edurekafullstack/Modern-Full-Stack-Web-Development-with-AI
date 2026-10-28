# Testing Input Validation, Injection Defences, and Route Ownership — Claude Code Prompts

**Week 1 · Activity 3 · Step 14**  
**Project:** Existing `Demo_project` MERN application  
**Run commands from:** `Demo_project/server/`, unless otherwise stated.

## File Placement and Project Structure

```text
Demo_project/
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── validators/
│   │   │   ├── task.validators.js       # Review and fix type-first checks
│   │   │   └── auth.validators.js       # Review and fix type-first checks
│   │   ├── middleware/
│   │   │   └── protect.js               # Inspect; do not weaken
│   │   └── services/
│   │       └── task.service.js          # Inspect ownership; temporary fault demos
│   ├── tests/
│   │   ├── input-security.test.js       # NEW: negative and injection-style tests
│   │   ├── authorization.test.js        # MODIFY: assert record survives failed deletion
│   │   ├── factories.js                # Existing factory helpers
│   │   ├── setup-db.js                 # Existing shared in-memory DB lifecycle
│   │   └── helpers/
│   │       └── auth.js                  # Existing auth helpers
│   └── package.json
└── client/
```

**Important:** These paths are based on the supplied recording plan. Verify actual file names, route definitions, model exports, body limits and test count in the local project before editing. Keep all deliberate security regressions confined to the isolated local test environment, and restore the safe implementation afterward.

## Before Recording — Verify the Baseline

From the repository root:

```powershell
git branch -a
cd server
npm install
npm test
```

Use `w1-s14-start` only if that branch exists. Record the actual baseline count; **55 tests is a reference target, not an assumed result**.

## Prompt 1 — Map Existing Security Controls

Copy into Claude Code from the repository root:

```text
Inspect server/src and server/tests. List every request-validation, JWT authentication, role-authorisation, task-ownership, allowed-update-field, and request-body-size control.

For each control, give the exact file/function, expected HTTP behaviour, and existing tests that exercise it. Identify coverage gaps without duplicating established ownership tests.

Check the actual JSON body-size limit, task-title length rules, supported status and priority values, and existing API route paths.

Do not modify any files. Do not display environment secrets.
```

Review `server/src/validators/task.validators.js`, `server/src/validators/auth.validators.js`, `server/src/middleware/protect.js`, `server/src/services/task.service.js`, and `server/src/app.js`.

## Prompt 2 — Add Negative Input and Authentication Tests

```text
Create server/tests/input-security.test.js using the project's existing Jest, Supertest, test factories, authentication helpers and shared MongoDB Memory Server setup.

Use it.each to test POST /api/v1/tasks with: missing title, blank title, title exceeding the current maximum (120 characters in the reference), object title, numeric title, invalid status, and malformed due date.

For each invalid request, assert HTTP 400 and that no task record was created. Add a test that posts a JSON body above the configured size limit (10 KB in the reference) and expects HTTP 413 with no new task record.

Test protected GET, POST, PATCH and DELETE task routes without an authentication token, expecting HTTP 401. Use a syntactically valid but nonexistent ObjectId for single-task paths. Adapt assertions to real model exports and response shapes.

Do not modify validators or application source yet, and do not weaken or duplicate existing tests. Show changes for review.
```

Run from `server/`:

```powershell
npm test -- tests/input-security.test.js
```

In the reference demo, object and numeric titles unexpectedly return 201; the actual output may differ. Capture real failures rather than manufacturing them.

## Prompt 3 — Extend Tests for Injection-Style Inputs

```text
Extend server/tests/input-security.test.js with safe, local injection-style regression tests. Test:
- a MongoDB operator object as a login email;
- a MongoDB operator object as a login password;
- an operator object as the task title in a PATCH request;
- a $set-style object in an attempted task update;
- owner and operator-like query parameters on GET /api/v1/tasks;
- an operator-like value in a task ID path.

Use fictional local test data and existing factories. Check appropriate HTTP responses and, crucially, that unauthorised records are never returned or changed. A rejected invalid request should produce a controlled 4xx response rather than a 500 where input validation applies.

Match the project's actual task-list response structure and user ownership representation. Do not modify application code. Show the proposed tests before applying.
```

Run:

```powershell
npm test -- tests/input-security.test.js
```

The reference plan describes four failing cases before remediation. Report only actual results.

## Prompt 4 — Correct Type Validation Before Sanitisation

```text
Inspect server/src/validators/task.validators.js and server/src/validators/auth.validators.js. Diagnose any input chains that convert non-string values before checking their types.

For task titles, names and passwords, reject objects, arrays, numbers and other invalid non-string inputs with HTTP 400. Check type first with isString() and bail() before trim() or other coercing sanitisers. Preserve clear required-field errors and all existing length, email, due-date, status and priority rules. Apply the same strategy to optional task-title PATCH updates only when the field is supplied.

Do not change authentication behaviour, route ownership logic, unrelated files or existing test expectations. Show the minimal proposed diff for review, then run the targeted and full server suites.
```

Reference validation order (adapt to actual existing chain):

```js
body('title')
  .exists()
  .withMessage('Title is required')
  .bail()
  .isString()
  .withMessage('Title must be text')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Title is required')
  .bail()
  .isLength({ max: 120 })
  .withMessage('Title must be 120 characters or fewer');
```

Verify:

```powershell
npm test -- tests/input-security.test.js
npm test
```

## Prompt 5 — Inspect Ownership Regression Coverage

```text
Inspect server/src/services/task.service.js and server/tests/authorization.test.js. Explain exactly how getTask() and canAccess() protect retrieval, modification and deletion, and identify the assertions that should fail if access control is absent.

Do not change files. Describe a reversible local-only test demonstration and the expected behaviour; verify that the test database is isolated before proceeding.
```

**Manual demonstration only in an isolated test checkout:** Temporarily disable the existing `if (!canAccess(task, user))` guard in `getTask()` and run:

```powershell
npm test -- tests/authorization.test.js
```

Observe whether tests detect another user reading, updating or deleting an owned task. **Immediately restore the original ownership guard**, then rerun the tests to confirm normal behaviour. Do not commit or deploy the deliberate fault.

## Prompt 6 — Strengthen the Rejected-Deletion Test

```text
Inspect the existing forbidden-delete test in server/tests/authorization.test.js. Strengthen it so that, after a different user attempts to delete an owned task, the test checks both the HTTP 403 response and that the original task still exists in MongoDB.

Use the actual Task model export and the existing task fixture. Preserve existing assertions, shared setup and application source. Show the minimal test-only diff. Do not change the deletion service yet.
```

The key assertion in the reference is:

```js
expect(res.status).toBe(403);
expect(await Task.exists({ _id: task._id })).not.toBeNull();
```

## Prompt 7 — Demonstrate and Restore Delete-Before-Authorise Failure

```text
Inspect deleteTask() in server/src/services/task.service.js. Explain why deleting a task before verifying ownership could still return HTTP 403 while wrongly removing the record. Identify the secure existing deletion sequence and how the strengthened database-state test would detect the faulty order.

Do not apply a change yet. Give exact instructions for a short, reversible experiment confined to the local isolated test environment, plus an explicit restoration step. Do not touch other files.
```

For the **controlled recording demonstration only**, temporarily reorder the existing deletion flow so deletion occurs before its ownership check, keeping enough of the existing behaviour to demonstrate a forbidden response. Run:

```powershell
npm test -- tests/authorization.test.js
```

The stronger test should detect the removed record even if the response is 403. **Restore the original secure implementation immediately**. The secure principle is to authorise first, then delete:

```js
const task = await getTask(id, user); // checks ownership
await Task.deleteOne({ _id: task._id });
```

Use the project's original equivalent logic rather than rewriting unrelated service behaviour.

## Prompt 8 — Final Test and Restoration Audit

```text
Review the changes made for this demo. Confirm that every temporary ownership bypass or delete-before-authorise experiment has been fully reverted, type-first validation remains in place, and the forbidden-delete test verifies that the database record survives.

Run the full server Jest suite. Report the actual test count, failures if any, and files changed. Identify any unintended changes or remaining security gaps. Do not claim 55 passing tests unless the test output confirms it. Do not modify unrelated code or expose secrets.
```

Final command from `server/`:

```powershell
npm test
```

## Recording Checkpoints

1. **Inspect** existing validators, JWT middleware, task ownership logic and body-size configuration.
2. **Add negative tests** covering malformed bodies, oversized payloads and unauthenticated requests.
3. **Add injection-style tests** and diagnose object-to-string coercion.
4. **Fix validators** by checking types before sanitising; verify the full suite.
5. **Temporarily bypass ownership locally**, observe failed authorisation tests, and restore the guard.
6. **Strengthen forbidden deletion checks** with a database-existence assertion.
7. **Temporarily test delete-before-authorise**, observe the strengthened test fail, and restore secure order.
8. **Run the complete backend suite** and confirm no deliberate faults remain.

## Final Verification Checklist

- [ ] Existing project and baseline tests verified.
- [ ] `server/tests/input-security.test.js` created in the correct backend folder.
- [ ] Invalid input cases return controlled 4xx responses with no unwanted database writes.
- [ ] Oversized JSON body and missing-token tests use verified route and size settings.
- [ ] Injection-style payloads do not bypass authentication or ownership.
- [ ] Validators reject non-string input before trimming or coercion.
- [ ] Existing required-field and business validation rules remain intact.
- [ ] Temporary ownership bypass is completely restored.
- [ ] Rejected deletion leaves the original task in the database.
- [ ] Temporary delete-before-authorise logic is completely restored.
- [ ] Final `npm test` completes, with the **actual** passing-test count recorded.
- [ ] No temporary security weaknesses are committed or deployed.
