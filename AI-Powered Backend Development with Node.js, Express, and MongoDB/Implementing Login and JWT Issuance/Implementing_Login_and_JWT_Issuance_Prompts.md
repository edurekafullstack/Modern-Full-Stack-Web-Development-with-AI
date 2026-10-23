# Implementing Login and JWT Issuance — Claude Code Prompts

## Prompt 1 — Step 2 — Configure the JWT Signing Secret and Expiry

Install jsonwebtoken.

Update src/config/env.js to support JWT configuration.

Requirements:

- Read JWT_SECRET as jwtSecret.
- Read JWT_EXPIRES_IN as jwtExpiresIn.
- Default token expiry to "1h".
- Require MONGODB_URI and JWT_SECRET at startup.
- Throw a clear error when either required variable is missing.
- Add a placeholder JWT_SECRET to tests/setup-env.js.

Preserve the existing environment configuration.

## Prompt 2 — Step 3 — Build the Login Endpoint

Implement user login in the existing authentication module.

Requirements:

1. In auth.validators.js, add loginRules:
   - Email required, trimmed, valid, and lowercased.
   - Password required.
   - Do not apply password length rules during login.
2. In auth.service.js, add login:
   - Find the user by email.
   - Explicitly select the password field.
   - Compare the submitted password with bcrypt.
   - Return 401 with "Invalid email or password" when credentials are incorrect.
   - Sign a JWT containing the user's ID as the sub claim.
   - Use jwtSecret and jwtExpiresIn from the environment.
3. Add a login controller returning the token and user.
4. Register POST /login in auth.routes.js.

Preserve the existing registration functionality.

## Prompt 3 — Step 7 — Reduce the Login Timing Difference

The login endpoint reveals whether an account exists through response timing.

Currently, bcrypt.compare runs only when the user is found.

Update the login service so that:

- bcrypt.compare always executes.
- Existing users are checked against their stored hash.
- Unknown users are checked against a fixed dummy bcrypt hash.
- The dummy hash uses the same bcrypt cost factor of 12.
- Both failed cases return 401 with "Invalid email or password".
- Login must still fail whenever the user does not exist.

Preserve JWT generation and the existing successful login behavior.
