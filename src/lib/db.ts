import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

// Ensure the database name is 'veritus'
const MONGODB_URI_WITH_DB = MONGODB_URI.endsWith('/') 
  ? `${MONGODB_URI}veritus` 
  : MONGODB_URI.includes('?') 
    ? MONGODB_URI.replace('?', '/veritus?')
    : `${MONGODB_URI}/veritus`;


interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI_WITH_DB, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
