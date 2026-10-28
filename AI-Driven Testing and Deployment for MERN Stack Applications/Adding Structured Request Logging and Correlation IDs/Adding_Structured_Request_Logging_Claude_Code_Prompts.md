# Adding Structured Request Logging and Correlation IDs — Claude Code Prompts

## Project File Placement

The Express backend is at the root of `Demo_project`, not inside a separate `server` directory.

```text
Demo_project/
├── scripts/
│   └── perf-server.js             # Existing; reuse from previous demo
├── src/
│   ├── config/
│   │   └── logger.js              # Create
│   ├── middleware/
│   │   ├── requestLogger.js       # Create
│   │   └── errorHandler.js       # Modify if this is the actual path
│   ├── services/
│   │   └── task.service.js        # Temporarily change, then restore
│   └── app.js                     # Modify
├── tests/
│   ├── setup-env.js               # Modify if present
│   └── logging.test.js            # Create during demo
├── perf/
│   └── token.txt                  # Generated; never commit
├── .env.example                   # Update
├── package.json                   # Update dependencies
└── api.log                        # Generated log output
```

Verify the actual error-handler and test setup paths before making changes. Do not recreate `scripts/perf-server.js`.

## Preparation — Run from Project Root

```powershell
npm install
npm run perf:server -- 1000
```

In a second PowerShell terminal:

```powershell
$token = (Get-Content .\perf\token.txt -Raw).Trim()
curl.exe -i -H "Authorization: Bearer $token" "http://localhost:3002/api/v1/tasks?status=todo"
```

## Prompt 1 — Trace the Existing Request

Trace GET /api/v1/tasks?status=todo through our existing Express application.

Identify each middleware, route, controller, service, and error handler in execution order. Explain where the request can terminate and which functions handle authentication, validation, database queries, and errors.

Do not modify any files.

## Preparation — Install Logging Dependencies

Stop the performance server before editing the application.

```powershell
npm install pino pino-http
npm install -D pino-pretty
```

## Prompt 2 — Implement Structured Logging

Add structured request logging to our existing Express application using pino and pino-http.

Requirements:

1. Create `src/config/logger.js` exporting `createLogger()` and a default logger. Use `LOG_LEVEL` as the configurable log level.
2. Redact authorization, cookie, set-cookie, password, and token fields.
3. Create `src/middleware/requestLogger.js` using pino-http.
4. Accept an incoming `X-Request-Id` only when it contains 8–64 letters, numbers, or hyphens. Otherwise, generate a UUID.
5. Return the ID in the `X-Request-Id` response header.
6. Use info for successful requests, warn for 4xx responses, and error for 5xx responses.
7. Include the authenticated `userId` where available.
8. Log only approved request and response fields, without headers or bodies. Avoid leaking sensitive query-string values.
9. Configure `quietReqLogger: true` and verify that `reqId` remains in emitted records.
10. Update `src/app.js` to support `createApp()` while preserving its default export and existing routes.
11. Register logging early in the middleware chain and expose `X-Request-Id` through CORS.
12. Update the existing error handler to log unexpected errors using `req.log` and return `requestId` in 500 responses.
13. Set `LOG_LEVEL` to `silent` in `tests/setup-env.js`, adapting to the existing test configuration.

Preserve all existing application behavior and do not change business logic.

## Verification — Generate and Inspect Logs

Restart the server from the project root:

```powershell
npm run perf:server -- 1000 2>&1 | Tee-Object -FilePath api.log
```

In another terminal:

```powershell
$token = (Get-Content .\perf\token.txt -Raw).Trim()
curl.exe -i -H "Authorization: Bearer $token" "http://localhost:3002/api/v1/tasks?status=todo"
```

Confirm that the response contains `X-Request-Id` and the JSON log includes the same `reqId`, request method, safe URL, status code, response time, and user ID where available.

## Demonstration — Trace a Deliberate Error

In `src/services/task.service.js`, locate the actual pagination calculation. If it uses `pageSize`, temporarily change it to `pagesize` to trigger a `ReferenceError` when that path executes. Restart the server and repeat the authenticated request.

Copy the actual `X-Request-Id` from the HTTP 500 response and search for it:

```powershell
Select-String -Path api.log -Pattern "YOUR-REQUEST-ID"
```

Check that credentials are absent:

```powershell
Select-String -Path api.log -Pattern "Bearer"
Select-String -Path api.log -Pattern ([regex]::Escape($token))
```

The searches for credentials should return no matches. Verify that the error-handler record and request-completion record share the same request ID. **Immediately restore the original variable name**, restart, and confirm HTTP 200.

## Prompt 3 — Create Logging Tests

Create `tests/logging.test.js` using the existing Jest and Supertest setup.

Build an Express app using `createApp()` and a Pino logger that captures JSON records in memory.

Add tests verifying that:

- Every request log contains the same request ID returned in `X-Request-Id`.
- Authenticated requests include `userId`.
- A valid incoming request ID is reused.
- Invalid or excessively long request IDs are replaced.
- Registering, logging in, and calling `/api/v1/auth/me` never exposes passwords or bearer tokens.
- A simulated database failure using `jest.spyOn` on `Task.find` produces an error record and stack trace associated with the response `requestId`.
- Logs contain valid JSON and retain the required request metadata.

Use existing test factories and database setup. Do not change application business logic.

## Verification — Run Tests and Document Configuration

```powershell
npm test
npm test -- --runInBand tests/logging.test.js
```

To demonstrate a meaningful regression check, temporarily remove `quietReqLogger: true`, run the targeted tests, and inspect whether the correlation-ID assertions fail. Restore the setting and rerun the tests. Do not claim the regression test failed unless it actually does.

Add the following to `.env.example`:

```dotenv
LOG_LEVEL=info
```

## Final Verification Checklist

- [ ] Existing `scripts/perf-server.js` is reused with 1,000 tasks.
- [ ] `src/config/logger.js` and `src/middleware/requestLogger.js` exist.
- [ ] The existing app, error handler, and test setup are updated without breaking routes.
- [ ] HTTP responses contain `X-Request-Id`.
- [ ] Request and error records contain matching correlation IDs.
- [ ] Authenticated requests include `userId` where available.
- [ ] Logs omit passwords, bearer tokens, sensitive headers, and bodies.
- [ ] Deliberate error is traced and then fully restored.
- [ ] `tests/logging.test.js` passes.
- [ ] `LOG_LEVEL=info` is documented.
- [ ] `api.log` and generated tokens are not committed.

**Recording note:** All outputs and IDs are environment-dependent. Use actual recorded results, not illustrative values.
