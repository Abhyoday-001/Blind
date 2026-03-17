const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let memoryServer;
let cleanupRegistered = false;

async function ensureDevDummyUser() {
  if ((process.env.NODE_ENV || 'development') !== 'development') return;
  const User = require('../models/User');

  const email = process.env.DUMMY_USER_EMAIL || 'demo@startup.dev';
  const password = process.env.DUMMY_USER_PASSWORD || 'password123';
  const name = process.env.DUMMY_USER_NAME || 'Demo User';

  const existing = await User.findOne({ email });
  if (existing) return;

  await User.create({ name, email, password });
  console.log(`Seeded dummy user for dev: ${email} / ${password}`);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/startup-validator',
      { serverSelectionTimeoutMS: 1500 },
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await ensureDevDummyUser();
  } catch (error) {
    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    if (!isDev) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }

    console.warn(`MongoDB connection failed (${error.message}). Falling back to local embedded MongoDB for development.`);
    const dbPath = path.join(__dirname, '..', '..', '..', '.data', 'mongo');
    fs.mkdirSync(dbPath, { recursive: true });

    const embeddedUri = process.env.EMBEDDED_MONGO_URI || 'mongodb://127.0.0.1:27018/startup-validator';

    // If an embedded mongod is already running (e.g. after a crash), reuse it.
    try {
      const conn = await mongoose.connect(embeddedUri, { serverSelectionTimeoutMS: 1500 });
      console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
      await ensureDevDummyUser();
      return;
    } catch (_) {
      // ignore and start a new embedded server
    }

    memoryServer = await MongoMemoryServer.create({
      instance: { dbPath, port: 27018, ip: '127.0.0.1' },
    });
    const uri = memoryServer.getUri('startup-validator');
    process.env.MONGO_URI = uri;
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 });
    console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
    await ensureDevDummyUser();

    if (!cleanupRegistered) {
      cleanupRegistered = true;
      const cleanup = async () => {
        try {
          await mongoose.disconnect();
        } catch (_) {}
        try {
          await memoryServer?.stop();
        } catch (_) {}
      };
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      process.on('exit', cleanup);
    }
  }
};

module.exports = connectDB;
