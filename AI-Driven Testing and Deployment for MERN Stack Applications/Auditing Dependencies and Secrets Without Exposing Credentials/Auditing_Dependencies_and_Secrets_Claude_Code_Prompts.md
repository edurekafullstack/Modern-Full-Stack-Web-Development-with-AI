# Auditing Dependencies and Secrets Without Exposing Credentials — Claude Code Prompts

**Week 1 · Activity 3 · Step 13**  
**Project:** Existing `Demo_project` MERN application

## Project File Placement

Work in the existing project. Do not create another backend or frontend.

```text
Demo_project/
├── server/
│   ├── scripts/
│   │   └── check-unsigned-token.js  # Created during demo
│   ├── src/
│   │   ├── config/env.js            # Inspect; add missing-secret guard if needed
│   │   ├── middleware/protect.js    # Inspect JWT verification
│   │   └── services/auth.service.js # Inspect JWT signing
│   ├── .env                         # Local only; NEVER display or commit
│   ├── .env.example                 # Safe placeholders only
│   └── package.json
├── client/
│   ├── package.json
│   └── src/
├── e2e/
│   └── playwright.config.js
├── docs/
│   └── security-decisions.md        # Created during demo
├── .gitleaksignore                  # Only if a resolved finding needs an exception
└── .gitignore
```

**Important:** `check-unsigned-token.js` belongs in **`Demo_project/server/scripts/`**, not the repository-root `scripts/` folder. `security-decisions.md` belongs in **`Demo_project/docs/`**.

## Before Recording — Safety and Baseline

1. Verify the current branch before using the reference branch `w1-s13-start`.
2. Install existing server and client dependencies, and verify baseline tests.
3. Confirm Gitleaks is installed (`gitleaks version`).
4. Never print, paste into Claude Code, screen-record, or commit real `.env` contents, access tokens, JWT signing secrets, database passwords, or connection strings.
5. Do not downgrade secure dependencies or deliberately weaken authentication to recreate historical reference findings.
6. If a historical dummy-secret finding is needed but the existing repository has none, demonstrate it only in a separate disposable test repository with wholly fictional data.

From `Demo_project/`:

```bash
git branch -a
cd server
npm install
npm test
cd ../client
npm install
npm test
cd ..
gitleaks version
```

## Prompt 1 — Inspect Dependencies and Environment Configuration

```text
Inspect the existing server/package.json, client/package.json,
server/src/config/env.js, .gitignore, and server/.env.example (if it exists).

Identify runtime dependencies, development dependencies, required environment
variable NAMES, and the rules that exclude local secrets from version control.
Do not read or print the values from server/.env or any other credentials.
Do not modify files. Report missing protections and cite the inspected paths.
```

### Commands — Repository Root

```bash
git check-ignore -v server/.env
git ls-files '*env*'
```

Confirm that the local `.env` is ignored **and** not tracked. An ignore rule alone does not establish that the file was never committed previously.

## Prompt 2 — Run and Triage npm Audit Findings

```text
Run npm audit and npm audit --omit=dev separately in server/ and client/.

For each finding, identify its package/version, severity, whether it is a
runtime or development dependency, whether this application's source code
uses the affected capability, the evidence for that conclusion, and whether
a compatible upgrade exists. Check Express query parser configuration and
React navigation targets before making reachability claims.

Do not apply fixes yet. Do not access or print environment secret values.
Summarize confirmed findings separately from assumptions or pending checks.
```

### Commands

```bash
cd server
npm audit
npm audit --omit=dev
cd ../client
npm audit
npm audit --omit=dev
cd ..
```

Review the **actual** results. The original reference mentions `jsonwebtoken`, `qs`, `react-router`, and `@eslint/plugin-kit`, but the installed versions and advisory counts may differ.

## Prompt 3 — Create the Safe JWT Verification Script

```text
Inspect the installed jsonwebtoken version and authentication configuration.
Create server/scripts/check-unsigned-token.js as an isolated local check.

Build a dummy unsigned JWT whose header uses alg "none" and whose payload has
only a fictional user identifier. Call jwt.verify with an undefined secret.
Print only whether verification ACCEPTED or REJECTED the dummy token, with a
short safe error message if rejected; never print any credential or token
from the application.

Do not read actual .env values, connect to a database, modify authentication
code, change package versions, or make requests to a running API.
If the installed library is already patched, preserve its secure rejection.
```

### File Location and Command

**Create:** `Demo_project/server/scripts/check-unsigned-token.js`

```bash
cd server
npm ls jsonwebtoken
node scripts/check-unsigned-token.js
```

Also inspect `server/src/middleware/protect.js` and `server/src/config/env.js` to establish whether the installed-library behavior is actually reachable in this application. The isolated check alone does not prove deployment exploitability.

## Prompt 4 — Review Git History with Gitleaks

```text
Review the redacted Gitleaks scan summaries and the repository's ignore
rules. Identify which findings are present in Git history versus only in
ignored local working files. Explain what is confirmed, which variables may
have been exposed, and which remediation steps remain pending.

Do not reveal or request secret values. Do not use git show to display a
historical .env. Do not add a fingerprint to .gitleaksignore until the
finding's remediation has been verified. Do not modify any files yet.
```

### Commands — Repository Root

```bash
cd ..
gitleaks git --redact -v .
gitleaks dir --redact -v .
```

If a committed `.env` is reported, inspect **variable names only** by substituting the real commit identifier (never paste secret contents):

```bash
git grep -h -o -E '^[A-Z_]+=' <commit-hash> -- server/.env
```

If genuine credentials were exposed, revoke/rotate them using the relevant provider controls outside the recording. Deleting a file or ignoring a Gitleaks fingerprint is **not** credential remediation.

## Prompt 5 — Harden JWT Authentication

```text
Inspect server/package.json, server/src/middleware/protect.js,
server/src/services/auth.service.js, and server/src/config/env.js.

If jsonwebtoken is vulnerable, upgrade to a supported patched major version
compatible with this project (version 9 or newer where appropriate).
Explicitly require HS256 when verifying tokens and specify HS256 when
signing them. Preserve token expiry, error handling, and API behavior.
Ensure application startup fails clearly if JWT_SECRET is missing.

Do not print, generate onscreen, or replace genuine secret values. Do not
modify unrelated application files. Show the proposed diff for review.
```

Verify, as applicable:

```js
jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
```

```js
jwt.sign(payload, env.jwtSecret, { algorithm: 'HS256' /* retain existing options */ });
```

**Guard expectation:** startup rejects an absent `JWT_SECRET`, without logging the secret itself. If the project already implements these protections, preserve them rather than duplicating the logic.

### Verification — Server

```bash
cd server
node scripts/check-unsigned-token.js
npm audit fix
npm audit
npm test
```

Review every change caused by `npm audit fix`; do not automatically run `npm audit fix --force` for breaking upgrades. The unsigned-token script must report **rejection** after the fix.

## Prompt 6 — Validate Frontend and End-to-End Tests

```text
Review the dependency changes and the results of the React test suite,
production build, and Playwright login-to-CRUD journey.

If a test fails, diagnose the existing configuration and affected code.
Make only the smallest necessary compatible correction and preserve existing
application behavior, assertions, and security protections.

If Jest is incorrectly collecting Playwright files from e2e/, adjust only
Jest's test discovery/exclusion settings in its actual configuration. Do not
edit the Playwright tests or weaken assertions. Do not assume any test count
or claim success until the commands pass.
```

### Commands

```bash
cd ../client
npm audit fix
npm audit
npm test
npm run build
cd ../e2e
npx playwright test
cd ..
```

Use the actual test counts and audit results; the figures in the reference demo are not guaranteed for this checkout.

## Prompt 7 — Document Verified Security Decisions

```text
Create docs/security-decisions.md at the Demo_project repository root.

Include a table with columns: Finding, Decision, Verified by.
Document only findings actually present in our audit or scans. For each,
record source-code reachability, fixes applied, successful verification
commands, and any unresolved work. Distinguish CONFIRMED, PENDING, and
NOT APPLICABLE findings.

Document historical secret exposures by variable name/type and remediation
status only; never include values, connection strings, tokens, or passwords.
Do not claim credential rotation, zero audit vulnerabilities, or passing
tests without supporting evidence from the actual results.
```

**Create:** `Demo_project/docs/security-decisions.md`

For a historical finding that has been genuinely remediated and intentionally suppressed, document the reason before placing its *actual* fingerprint in `Demo_project/.gitleaksignore`. Do not suppress active genuine exposures.

## Final Verification Commands

From the relevant directories:

```bash
# Demo_project/server
npm audit
npm test
node scripts/check-unsigned-token.js

# Demo_project/client
npm audit
npm test
npm run build

# Demo_project/e2e
npx playwright test

# Demo_project root
gitleaks git --redact .
gitleaks dir --redact .
git check-ignore -v server/.env
```

## Final Recording Checklist

- [ ] Checked dependency lists in both `server/` and `client/`.
- [ ] Confirmed local `.env` is ignored and untracked; no secret values shown.
- [ ] Ran full and production-only dependency audits.
- [ ] Assessed findings against actual code instead of assuming exploitability.
- [ ] Created `server/scripts/check-unsigned-token.js` and verified its behavior.
- [ ] Scanned Git history and working files with redaction.
- [ ] Identified and remediated any genuine exposed credentials outside recording.
- [ ] Verified JWT algorithm restrictions and missing-secret startup guard.
- [ ] Ran server tests, client tests, client build and Playwright journey.
- [ ] Created `docs/security-decisions.md` using only observed evidence.
- [ ] Restored any temporary demonstration changes; did not leave weak security settings.

**Recording emphasis:** Explain the difference between a scanner finding and a reachable vulnerability, and between an ignored local secret and a secret preserved in Git history. Never expose real credentials to reproduce reference output.
