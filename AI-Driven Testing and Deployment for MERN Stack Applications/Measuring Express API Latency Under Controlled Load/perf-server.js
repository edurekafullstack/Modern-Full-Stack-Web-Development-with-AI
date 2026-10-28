// Isolated, disposable MongoDB performance environment for W2_S03 and W2_S04.
// Run: npm run perf:server -- 100000
// WARNING: destroys ONLY the in-memory perf database each time it starts.
// Test commands are enabled so faults can be injected with configureFailPoint,
// scoped to the API's connections with appName "task-api".
import { mkdir, writeFile } from 'node:fs/promises';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const taskCount = Number(process.argv[2] ?? 100000);
if (!Number.isSafeInteger(taskCount) || taskCount < 1 || taskCount > 500000) {
  throw new Error('Task count must be an integer from 1 to 500000');
}
const mongoPort = 27018;
const apiPort = 3002;
const database = 'perf';
const appName = 'task-api';
const jwtSecret = 'local-perf-only-secret-not-for-production';
process.env.MONGODB_URI = `mongodb://127.0.0.1:${mongoPort}/${database}?appName=${appName}`;
process.env.JWT_SECRET = jwtSecret;
process.env.PORT = String(apiPort);
process.env.NODE_ENV = 'test'; // Avoid request log overhead in benchmarks.
process.env.CLIENT_ORIGINS = 'http://localhost:5173';

let mongod;
let httpServer;
try {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: mongoPort,
      ip: '127.0.0.1',
      dbName: database,
      args: ['--setParameter', 'enableTestCommands=1'],
    },
  });
  // Keep the W2_S03 baseline free of auto-built task indexes, even though the
  // original project schema already declares three unrelated task indexes.
  mongoose.set('autoIndex', false);
  await mongoose.connect(process.env.MONGODB_URI);
  const [{ User }, { Task }] = await Promise.all([
    import('../src/models/user.model.js'),
    import('../src/models/task.model.js'),
  ]);
  const password = await bcrypt.hash('PerformanceDemo123!', 12);
  const users = Array.from({ length: 50 }, (_, i) => ({
    name: `Load User ${i + 1}`,
    email: `load${i + 1}@example.com`,
    password,
    role: 'user',
  }));
  const inserted = await User.collection.insertMany(users, { ordered: true });
  const ownerIds = Object.values(inserted.insertedIds);
  const statuses = ['todo', 'in-progress', 'done'];
  const priorities = ['low', 'medium', 'high'];
  const batchSize = 2000;
  for (let start = 0; start < taskCount; start += batchSize) {
    const docs = [];
    for (let i = start; i < Math.min(start + batchSize, taskCount); i++) {
      docs.push({
        title: `Performance task ${i + 1}`,
        owner: ownerIds[i % ownerIds.length],
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
        createdAt: new Date(Date.now() - i * 1000),
        updatedAt: new Date(),
      });
    }
    await Task.collection.insertMany(docs, { ordered: false });
  }
  // W2_S04: opt in to the *current schema* indexes after they are added in
  // the recording; W2_S03 and pre-index W2_S04 should leave this flag unset.
  if (process.env.PERF_BUILD_SCHEMA_INDEXES === '1') {
    await Task.createIndexes();
    console.log('Built Task schema indexes:', (await Task.collection.indexes()).map(x => x.name));
  }
  const token = jwt.sign({ sub: String(ownerIds[0]) }, jwtSecret, { expiresIn: '8h' });
  await mkdir('perf', { recursive: true });
  await writeFile('perf/token.txt', token + '\n', { mode: 0o600 });
  const { default: app } = await import('../src/app.js');
  httpServer = app.listen(apiPort, '127.0.0.1');
  await new Promise((resolve, reject) => {
    httpServer.once('listening', resolve);
    httpServer.once('error', reject);
  });
  console.log(`Seeded 50 users and ${taskCount} tasks into ${process.env.MONGODB_URI}`);
  console.log(`API listening on port ${apiPort}`);
  console.log('Token written to perf/token.txt (do not commit)');
  console.log(`Fault injection enabled: configureFailPoint with appName "${appName}"`);
} catch (error) {
  console.error('Performance server failed:', error);
  if (httpServer) httpServer.close();
  await mongoose.disconnect().catch(() => {});
  if (mongod) await mongod.stop().catch(() => {});
  process.exitCode = 1;
}
async function shutdown() {
  if (httpServer) await new Promise(resolve => httpServer.close(resolve));
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
