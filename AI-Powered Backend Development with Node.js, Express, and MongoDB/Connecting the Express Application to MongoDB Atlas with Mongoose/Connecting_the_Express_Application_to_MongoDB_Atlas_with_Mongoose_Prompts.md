# Connecting the Express Application to MongoDB Atlas with Mongoose — Claude Code Prompts

## Prompt 1 — Part 6: Generate the Database Module with Claude Code

Install mongoose.

Add MONGODB_URI to the env object in src/config/env.js, and throw a clear error at startup if it is missing.

Then create src/config/db.js that exports an async connectDB function.

It should connect with mongoose.connect using env.mongoUri and a 10-second server selection timeout, log the connected host and database name, and let any connection error propagate to the caller.

After connecting, log runtime connection errors and disconnections.

Also export a dbStatus function that returns "connected" or "disconnected" from the connection’s readyState.

Use async/await, not callbacks.

## Prompt 2 — Part 9: Start the Server Only After MongoDB Connects

Update src/server.js so that it awaits connectDB before calling app.listen.

If the connection fails, log the error message and exit the process with code 1.

Then add the database status from dbStatus to the GET /health response in app.js.
