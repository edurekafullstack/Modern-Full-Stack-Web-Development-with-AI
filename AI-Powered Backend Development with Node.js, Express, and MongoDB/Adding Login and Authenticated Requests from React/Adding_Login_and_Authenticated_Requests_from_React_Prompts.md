# Adding Login and Authenticated Requests from React — Claude Code Prompts

## Step 2: Connect the React Login Form to the API

Implement login and route protection in the existing React client.

Requirements:

1. Create client/src/api/auth.js.
2. Export login(email, password), which:
   - Calls POST /auth/login through the existing apiFetch function.
   - Sends email and password as JSON.
   - Stores the returned JWT in localStorage under "token".
   - Returns the user object.
3. Export logout(), which removes the stored token.
4. Connect the existing LoginPage form to login().
5. Prevent the default form submission.
6. Disable the submit button while the request is pending.
7. Display API error messages on failed login.
8. Navigate to / after successful login, using replace: true.
9. Display any message passed through React Router navigation state.
10. Create a RequireAuth component that redirects to /login when no token exists.
11. Wrap the / route with RequireAuth.

Preserve the existing React Router structure and styling.

## Step 4: Implement Task Creation, Updating, and Deletion

Add task creation, updating, and deletion to the React application.

Requirements:

1. In client/src/api/tasks.js, export:
   - createTask(fields): POST /tasks
   - updateTask(id, changes): PATCH /tasks/
   - deleteTask(id): DELETE /tasks/
2. Use the existing apiFetch function for every request.
3. In TaskList:
   - Add a form with a title input.
   - Create a task when the form is submitted.
   - Add the returned task to the beginning of the list.
   - Clear the title input after successful creation.
   - Display field validation errors returned by the API.
   - Add a button that toggles task status between todo and done.
   - Add a delete button for each task.
   - Update React state using the API response.
4. Preserve the existing task list styling and loading behavior.

## Step 5: Test Task Operations and Fix an API Response Issue

Fix the PATCH /tasks/ response in the Express API.

The task list endpoint returns project as a populated object containing its name, but the update endpoint returns only the project ID.

Update updateById in server/src/services/task.service.js to populate the project field with its name, matching findAll.

Do not change any other behavior.

## Step 6: Handle Expired Sessions Automatically

Implement centralized handling for expired or invalid authentication tokens in the React application.

Requirements:

1. In client/src/api/client.js:
   - When any API response returns 401, except from /auth/login, remove the token from localStorage.
   - Dispatch a browser event named "auth".
   - Continue throwing the API error normally.
2. In client/src/App.jsx:
   - Listen for the auth event.
   - Navigate to /login with replace: true.
   - Pass this navigation state message:\
     "Your session has expired. Please log in again."
   - Remove the event listener during cleanup.
3. In TaskList:
   - Add a Log out button.
   - Call the existing logout() function.
   - Navigate to /login.

Preserve existing login, routing, and task operations.

