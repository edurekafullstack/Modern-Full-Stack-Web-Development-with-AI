# Configuring CORS and Connecting the React Starter App to the API — Claude Code Prompts

## Step 3: Configure CORS Using Allowed Origins

Configure CORS for the existing Express API.

Requirements:

1. Install the cors package in the server.
2. Add CLIENT_ORIGINS to server/.env and server/.env.example, with the development value[ http://localhost:5173](http://localhost:5173/).
3. Update src/config/env.js to expose clientOrigins as an array parsed from a comma-separated CLIENT_ORIGINS environment variable. Default to[ http://localhost:5173](http://localhost:5173/).
4. In src/app.js, register cors immediately after helmet and before logging, body parsing, authentication, and routes.
5. Allow only configured origins.
6. Allow the methods GET, POST, PATCH, and DELETE.
7. Allow the Content-Type and Authorization request headers.
8. Do not enable credentials, because this application uses Bearer tokens rather than cookies.

Preserve all existing middleware and security settings.

## Step 4: Create a Reusable API Client in React

Create a reusable API client for the React starter application.

Requirements:

1. Create client/src/api/client.js.
2. Export an async apiFetch(path, options) function.
3. Read the API base URL from import.meta.env.VITE_API_URL.
4. Read the JWT from localStorage using the key "token".
5. Attach Authorization: Bearer \<token> when a token exists.
6. Set Content-Type to application/json.
7. Return null for HTTP 204 responses.
8. Parse JSON responses.
9. On successful requests, return the response's data field.
10. On failed requests, throw an Error containing the API's message, status code, and field errors.
11. Create client/src/api/tasks.js exporting getTasks(params), which requests GET /tasks with URL query parameters.
12. Add VITE_API_URL=[http://localhost:4000/api/v1](http://localhost:4000/api/v1) to client/.env.

Preserve the existing React application structure.

## Step 5: Replace Sample Tasks with Real API Data

Update the existing React TaskList component to load real tasks from the API instead of using sample data.

Requirements:

1. Import useEffect and useState from React.
2. Import getTasks from the API tasks module.
3. Load tasks with getTasks({ limit: 10 }) when the component mounts.
4. Track tasks, loading, and error state.
5. Display "Loading tasks…" while the request is pending.
6. Display the API error message when the request fails.
7. Render the returned tasks with their title, status, and project name.
8. Preserve the existing TaskList layout and styling where possible.

