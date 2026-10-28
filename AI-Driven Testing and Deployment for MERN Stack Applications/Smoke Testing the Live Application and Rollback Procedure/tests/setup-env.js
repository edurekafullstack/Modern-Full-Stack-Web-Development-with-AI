// Runs before each test file, before any application code is imported.
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://unused-in-tests";
process.env.JWT_SECRET = "test-secret-not-used-outside-tests";
