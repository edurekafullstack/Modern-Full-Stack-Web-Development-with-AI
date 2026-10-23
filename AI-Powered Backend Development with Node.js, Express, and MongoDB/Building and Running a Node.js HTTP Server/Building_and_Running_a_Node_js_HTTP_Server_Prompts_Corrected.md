# Building and Running a Node.js HTTP Server — Claude Code Prompts

## Prompt 1 — Part 2: Generate a Basic HTTP Server with Claude Code Chat

Replace the contents of src/server.js with a basic HTTP server that uses the built-in node:http module.

Keep the import of the success helper from ./utils/response.js.

The server should listen on port 3000, log the method and URL of each request, and respond to every request with status 200 and a JSON body created with the success helper.

Don’t install any packages.

After writing the file, explain the request handler line by line.

## Prompt 2 — Part 6: Add Routes Through Claude Code Chat

Update src/server.js so it handles two routes.

GET / returns the API name and version with the message "API is running".

GET /health returns the process uptime in seconds with the message "Healthy".

Any other request returns status 404 with a body from the failure helper that names the method and path.

Match on the path only, so a query string doesn’t break routing.

Add a small sendJson helper so that status codes, headers, and JSON conversion are written in one place.
