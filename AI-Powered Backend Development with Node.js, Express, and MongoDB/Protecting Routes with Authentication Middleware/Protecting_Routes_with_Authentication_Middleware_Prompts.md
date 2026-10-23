# Protecting Routes with Authentication Middleware — Claude Code Prompts

## Prompt 1 — Step 2 — Create the Authentication Middleware

Create src/middleware/protect.js with an async protect middleware.

Requirements:

- Read the Authorization header.
- Accept tokens in the format "Bearer \<token>".
- Return 401 with "Authentication required" when the header is missing or malformed.
- Verify the JWT using env.jwtSecret.
- Accept only the HS256 signing algorithm.
- Return 401 with "Token has expired" for expired tokens.
- Return 401 with "Invalid token" for other token verification failures.
- Read the user ID from the token's sub claim.
- Load the user from MongoDB using the User model.
- Return 401 with "User no longer exists" when the user is missing.
- Attach the authenticated user to req.user.
- Call next() after successful authentication.
- Use errors with statusCode so the existing error handler can respond.

Preserve the existing authentication and error-handling architecture.

## Prompt 2 — Step 4 — Protect the Task and Project Routes

Update src/routes/index.js to protect the task and project routers.

Requirements:

- Import the protect middleware.
- Apply protect when mounting the task router.
- Apply protect when mounting the project router.
- Keep the auth router public.
- Do not protect registration, login, root, or health-check endpoints.
- Preserve the existing route structure.

## Prompt 3 — Step 6 — Create the Current-User Endpoint

Add GET /me to the existing authentication module.

Requirements:

- Add a me controller in src/controllers/auth.controller.js.
- Return req.user using the existing success response helper.
- Use the message "Current user".
- Add GET /me in src/routes/auth.routes.js.
- Apply protect to this route only.
- Keep POST /register and POST /login public.
- Do not include password hashes in the response.
