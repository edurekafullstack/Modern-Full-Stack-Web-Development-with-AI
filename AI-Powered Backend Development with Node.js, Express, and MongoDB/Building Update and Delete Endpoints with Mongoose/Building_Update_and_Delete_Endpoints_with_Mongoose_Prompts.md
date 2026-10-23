# Building Update and Delete Endpoints with Mongoose — Claude Code Prompts

## Prompt 1 — Step 2 — Generate the PATCH Endpoint

Add an update endpoint for tasks.



In src/services/task.service.js, add updateById using

Task.findByIdAndUpdate.



Configure it to return the updated document and

run the schema validators.



In src/controllers/task.controller.js, add an async

updateTask controller.



Allow updates only to:

- title

- description

- status

- priority

- dueDate



Ignore all other request body fields.



Return 404 using the existing failure helper

if the task does not exist.



Register PATCH /:id in task.routes.js,

after validateObjectId.



Preserve the existing API response structure.

Review and apply the generated changes.

## Prompt 2 — Step 4 — Generate the DELETE Endpoint

Add a delete endpoint for tasks.



In src/services/task.service.js, add deleteById

using Task.findByIdAndDelete.



In src/controllers/task.controller.js, add an

async deleteTask controller.



If the task does not exist, return 404

using the existing failure helper.



If the task is deleted successfully,

return 204 No Content with no response body.



Register DELETE /:id in task.routes.js

after validateObjectId.



Preserve the existing route structure.

Review and apply the generated changes.
