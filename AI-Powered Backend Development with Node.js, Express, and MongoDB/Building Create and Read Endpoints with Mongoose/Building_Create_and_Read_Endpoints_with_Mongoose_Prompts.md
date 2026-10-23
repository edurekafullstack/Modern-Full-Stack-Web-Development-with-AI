# Building Create and Read Endpoints with Mongoose — Claude Code Prompts

## Prompt 1

We're moving the task API from the in-memory array

to the Task model in src/models/task.model.js.



Before changing any code, plan three endpoints

under /api/v1/tasks:



1\. Create a task.

2\. List tasks with an optional status filter.

3\. Get one task by id.



For each endpoint, provide:

\- HTTP method and path

\- Mongoose method

\- Expected status codes

\- Error cases, including missing tasks and malformed ids



Also list which files need to change.



Don't modify any files yet.

## Prompt 2

Rewrite src/services/task.service.js to use the Task model

and remove the in-memory array.



Keep findAll, which accepts an optional status filter

and sorts by due date, and keep findById.



Add a create function using Task.create.



Update task.controller.js so getTasks and getTaskById

are async and await the service.



Add an async createTask controller that creates a task

from the request body and returns 201 using the

existing success helper.



Register POST / in task.routes.js.



Temporarily remove validateTaskId from GET /:id,

because it only accepts numeric ids.



Preserve the existing response formats.

Review and apply the changes.

## Prompt 3

Replace src/middleware/validateTaskId.js

with src/middleware/validateObjectId.js.



Use mongoose.isValidObjectId to validate req.params.id.



If the id is malformed, return HTTP 400 using

the existing failure helper.



Apply the middleware only to GET /:id

in task.routes.js.



Delete the old validateTaskId.js file.



Do not change the service or controller logic.

