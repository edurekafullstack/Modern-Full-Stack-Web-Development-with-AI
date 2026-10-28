# Configuring Database Backups and Verifying a Restore — Claude Code Prompts

**Week 3 · Activity 3 · Step 14**  
**Project:** Existing `Demo_project` MERN application  
**Recording target:** 6 minutes 40 seconds to 7 minutes

> This is a Claude Code prompt-and-command companion for the supplied hands-on demonstration. The reference database names (`taskapp`, `taskapp_restore_check`), archive filename, and example outputs must be checked against the real project. Never paste database credentials or the contents of `.env` into Claude Code, terminal history, or the recording.

## File Placement

All paths below are relative to the `Demo_project` repository root.

```text
Demo_project/
├── .gitignore                          # Ignore server/backups/
├── docs/
│   └── release/
│       └── backup-restore.md           # Recovery objectives and evidence
├── server/
│   ├── .env                            # Existing local secrets; never commit
│   ├── backups/                        # Private, Git-ignored directory
│   │   ├── backup.yaml                 # Private source connection config
│   │   ├── restore.yaml                # Private restore connection config
│   │   └── taskapp-2026-10-27.archive.gz  # Example backup archive
│   ├── scripts/
│   │   └── verify-restore.js           # Created during the demo
│   ├── src/
│   │   ├── app.js                      # Inspect; do not alter casually
│   │   └── server.js                   # Inspect; avoid auto-start during verification
│   └── package.json
└── client/
```

**Preparation:** `server/backups/backup.yaml` and `server/backups/restore.yaml` must be prepared privately **before** recording. Claude Code should create `server/scripts/verify-restore.js` during the demo. The backup archive is produced by `mongodump`. Never commit or upload the configs or the archive to the source repository.

## Prompt 1 — Inspect the Existing Database Setup (Read Only)

Copy into Claude Code from the repository root:

```text
Inspect the existing MERN project to identify the current MongoDB database name, application connection setup, readiness route, Express app factory, and authenticated task-list route.

Read the relevant server configuration and source files, but do not print MONGODB_URI, JWT_SECRET, passwords, tokens, or user records. Do not change any files.

Tell me which code paths will support a read-only restore verification script, and flag any uncertainty about database name, API authentication, or automatic Mongoose index creation.
```

Before running any database tools, verify the actual database names. The reference demonstration uses source `taskapp` and restore target `taskapp_restore_check`; they **must be different**.

## Step 1 — Record the Recovery Objectives

Create or open `docs/release/backup-restore.md` and add the following **targets**, not claims of achievement:

```markdown
# Backup and Restore Verification

## Recovery Objectives

- Recovery Point Objective (RPO): 24 hours
- Recovery Time Objective (RTO): 1 hour
- Required backup frequency: Daily
- Recovery verification: Required after restoration
- Status of daily automated backups: Pending verification
```

### Prompt 2 — Prepare the Recovery Documentation

```text
Create or update docs/release/backup-restore.md for the existing MERN task application.

Document these objectives: 24-hour RPO, one-hour RTO, daily backup requirement, and mandatory restore verification.

Add headings for Backup Evidence, Restore Evidence, Verification Results, Negative Verification, Cleanup, and Outstanding Requirements. Leave all measured values as 'Not yet measured' or 'Pending'.

Do not invent backup success, restore duration, document counts, checksum values, or an implemented backup schedule. Do not write database credentials.
```

## Step 2 — Create and Protect the Backup

### Verify Tools

Run in PowerShell:

```powershell
mongodump --version
mongorestore --version
mongosh --version
```

From the repository root, create the directory and configure Git:

```powershell
New-Item -ItemType Directory -Force server/backups
```

Add to the **root** `.gitignore`:

```gitignore
server/backups/
```

Verify that the private files are ignored:

```powershell
git check-ignore -v server/backups/backup.yaml
```

### Prepare Connection Configuration Privately

File: `server/backups/backup.yaml` — select the verified **source** database.  
File: `server/backups/restore.yaml` — connect to the correct cluster without accidentally pinning the **source** database as the restore destination.

Use a secure configuration approach supported by your installed MongoDB Database Tools. Do not show or paste actual connection strings. Do not ask Claude Code to read these files.

### Run the Backup

From `Demo_project/server/`, adapting the archive name to the recording date and actual database:

```powershell
mongodump --config=backups/backup.yaml --gzip --archive=backups/taskapp-2026-10-27.archive.gz
Get-FileHash backups/taskapp-2026-10-27.archive.gz -Algorithm SHA256
Get-Item backups/taskapp-2026-10-27.archive.gz | Select-Object Name, Length, LastWriteTime
```

Record the **actual** exported collections, archive size, SHA-256 hash, and tool version in `docs/release/backup-restore.md`. Do not assume the reference counts of 50 users, 5,000 tasks, and 3 projects.

## Step 3 — Restore to a Separate Database

**Safety check before every destructive command:** Confirm the source database name and the restore-check database name are different. The `--drop` flag will remove **target** collections; never point it at the source database.

From `Demo_project/server/`, after manually validating the namespace mapping:

```powershell
mongorestore `
  --config=backups/restore.yaml `
  --gzip `
  --archive=backups/taskapp-2026-10-27.archive.gz `
  --nsFrom='taskapp.*' `
  --nsTo='taskapp_restore_check.*' `
  --drop
```

The archive and namespace values above are **reference examples**. Replace them with the verified database and archive names before running.

### Prompt 3 — Create the Restore Verification Script

Run Claude Code from `Demo_project/server/`:

```text
Create scripts/verify-restore.js for this existing MERN backend.

Accept two command-line arguments: source database name and restored database name. Read the existing MONGODB_URI securely from the server environment without printing the value, rewriting it, or exposing credentials.

Compare the source and restored databases using read-only operations:
1. Exact collection names.
2. Document counts per collection.
3. Index definitions, including keys, uniqueness, and relevant index options, while ignoring database-specific metadata.
4. SHA-256 hashes of consistently serialized BSON documents ordered by _id.

Use the existing MongoDB/Mongoose conventions. Select databases through useDb() or a supported dbName option; never use string replacement on a connection URI.

Then, if the existing app architecture permits safe isolation, verify the actual Express readiness endpoint against the restored database and use a non-sensitive test account to compare authenticated task-list totals, following pagination as needed.

The script must be read-only, must not clear collections, must not call index-creation methods, must not start an unnecessary network listener, must not log secrets or personal records, and must exit non-zero if any comparison fails.

Inspect the existing app entry points before implementing the API checks. If safe read-only API testing cannot be guaranteed, explain the limitation rather than modifying app logic or fabricating an API check.

Create only scripts/verify-restore.js and show the proposed implementation for review.
```

### Run Verification

From `Demo_project/server/`:

```powershell
node scripts/verify-restore.js taskapp taskapp_restore_check
```

A successful result should independently demonstrate matching collection names, document counts, indexes, content hashes, and — when safely supported — application-level readiness and authenticated task access. **Do not label checks PASS unless executed successfully.**

### Prompt 4 — Diagnose Incorrect Connection Handling (Only if Needed)

Use if an initial verification script incorrectly modifies the URI and produces an authentication error:

```text
The restore verification script encountered an authentication error. Check whether it constructs a different database connection by replacing text inside MONGODB_URI.

Correct scripts/verify-restore.js so that MONGODB_URI remains unchanged and source and restore databases are selected using MongoDB useDb() or the existing project's supported dbName option.

Preserve all read-only collection, document-count, index, content-hash, and safe API checks. Do not log credentials or alter other application files. Do not assume the failure was caused by this bug unless the source code supports that diagnosis.
```

Rerun:

```powershell
node scripts/verify-restore.js taskapp taskapp_restore_check
```

## Step 3A — Verify That Incomplete Restores Are Detected

Perform the following **only** on the disposable `taskapp_restore_check` database. Never run these exercises on the source or a shared production database.

### Test A — Restore Without Secondary Indexes

After confirming the target mapping, run:

```powershell
mongorestore `
  --config=backups/restore.yaml `
  --gzip `
  --archive=backups/taskapp-2026-10-27.archive.gz `
  --nsFrom='taskapp.*' `
  --nsTo='taskapp_restore_check.*' `
  --drop `
  --noIndexRestore

node scripts/verify-restore.js taskapp taskapp_restore_check
```

The comparison should fail if the source has indexes beyond the default `_id` indexes. Restore again **without** `--noIndexRestore` after this check.

### Test B — Detect a Missing Task Document

In `mongosh`, securely connected to the disposable restore database, **first** run:

```javascript
db.getName()
```

Proceed only when it outputs `taskapp_restore_check` and the database is disposable. Then, to simulate one missing task:

```javascript
db.tasks.deleteOne({})
```

Run:

```powershell
node scripts/verify-restore.js taskapp taskapp_restore_check
```

The verifier should detect the missing document by count and/or content hash. Restore the complete archive again, and rerun verification until the restored copy matches the source.

### Prompt 5 — Review the Negative Verification Evidence

```text
Review scripts/verify-restore.js and the observed output from our two controlled negative restore checks: missing indexes and one missing task in the disposable restore-check database.

Confirm which comparisons detected each condition and whether failures caused a non-zero exit status. Identify any checks that may be unreliable or accidentally mutate database state.

Do not run destructive operations, modify data, claim a check passed without evidence, or access credential files. Propose minimal script changes only when needed and show them for review.
```

## Step 4 — Document Recovery Evidence

### Prompt 6 — Complete the Backup-and-Restore Report

```text
Update docs/release/backup-restore.md using only the actual command results and timings I provide or verified local non-secret output.

Include:
- Recovery objectives: RPO 24 hours, RTO 1 hour, required daily backups.
- Actual source and restore-check database names.
- Backup archive filename, file size, tool version and SHA-256 checksum.
- Actual restore duration and verification duration.
- Number of restored documents and failures reported by mongorestore.
- Collection, count, index, content-hash and API verification results.
- Whether the deliberately incomplete-index restore was detected.
- Whether the missing-document test was detected.
- Cleanup status and where the encrypted backup is retained.
- Outstanding operational work: scheduled and monitored daily backups, protected offsite/encrypted storage, retention policy and periodic restore drills.

Clearly mark unperformed checks as Pending. Do not invent values, claim that the RPO or RTO has been achieved from one restore alone, or include URI values, tokens, passwords, or personal records.

Modify only docs/release/backup-restore.md.
```

### Clean Up the Disposable Restore Database

Use MongoDB Shell with the authenticated connection already established. **Confirm the active database**:

```javascript
db.getName()
```

If and only if it returns the explicitly approved disposable database `taskapp_restore_check`, remove its collections:

```javascript
db.getCollectionNames().forEach((name) => {
  db.getCollection(name).drop();
});
```

Never run this against `taskapp` or any non-disposable database. Record cleanup only after verifying it succeeded.

From the repository root, confirm the intended tracked and ignored files:

```powershell
git status --short
git check-ignore -v server/backups/backup.yaml
```

Keep `server/scripts/verify-restore.js` and `docs/release/backup-restore.md`. Store the archive securely outside Git.

## Final Demo Verification

- [ ] Actual source database and separate restore-check database confirmed.
- [ ] `server/backups/` ignored by Git; credentials never displayed.
- [ ] RPO target (24 hours) and RTO target (1 hour) documented.
- [ ] `mongodump` archive created and actual SHA-256 recorded.
- [ ] `mongorestore` targets **only** the disposable restore database.
- [ ] `server/scripts/verify-restore.js` created as read-only script.
- [ ] Collection names, counts, indexes, and content hashes checked.
- [ ] Safe API readiness and task retrieval checks completed or marked Pending.
- [ ] Missing-index and missing-document checks correctly detect incomplete restores.
- [ ] Complete backup restored again and final verification passes.
- [ ] Temporary restore-check database removed after explicit name check.
- [ ] Actual durations and results written in `docs/release/backup-restore.md`.
- [ ] Backup automation, storage, and retention gaps accurately marked Pending where applicable.

**Recording reminder:** Reference counts, the `taskapp-2026-10-27.archive.gz` filename, and expected success messages are illustrations from the supplied script; use your real results on screen.
