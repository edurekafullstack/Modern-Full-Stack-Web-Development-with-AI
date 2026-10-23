# Testing and Debugging the Complete MERN Application End to End — Claude Code Prompts

## Step 4: Ask Claude Code to Diagnose and Compare Fixes — Prompt 1: Diagnose the Root Cause

Creating a task in the React application fails when the due date is left empty.

Evidence:

Browser request payload:\
{"title":"Write the README","dueDate":""}

API response:\
HTTP 400\
"Due date must be a valid date"

The Express validation rule is:\
body('dueDate').optional().isISO8601()

Mongoose debugging confirms that the request does not reach task insertion.

Inspect:

- client/src/components/TaskList.jsx
- server/src/validators/task.validators.js

Explain the root cause.

Compare a client-side fix with an API-side fix.

Do not change any files yet.

## Step 5: Apply the Client Fix and Verify It End to End — Prompt to Claude Code

Fix task creation in client/src/components/TaskList.jsx.

Update the create handler so that dueDate is included in the request only when the user has selected a date.

Do not change any other functionality.

Do not modify the Express API or its validation rules.

## Step 6: Add Regression Tests and Rerun the Suite — Prompt to Claude Code

Add two regression tests to server/tests/tasks.test.js.

Test 1:

- Create a task without a dueDate field.
- Expect HTTP 201.
- Verify that the created task has no due date.

Test 2:

- Create a task with dueDate set to an empty string.
- Expect HTTP 400.
- Verify that the response contains a dueDate validation error.

Use the existing authentication test helpers.

Do not change any application code or existing assertions.

## Step 7: Record the Root Cause and Fix — Prompt to Claude Code

Draft a Git commit message for the task due-date fix.

Include:

- The original symptom.
- The root cause.
- The API-side option we tested and rejected.
- Why the client-side fix was selected.
- The regression tests added.

Do not create the commit. Only draft the message.

