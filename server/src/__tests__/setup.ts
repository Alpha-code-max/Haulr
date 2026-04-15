import { beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import "dotenv/config";

beforeAll(async () => {
  // Give each test file its own unique database to prevent parallel conflicts!
  const randomSuffix = Math.random().toString(36).substring(7);
  const mongoUri = process.env.MONGO_URI!.replace("moveit", `moveit-test-${randomSuffix}`);
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Drop the temporary throw-away database entirely so it doesn't take up space on Mongo Atlas
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});
