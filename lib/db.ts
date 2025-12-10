import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithMongooseCache = global as typeof global & { mongooseCache: MongooseCache };

if (!globalWithMongooseCache.mongooseCache) {
  globalWithMongooseCache.mongooseCache = { conn: null, promise: null };
}

const cached = globalWithMongooseCache.mongooseCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: process.env.MONGODB_DB_NAME,
      })
      .then((connection) => connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

