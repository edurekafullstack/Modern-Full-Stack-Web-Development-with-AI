# Testing and Debugging Express Routes with Postman — Claude Code Prompts

## Prompt 1

After the latest change, every request to the task router returns 400 with the message "Invalid task id: undefined", including GET /api/v1/tasks and GET /api/v1/tasks/3, which should both return 200.

Routes outside the task router still pass.

The server also logs this for every task request:

Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client ... at getTasks (src/controllers/task.controller.js:7:7)

Read src/middleware/validateTaskId.js and src/routes/task.routes.js and explain the root cause.

Don’t change any files yet.

## Prompt 2

Your diagnosis matches the evidence.

Apply the minimal fix: return after sending the 400 in validateTaskId, and apply the middleware only to the GET /:id route instead of using router.use.

Don’t change anything else.

## Prompt 3

Write a commit message for this fix.

Summarise the symptom, the two root causes, and the fix in a few lines.
