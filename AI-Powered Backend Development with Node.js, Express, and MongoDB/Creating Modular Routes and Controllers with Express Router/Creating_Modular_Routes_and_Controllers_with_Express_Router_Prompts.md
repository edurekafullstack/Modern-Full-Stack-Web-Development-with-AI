# Hands-On: Creating Modular Routes and Controllers with Express Router

## Prompt 1 — Part 2: Plan the Task Resource with Claude Code

> We’re adding the API’s first resource: tasks.
>
> Before writing any code, propose the endpoints for reading tasks, including one that filters by status using a query string, and list the files you’d create.
>
> Follow our structure: routes map URLs to controller functions, controllers handle the request and response, and services own the data.
>
> Use in-memory sample data for now, because the database arrives in Week 2.
>
> Don’t change any files yet.

## Prompt 2 — Part 3: Generate the Task Service, Controller, and Router

> Implement the plan for the two read endpoints.
>
> Create src/services/task.service.js with four sample tasks, each with an id, title, and status, and two functions: findAll, which accepts an optional status filter, and findById.
>
> Create src/controllers/task.controller.js with getTasks, which reads status from the query string, and getTaskById, which reads id from the route parameters and returns 404 with the failure helper if no task matches.
>
> Create src/routes/task.routes.js using Express Router.
>
> Use the response helpers for every response.

## Prompt 3 — Part 7: Mount the Task Router Under API Version 1

> Create src/routes/index.js that groups the API routers and mounts the task router at /tasks.
>
> Mount this index router in app.js under /api/v1.
>
> Leave GET / and GET /health where they are.
