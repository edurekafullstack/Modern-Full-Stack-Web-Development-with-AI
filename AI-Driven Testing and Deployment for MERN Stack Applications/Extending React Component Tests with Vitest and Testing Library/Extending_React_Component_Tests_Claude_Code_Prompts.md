# Extending React Component Tests with Vitest and Testing Library — Claude Code Prompts

## Project Folder Structure and File Placement

Work from the existing `Demo_project` repository. The React app is located under `client/`; **do not** create a second React application or replace the existing task modal.

```text
Demo_project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskModal.jsx          # Existing component: inspect, do not modify
│   │   │   └── TaskModal.test.jsx     # Create and expand during demo
│   │   └── test/
│   │       └── setup.js               # Create Vitest setup here
│   ├── vite.config.js                 # Configure jsdom and test setup
│   └── package.json                   # Add test scripts; preserve existing scripts
└── ...                                # Existing backend and project files
```

> **Terminal location:** Run frontend setup and tests from `Demo_project/client`. All `src/...` paths in the prompts below are relative to this directory.

## Before Recording — Inspect the Existing Component

Open `client/src/components/TaskModal.jsx`. Verify that it receives `isOpen`, `onClose`, `onSubmit`, `initialData`, `isSubmitting`, and `error` props. Confirm the exact accessible labels and buttons, the existing title validation, `dueDate: null` behavior, API error display, and Escape-key handler before creating tests. Do not assume a `TaskForm.jsx` file exists.

Check whether the `w1-s07-start` branch exists before checking it out. If it is unavailable, use the extracted project checkpoint; do not invent a branch.

## Prompt 1 — Configure Vitest and Testing Library

**Copy into Claude Code (from `client/`):**

```text
Inspect this existing React/Vite project and configure component testing using Vitest, jsdom, React Testing Library, user-event, and jest-dom matchers.

1. Preserve the existing React plugin and all unrelated Vite configuration in vite.config.js. Use defineConfig from vitest/config and add test.environment = 'jsdom' and test.setupFiles = './src/test/setup.js'.
2. Create src/test/setup.js. Import afterEach from vitest, cleanup from @testing-library/react, and @testing-library/jest-dom/vitest; call cleanup() after each test.
3. Add "test": "vitest run" and "test:watch": "vitest" to the existing scripts in client/package.json, without removing dev, build, lint, preview, or other scripts.
4. Verify or install the required development dependencies: vitest, jsdom, @testing-library/react, @testing-library/dom, @testing-library/user-event, and @testing-library/jest-dom.
5. Do not edit src/components/TaskModal.jsx or backend files.
6. Show the exact changed files and commands to verify the configuration.
```

**Command to show in the terminal:**

```powershell
cd client
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

## Prompt 2 — Create the First Two Component Tests

```text
Read src/components/TaskModal.jsx and create src/components/TaskModal.test.jsx using Vitest, @testing-library/react, and @testing-library/user-event.

Build a small reusable setup(props = {}) helper that renders <TaskModal isOpen={true} onClose={onClose} onSubmit={onSubmit} {...props} /> with vi.fn() mocks, returning the mocked callbacks.

Add exactly these two tests:
1. Enter a two-character title such as "AB", attempt to create a task, assert that the existing short-title validation message is visible, and assert that onSubmit was not called.
2. Enter a valid title "Write the README" with no due date, submit, and assert that onSubmit receives the complete existing payload: title "Write the README", description "", status "todo", priority "medium", and dueDate null.

Use accessible label and role queries matching the actual component. Keep the component unchanged. Do not create an alternative form or mock the backend.
```

**File created:** `client/src/components/TaskModal.test.jsx`.

## Prompt 3 — Add Disabled-State and API Error Tests

```text
Extend src/components/TaskModal.test.jsx with exactly two more tests inside its existing describe block and reuse its setup helper:

3. Render with isSubmitting: true and verify that the submit button displays the component's saving label ("Creating…" if that is the exact current label) and is disabled.
4. Render with an API error whose errors array contains { field: 'dueDate', message: 'Due date must be in the future' }; verify the field-specific message is visible and the Create Task button remains enabled when isSubmitting is false.

Use the actual rendered text and accessibility semantics in TaskModal.jsx. Do not modify application code. The file should now contain four tests.
```

**Run:**

```powershell
npm test
```

## Prompt 4 — Investigate an Intentional Failing Assertion

**First, make one temporary, deliberate edit to Test 2:** remove the line `dueDate: null,` from the object passed to `toHaveBeenCalledWith()`; leave `TaskModal.jsx` unchanged. Then use this prompt:

```text
Run the four TaskModal component tests and inspect the failing submitted-payload assertion. Compare its expected argument with the actual onSubmit payload in src/components/TaskModal.jsx.

Explain why the test expects no dueDate property but the component supplies dueDate: null when the date field is empty. Do not alter the component or the payload contract. Fix only the test assertion so it expects dueDate: null. Rerun the tests and report the actual passing or failing result.
```

**Commands:**

```powershell
npm test
```

**What to show:** A deliberate mismatch should produce one failing test if the initial four tests otherwise work; after correcting the assertion, verify that all four pass. Treat these as expected outcomes, not guaranteed output.

## Prompt 5 — Review Missing Coverage Without Changing Files

```text
Read src/components/TaskModal.jsx and src/components/TaskModal.test.jsx. Suggest up to six additional test cases not already covered. Focus on user-visible behavior, including title validation, due-date selection, modal interactions, and submission data. Describe each case in one line. Do not modify any files yet.
```

Review Claude Code's actual suggestions. Select these three if they match the current component's behavior: reject whitespace-only titles, submit a selected due date, and close the modal with Escape. Avoid duplicate saving-state tests, snapshots, and tests of internal React state.

## Prompt 6 — Add Three Selected Tests

```text
Extend src/components/TaskModal.test.jsx to contain exactly seven tests in total.

Add these three new tests:
5. Reject a title consisting only of spaces. Verify the existing minimum-title validation message and that onSubmit is not called.
6. Enter "Write the README", select due date "2030-01-15", submit, and assert that the onSubmit payload includes dueDate: '2030-01-15' alongside the existing title, description, status, and priority fields.
7. Press Escape while the modal is open and assert onClose is called once.

Use Vitest, React Testing Library, user-event, the current component's accessible labels, and mocked callbacks. Reuse the existing setup helper in the same scope; if adding another describe block, ensure the helper is in scope there too. Do not change TaskModal.jsx or unrelated application files. Run npm test, inspect failures, and fix only test code when the component's existing contract is correct.
```

**Final verification:**

```powershell
npm test
```

Expected target: **one `TaskModal.test.jsx` suite, seven passing tests**. If any test fails, review the actual output rather than claiming success.

## Optional Prompt 7 — Review the Completed Test File

```text
Review src/components/TaskModal.test.jsx for duplicated test cases, incorrect assertions, unused imports, inaccessible queries, and mutations of application files. Confirm that exactly seven tests cover short titles, null due dates, submitting state, API field errors, whitespace-only titles, selected due dates, and Escape closure. Do not alter application behavior. Summarize which files changed and the actual npm test results.
```

## Demo Recording Checklist

- Open the **existing** `TaskModal.jsx` and inspect its contract.
- Install and configure testing dependencies in `client/`.
- Create `client/src/test/setup.js` and update `client/vite.config.js`.
- Add the two submission/validation tests to `TaskModal.test.jsx`.
- Add disabled-state and API-error tests.
- Intentionally break the missing-date expectation; show its failure and correction.
- Ask Claude Code for additional tests **without editing files**.
- Implement three selected tests and verify the seven-test suite.
- Keep `TaskModal.jsx` and the backend unchanged.

**Note:** This prompt document is derived from the supplied hands-on script. All outcomes should be verified in the actual project during recording.
