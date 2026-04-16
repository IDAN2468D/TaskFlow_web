import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
  mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

const globalWithMongoose = global as unknown as GlobalMongoose;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * Type-safe access to the cached connection.
 */
const _cached = cached;

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (_cached.conn) {
    return _cached.conn;
  }

  if (!_cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    _cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    _cached.conn = await _cached.promise;
  } catch (e) {
    _cached.promise = null;
    throw e;
  }

  return _cached.conn;
}

export default dbConnect;
