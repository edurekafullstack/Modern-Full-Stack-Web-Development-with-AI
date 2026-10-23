# Bundle Scan Script Prompt

```text
Create scripts/scan-bundle.js, a Node script with no dependencies that reads every file in dist/ recursively and checks for the patterns /sk-ant-[A-Za-z0-9_-]+/ and /ANTHROPIC_API_KEY/. If anything matches, print each file and pattern and exit with code 1. Otherwise print how many files were scanned and "No API keys found." Add a "scan:bundle" script to package.json that runs it.
```