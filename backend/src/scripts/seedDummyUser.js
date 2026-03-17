const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const User = require('../models/User');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/startup-validator';
  let memoryServer;
  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.warn(`MongoDB connection failed (${err.message}). Using in-memory MongoDB for seeding.`);
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
  }

  const email = process.env.DUMMY_USER_EMAIL || 'demo@startup.dev';
  const password = process.env.DUMMY_USER_PASSWORD || 'password123';
  const name = process.env.DUMMY_USER_NAME || 'Demo User';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Dummy user already exists: ${email}`);
    return;
  }

  await User.create({ name, email, password });
  console.log(`Created dummy user: ${email} / ${password}`);

  if (memoryServer) {
    console.log('Note: in-memory MongoDB is ephemeral; data resets when the process exits.');
    await memoryServer.stop();
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch (_) {}
  });

