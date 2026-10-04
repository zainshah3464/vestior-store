/**
 * MongoDB Atlas client — serverless-safe singleton.
 *
 * Why the global cache?
 *   In development, Next.js hot-reloads modules on every file save.
 *   Without caching, each reload would spawn a new MongoClient,
 *   quickly exhausting the Atlas connection limit.
 *
 *   In production (Vercel Functions), we cache at module scope so
 *   a warm function instance reuses the same connection pool.
 */

import { MongoClient, Db, type MongoClientOptions } from 'mongodb'
import { env } from '@/lib/env'

// ─────────────────────────────────────────────────────────────
// Connection options — tuned for serverless
// ─────────────────────────────────────────────────────────────
const options: MongoClientOptions = {
  // Per-instance pool — keep low. Atlas free tier allows 500 total.
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60_000,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  // Retry writes on transient network errors
  retryWrites: true,
  retryReads: true,
}

// ─────────────────────────────────────────────────────────────
// Global cache (survives Next.js HMR in development)
// ─────────────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(env.MONGODB_URI, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(env.MONGODB_URI, options)
  clientPromise = client.connect()
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Get the MongoDB database handle.
 *
 *   const db = await getDb()
 *   const events = db.collection('events')
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(env.MONGODB_DB_NAME)
}

/**
 * Get the raw MongoClient (for advanced use — transactions, etc.)
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise
}

/**
 * Collection name constants — avoid typos across the codebase.
 */
export const COLLECTIONS = {
  EVENTS: 'events',
  EMAIL_LOGS: 'email_logs',
  PAYMENT_TRANSACTIONS: 'payment_transactions',
  AUDIT_LOGS: 'audit_logs',
  ANALYTICS_DAILY: 'analytics_daily',
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]