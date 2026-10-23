# Adding Filtering, Sorting, and Pagination to API Queries — Claude Code Prompts

## Prompt 1

Create a development-only script at scripts/seed-tasks.js.



The script should:

1\. Connect to MongoDB using connectDB.

2\. Create a project named "Load Test".

3\. Use insertMany to create 120 tasks in this project.

4\. Name the tasks "Sample task 001" through "Sample task 120".

5\. Cycle status through todo, in-progress, and done.

6\. Vary the priority values.

7\. Assign due dates between 1 and 120 days from now.

8\. Log the generated project ID.

9\. Disconnect from MongoDB.



Do not modify the existing API files.

## Prompt 2

Plan query-string support for GET /api/v1/tasks.



Clients should be able to:

\- Filter by status, priority, and project.

\- Provide multiple values for the same filter.

\- Sort by one or more approved fields.

\- Use ascending and descending sort order.

\- Request a specific page and page size.



Define:

\- Each parameter's format and default.

\- The maximum allowed page size.

\- Which fields can be sorted.

\- How invalid values are handled.

\- How unknown parameters are handled.



Do not modify any files yet.

## Prompt 3

Create src/utils/listQuery.js.



Export a function named parseListQuery(query).



Implement our agreed query-string contract.



Requirements:

\- Copy only status, priority, and project into the filter.

\- Support repeated filter values.

\- Allow sorting only by dueDate, createdAt, and title.

\- Support descending sort with a minus prefix.

\- Add \_id as the final sort tie-breaker.

\- Parse page and limit as positive whole numbers.

\- Default page to 1 and limit to 10.

\- Cap the limit at 50.

\- Reject invalid values with statusCode 400.

\- Include clear error messages explaining allowed values.



Do not modify the service or controller yet.

## Prompt 4

Update the task list endpoint to use parseListQuery.



In task.controller.js:

\- Parse req.query using parseListQuery.

\- Pass the parsed values to the task service.

\- Return count, tasks, and pagination metadata.



In task.service.js:

\- Update findAll to accept filter, sort, page, and limit.

\- Apply the filter and sorting.

\- Use skip and limit for pagination.

\- Preserve project population with the project name.

\- Run countDocuments using the same filter.

\- Run the task query and count query in parallel.



Pagination metadata must include:

\- page

\- limit

\- total

\- totalPages



Preserve the existing success response helper.
