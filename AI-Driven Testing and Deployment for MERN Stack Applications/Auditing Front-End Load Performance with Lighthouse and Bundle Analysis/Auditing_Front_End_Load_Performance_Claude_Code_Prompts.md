# Auditing Front-End Load Performance with Lighthouse and Bundle Analysis — Claude Code Prompts

## Project File Placement

Place the Lighthouse runner at `client/scripts/lighthouse.js` (relative to the `Demo_project` root). Create `client/scripts/` if it does not exist. Save generated reports under `client/perf/`.

```text
Demo_project/
└── client/
    ├── scripts/
    │   └── lighthouse.js
    ├── perf/
    │   ├── baseline.html
    │   ├── all-lazy.html
    │   └── after.html
    ├── src/
    │   └── App.jsx
    ├── vite.config.js
    └── package.json
```

## Prompt 1 — Prepare the Lighthouse Runner

Create `client/scripts/lighthouse.js` and configure `client/package.json` to support repeatable Lighthouse audits.

Requirements:

1. Use the installed Lighthouse tooling and a compatible Chrome launch method. Check the existing dependency versions before implementing.
2. Accept a target URL and a report name as command-line arguments.
3. Run Lighthouse three times against the target URL using consistent settings.
4. Report the median Performance score, First Contentful Paint, Largest Contentful Paint, Total Blocking Time, and Cumulative Layout Shift, plus JavaScript transfer information when available.
5. Save an HTML report in `client/perf/<report-name>.html` and preserve reports from previous runs.
6. Add an npm script named `lighthouse` so this command works from `client/`: `npm run lighthouse -- http://localhost:4173/login baseline`.
7. Provide clear errors if Chrome is unavailable, the URL cannot be reached, or an audit fails.

Do not modify `client/src/App.jsx` or apply any performance optimizations yet. Keep the starting static imports unchanged for the baseline.

## Prompt 2 — Prepare Bundle Analysis

Inspect `client/vite.config.js` and `client/package.json`.

Requirements:

1. Configure `rollup-plugin-visualizer` for an `analyze` build mode, preserving existing React and test configuration.
2. Generate `client/stats.html` when running `npm run analyze` from `client/`.
3. Include gzip size information in the bundle visualization.
4. Add or verify the `analyze` npm script and required development dependency.
5. Do not change application imports or behavior.

## Prompt 3 — Identify Unnecessary Dependencies

Which files in `client/src` import Recharts, and which application routes render those components?

Explain why Recharts is included in the initial JavaScript bundle and whether the login page requires it.

Do not modify any files.

## Prompt 4 — Implement Lazy Loading

Apply route-level code splitting in `client/src/App.jsx` using `React.lazy` and `Suspense`.

Requirements:

1. Lazy-load `LoginPage`, `RegisterPage`, `ReportsPage`, and the main task-list component, using their actual existing import paths.
2. Add a suitable `Suspense` fallback.
3. Preserve authentication logic, navigation, route protection, and route behavior.
4. Do not modify page components or unrelated application functionality.

## Prompt 5 — Refine the Loading Strategy

Refine route-level code splitting in `client/src/App.jsx`.

Requirements:

1. Keep `LoginPage` and the main task-list component as regular static imports.
2. Lazy-load only `RegisterPage` and `ReportsPage` using `React.lazy`.
3. Preserve `Suspense`, authentication, navigation, and all existing functionality.
4. Do not modify any other files.

## Commands to Run During the Demo

Run these commands from `Demo_project/client/`. Keep the production preview running in a separate terminal when executing Lighthouse.

### Baseline — Before Any Lazy Loading

```bash
npm install
npm run build
npm run preview
```

In another terminal:

```bash
cd client
npm run lighthouse -- http://localhost:4173/login baseline
npm run analyze
```

Review `client/perf/baseline.html` and `client/stats.html` before making changes. Run Prompt 3 to investigate Recharts.

### All Routes Lazy — After Prompt 4

```bash
npm run build
npm run lighthouse -- http://localhost:4173/login all-lazy
```

Review `client/perf/all-lazy.html`.

### Refined Strategy — After Prompt 5

```bash
npm run build
npm run lighthouse -- http://localhost:4173/login after
```

Review `client/perf/after.html`. If necessary, restart the production preview after each build.

## Final Verification

Compare the baseline, all-lazy, and refined Lighthouse reports using actual recorded measurements. In Chrome DevTools, confirm the Reports chunk is not requested on the login page. Then start the API and frontend using the project's normal commands, log in, visit Reports, and verify the chart loads and its chunk is requested. Do not overwrite the baseline report or claim an improvement unless the measured results support it.
