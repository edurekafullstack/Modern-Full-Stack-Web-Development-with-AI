# MERN Release Smoke Checks

Release: Current deployment
Environment: Production

## API Availability
- [ ] Health endpoint responds
- [ ] Database status is connected

## Authentication
- [ ] Valid login succeeds
- [ ] Missing authentication returns 401

## Task Operations
- [ ] Create a task
- [ ] View the task
- [ ] Update the task
- [] Delete the task

## Rollback
- [ ] Identify the known-good release
- [ ] Restore the previous release
- [ ] Verify health after recovery

## Rollback Decision

Trigger rollback when:
- Valid users cannot log in.
- Critical task operations fail.
- The API is unavailable.
- A release introduces a serious security issue.

Do not roll back automatically for:
- A minor cosmetic issue.
- A temporary local browser problem.
- An issue unrelated to the new release.