# Implementing Middleware and Centralised Error Handling in Express — Claude Code Prompts

## Prompt 1 — Part 2: Add JSON Body Parsing and Request Logging

Install morgan and add two application-level middleware to src/app.js: express.json() for parsing JSON request bodies, and morgan in "dev" format for request logging.

Then add a temporary POST /debug/echo route that returns req.body using the success helper, so we can check that body parsing works.

Mark it clearly as temporary.

## Prompt 2 — Part 4: Create a Custom Request-Timing Middleware

Create src/middleware/requestTimer.js exporting a requestTimer middleware.

It should record a high-resolution start time and log "[timer] started" with the method and original URL.

When the response finishes, it should log "[timer] finished" with the status code and the duration in milliseconds.

Then pass control on with next().

Register it in app.js directly after morgan.

## Prompt 3 — Part 6: Add Not-Found and Centralised Error Handling

Add centralised error handling.

Create src/middleware/notFound.js, which creates an Error saying the method and original URL weren’t found, sets statusCode to 404, and passes it to next().

Create src/middleware/errorHandler.js with an Express error-handling middleware that uses err.statusCode or err.status, defaulting to 500.

It should log the stack trace for server errors, hide the message of server errors in production, and respond with the failure helper.

Register both after all routes in app.js.

Also add a temporary async GET /debug/error route that throws an error, so we can test it.

## Prompt 4 — Part 13: Fix the Middleware Order

In app.js, move morgan and requestTimer above express.json(), so that requests are logged even when body parsing fails.

Don’t change anything else.

## Prompt 5 — Part 15: Remove the Temporary Debugging Routes

Remove the temporary /debug/echo and /debug/error routes from app.js.

Keep all middleware in its current order.
