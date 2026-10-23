# Hands-On: Initialising a Node.js Project with npm

## Claude Code Prompts

### Part 3: Initialize the Node.js Project Through Claude Code Chat

Initialize a Node.js project in the server folder.
Run npm init with default values, then set "type" to "module" so the project uses ES modules.
Add a start script that runs src/server.js.
Create a .gitignore for a Node.js project that ignores node_modules, .env files, logs, and coverage reports.
Don't install any packages yet.
Before making changes, explain what you are going to do.

### Part 5: Create a Reusable Response Utility Through Claude Code Chat

Create a utility module at src/utils/response.js that exports two named functions: success, which takes data and an optional message, and failure, which takes a message.
Each should return a plain object with a status field.
Then create src/server.js that imports both functions and logs one example of each.
Use ES module syntax.
