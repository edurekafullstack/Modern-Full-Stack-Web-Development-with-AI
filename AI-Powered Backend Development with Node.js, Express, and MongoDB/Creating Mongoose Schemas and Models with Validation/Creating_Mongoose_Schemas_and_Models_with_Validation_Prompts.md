# Creating Mongoose Schemas and Models with Validation — Claude Code Prompts

## Prompt 1 — Step 2: Define the Task Requirements with Claude Code

We're creating a Mongoose model for tasks.



Requirements:

\- Every task must have a title between 3 and 100 characters.

\- Description is optional, with a maximum of 500 characters.

\- Status must be todo, in-progress, or done. Default is todo.

\- Priority must be low, medium, or high. Default is medium.

\- Due date is optional but must be in the future.

\- Record creation and update timestamps.

\- Support filtering by status and sorting by due date.



Before writing code, create a field plan showing each field's

type, whether it is required, its default, and validation rules.



Identify any requirements that need schema options,

custom validators, or indexes.



Do not create files yet.

## Prompt 2 — Step 3: Generate the Mongoose Schema and Model

Create src/models/task.model.js using our agreed field plan.



Use custom error messages for required fields, minimum length,

maximum length, and enum validation.



Include the rejected value in enum error messages.



Enable automatic timestamps.



Leave out the custom due-date validator and compound index

for now.



Export the model as a named export called Task.

Review and approve the generated file.

## Prompt 3 — Step 5: Add a Custom Validator and Compound Index

Update src/models/task.model.js.



Add a custom validator to dueDate that rejects dates

that are not in the future.



Use this error message:

"Due date must be in the future"



Also add a compound index on status and dueDate

to support filtering tasks by status and sorting

them by due date.



Do not modify the existing field rules.

## Prompt 4 — Step 6: Create a Temporary Model Testing Script

Create a temporary script at scripts/try-task-model.js.



The script should:



1\. Connect to MongoDB using connectDB.

2\. Create one valid task with a padded title,

   high priority, and a due date one week from now.

3\. Log the saved document.

4\. Attempt to create another task with:

   - An empty title

   - Status "blocked"

   - Priority "urgent"

   - A due date in 2020

5\. Catch the validation error and print the error name,

   each failing path, its kind, and message.

6\. Disconnect from MongoDB.



Mark the script as temporary.

