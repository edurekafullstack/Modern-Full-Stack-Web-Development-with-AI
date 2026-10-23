# Modelling Relationships with References and populate() — Claude Code Prompts

## Prompt 1 — Step 2: Plan the Relationship with Claude Code

We need to model a relationship between tasks and projects.



Requirements:

\- Users organize tasks into projects.

\- A project has a name and optional description.

\- A task belongs to at most one project.

\- A project can contain many tasks without a fixed limit.

\- Projects can be created and renamed independently.

\- Clients need to list tasks by project.

\- Task responses should include the project's name.



Should we embed project details inside tasks or reference

a separate Project document?



Recommend an approach and explain why.



Do not modify any files yet.

## Prompt 2 — Step 3: Create the Project Model and Endpoints

Create src/models/project.model.js with:



\- A required, trimmed name with a maximum of 80 characters.

\- An optional description with a maximum of 500 characters.

\- Automatic timestamps.



Then create a project service, controller, and router

with two endpoints:



POST / - Create a project.

GET / - List projects.



Follow the same layered structure and response helpers

used by the task resource.



Mount the project router at /projects in src/routes/index.js.

## Prompt 3 — Step 4: Add a Project Reference to the Task Model

Update the Task model to support project relationships.



Add an optional project field using

mongoose.Schema.Types.ObjectId with ref: 'Project'.



Add an index on the project field.



Allow project to be provided when creating a task

and changed through PATCH by adding it to the

controller's allowed update fields.



Update findAll to accept an optional project filter

alongside status.



Read the project filter from the query string in getTasks.



Preserve the existing task validation rules and endpoints.

## Prompt 4 — Step 6: Retrieve Related Data with populate()

Update src/services/task.service.js to populate

the project field when reading tasks.



For findAll, include only the project's name.



For findById, include the project's name

and description.



Use populate field selection instead of

returning the entire project document.



Keep the existing filters and sorting.

## Prompt 5 — Step 7: Validate That Referenced Projects Exist

Update src/services/task.service.js to validate project

references before creating or updating tasks.



Use Project.exists to check whether the referenced

project exists.



If it does not exist, throw an error with:

\- Message: "Project \<id> not found"

\- statusCode: 400



Apply this check in both create and updateById.



Populate the project name in the task returned by create.



Preserve the existing update validation and field restrictions.

## Prompt 6 — Step 8: Compare Embedding and Referencing

Suppose each task also needs a short checklist

of sub-items.



Each checklist item has:

\- A label

\- A done flag



Checklist items are only displayed and edited

as part of their parent task.



Should we embed or reference the checklist?



Compare this decision with the project relationship.



Do not modify any files.
