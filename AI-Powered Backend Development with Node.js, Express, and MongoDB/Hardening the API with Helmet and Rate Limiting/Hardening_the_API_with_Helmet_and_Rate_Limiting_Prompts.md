# Hardening the API with Helmet and Rate Limiting — Claude Code Prompts

## Step 3 — Install Helmet

Install helmet in the existing Express project.

Update src/app.js to register helmet() as the first middleware, before request logging and JSON body parsing.

Requirements:

- Import helmet from the helmet package.
- Apply app.use(helmet()) immediately after creating the Express app.
- Preserve the existing middleware and route configuration.
- Ensure security headers are applied to normal responses and error responses.

## Step 4 — Add Authentication Rate Limiting

Install express-rate-limit and add authentication rate limiting.

Create src/middleware/rateLimiters.js.

Requirements:

- Export an authLimiter using express-rate-limit.
- Allow a maximum of 10 requests per IP address.
- Use a 15-minute window.
- Enable standard RateLimit headers using draft-8.
- Disable legacy X-RateLimit headers.
- Return a JSON error using the existing failure helper.
- Use the message "Too many attempts. Please try again later."
- Skip rate limiting only when NODE_ENV is test.

Apply the same authLimiter as the first middleware on:

- POST /register
- POST /login

Preserve the existing validation, controllers, and authentication routes.

## Step 6 — Security Review

Review the API security configuration in:

- src/app.js
- src/middleware/rateLimiters.js
- src/routes/auth.routes.js

Check the following:

1. Helmet runs before other middleware.
2. X-Powered-By is not sent.
3. Registration and login are rate-limited before validation.
4. Rate limiting is skipped only in tests.
5. JSON request bodies have a size limit.
6. Client IP addresses will be correct behind a hosting proxy.
7. Secrets and stack traces are not exposed to clients in production.

Report each item as "Met" or "Not met", with a short reason.

Do not modify any files.

## Step 6 — Add a Request-Body Limit

Update src/app.js to set a 10 KB limit on JSON request bodies.

Change only the express.json() middleware configuration.

Preserve all other middleware and routes.
