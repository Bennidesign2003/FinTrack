import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  // In production you might want to throw instead of just logging
  console.warn('No MONGODB_URI env var set for MongoDB connection (lib/mongodb.ts)')
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = globalThis['mongoose_cache'] || { conn: null, promise: null }

if (!cached) cached = { conn: null, promise: null }

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { keepAlive: true } as any).then(m => m)
  }

  cached.conn = await cached.promise
  globalThis['mongoose_cache'] = cached
  return cached.conn
}

export default connectToDatabase
