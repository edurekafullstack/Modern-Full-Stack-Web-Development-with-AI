# Building an Express Server with Environment Configuration — Claude Code Prompts

## Prompt 1 — Part 2: Ask Claude Code to Plan the Express Migration

We’re moving this project from the http module to Express.

Before writing any code, outline a plan.

Install Express.

Split the code into src/app.js, which creates the Express app, registers the existing GET / and GET /health routes using the response helpers, and exports the app, and src/server.js, which imports the app and starts listening.

Don’t make any changes yet.

## Prompt 2 — Part 3: Install Express and Create the Application Structure

The plan looks good.

Go ahead: install express, then create src/app.js and rewrite src/server.js as described.

Use res.json() to send responses, and keep port 3000 hard-coded for now.

## Prompt 3 — Part 5: Add Environment Configuration with Claude Code

Add environment configuration using the dotenv package that’s already installed.

Create src/config/env.js.

It should load .env with dotenv’s quiet option and export a single env object containing port, converted to a number and defaulting to 3000, and nodeEnv, defaulting to "development".

Create a .env file with PORT=4000 and NODE_ENV=development.

Create a .env.example file with the same keys and safe default values.

Update server.js to use env, and include the environment in the GET / response.

## Prompt 4 — Part 7: Add nodemon Through Claude Code Chat

Install nodemon as a dev dependency and add a dev script to package.json that runs src/server.js with nodemon.

Keep the existing start script unchanged.
