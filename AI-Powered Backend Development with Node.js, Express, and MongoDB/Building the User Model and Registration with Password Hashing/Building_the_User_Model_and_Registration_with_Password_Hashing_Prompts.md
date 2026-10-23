# Building the User Model and Registration with Password Hashing — Claude Code Prompts

## Step 2: Create the Mongoose User Schema

Create src/models/user.model.js with a Mongoose User model.



Requirements:



\- name is required, trimmed, and at most 60 characters.

\- email is required, unique, trimmed, and stored in lowercase.

\- password is required and must be at least 8 characters.

\- Exclude password from query results by default using select: false.

\- Enable timestamps.

\- Add clear custom validation messages.



Do not add password hashing yet.

## Step 3: Add Password Hashing with bcrypt

Install bcrypt.



In src/models/user.model.js, add a pre-save hook

that hashes the password using bcrypt.



Requirements:



\- Use a cost factor of 12.

\- Hash the password only when it has been modified.

\- Use an async function compatible with Mongoose 9.

\- Do not use the older next() callback pattern.

\- Preserve the existing User schema.

## Step 4: Build the Registration Endpoint

Add user registration to the existing Express API.



Create:



1\. src/validators/auth.validators.js

2\. src/services/auth.service.js

3\. src/controllers/auth.controller.js

4\. src/routes/auth.routes.js



Requirements:



\- Add registerRules using express-validator.

\- name must be trimmed, required, and at most 60 characters.

\- email must be trimmed, required, valid, and converted to lowercase.

\- password must be at least 8 characters and at most 72 bytes.

\- Do not trim passwords.

\- The auth service should create a user using the User model.

\- The controller should accept only name, email, and password.

\- Return HTTP 201 with the existing success response helper.

\- Use registerRules and the existing validate middleware.

\- Mount the auth router at /auth in src/routes/index.js.



Preserve the existing project structure.

## Step 6: Prevent Password-Hash Exposure

The registration response currently includes the hashed password.



The User schema already uses select: false, but this

does not remove the password from the document

returned by User.create().



Add a toJSON transform to the User schema that

removes the password field whenever a User document

is serialized to JSON.



Preserve the existing schema, timestamps, and

bcrypt pre-save hook.

