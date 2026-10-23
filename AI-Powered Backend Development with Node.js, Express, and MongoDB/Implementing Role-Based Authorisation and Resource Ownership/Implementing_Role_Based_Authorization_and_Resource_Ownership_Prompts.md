# Implementing Role-Based Authorization and Resource Ownership — Claude Code Prompts

## Step 2: Add User Roles and Authorization Middleware

Add role-based authorization to the existing API.

Requirements:

1. Add a role field to the User schema:
   - Type: String
   - Allowed values: "user" and "admin"
   - Default: "user"
2. Create src/middleware/authorize.js.
3. Export authorize(...roles), which returns Express middleware.
4. Check whether req.user.role is included in the allowed roles.
5. If the role is not allowed, throw an error with:
   - statusCode: 403
   - message: "You do not have permission to perform this action"
6. Call next() when authorization succeeds.
7. Apply authorize('admin') to POST / in the project router.

Preserve the existing authentication middleware and route structure.

## Step 4: Implement Task Ownership

Implement task ownership in the existing REST API.

Requirements:

1. In the Task schema:
   - Add a required owner field.
   - Use mongoose.Schema.Types.ObjectId.
   - Reference the User model.
   - Add an index on owner, status, and dueDate.
2. In task.service.js:
   - Set owner from the authenticated user's ID when creating a task.
   - Never trust an owner value supplied by the client.
   - Restrict findAll to the current user's tasks.
   - Allow administrators to list all tasks.
   - For findById, updateById, and deleteById, load the task first.
   - Return null when the task does not exist.
   - Throw 403 when the user is neither the owner nor an administrator.
   - Use the message "You do not have permission to access this task".
3. Pass req.user from task controllers into the service methods.
4. Do not allow owner to be changed through PATCH requests.

Preserve existing validation, sorting, filtering, pagination, and project references.

## Step 6: Assign Owners to Existing Tasks

Create a one-time migration script at scripts/assign-owner.js.

Requirements:

- Accept an email address as a command-line argument.
- Connect to MongoDB using the existing connectDB helper.
- Find the user by email.
- Throw an error if the user does not exist.
- Find tasks that do not have an owner field.
- Assign those tasks to the specified user using updateMany.
- Print the number of modified tasks.
- Disconnect from MongoDB when finished.

Do not modify tasks that already have an owner.
