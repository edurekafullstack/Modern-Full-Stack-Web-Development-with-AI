# Validating Request Input and Handling Async Errors — Claude Code Prompts

## Prompt 1 — Step 2 — Generate Request Validation Rules

Install express-validator.

Create src/validators/task.validators.js exporting

taskRules({ isUpdate }).

Requirements:

- title is required on create and optional on update.

- Trim title and require 3 to 100 characters.

- description is optional, trimmed, and at most 500 characters.

- status is optional and must be todo, in-progress, or done.

- priority is optional and must be low, medium, or high.

- dueDate is optional, must be a valid ISO 8601 date,

  and must be in the future.

- project is optional and must be a valid MongoDB id.

Provide clear error messages.

Stop checking a field after its first failure when

additional checks would be meaningless.

Do not modify the routes yet.

Claude Code should install the package and generate the validation file.

## Prompt 2 — Step 3 — Add Validation Middleware and Update Routes

Create src/middleware/validate.js.

Use validationResult from express-validator.

If validation fails:

- Return HTTP 400.

- Use the existing failure helper.

- Set the message to "Validation failed".

- Include an errors array containing

  { field, message } for each validation error.

If validation passes, call next().

Update the failure helper in src/utils/response.js

to accept an optional errors array.

In task.routes.js:

- Apply taskRules() and validate before createTask.

- Apply taskRules({ isUpdate: true }) and validate

  after validateObjectId and before updateTask.

Preserve the existing response structure.

## Prompt 3 — Step 5 — Verify Express 5 Async Error Handling

Our controllers use async functions that await Mongoose calls,

and the application uses Express 5.

Do we need an asyncHandler wrapper to forward rejected

promises to the central error handler?

Explain how Express 5 handles asynchronous errors

and identify cases it does not automatically catch.

Do not modify any files.

## Prompt 4 — Step 6 — Normalize Mongoose Errors

Update src/middleware/errorHandler.js.

Add a normaliseError function that maps database errors

to consistent API responses.

Requirements:

1. Mongoose ValidationError:

   - Return 400.

   - Message: "Validation failed".

   - Include { field, message } for every invalid path.

2. Mongoose CastError:

   - Return 400.

   - Message: "Invalid value for \<path>: \<value>".

3. MongoDB duplicate-key error with code 11000:

   - Return 409.

   - Include the duplicated field in the message.

4. Preserve existing behavior for all other errors.

5. Keep the existing production-safe error message behavior.

Also make the Project model's name field unique.

Do not add an asyncHandler wrapper.
