import 'server-only'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// ─────────────────────────────────────────────────────────────
// Collection: cart_snapshots
// Unique index on userId (upsert per user)
// ─────────────────────────────────────────────────────────────

export interface CartSnapshotDoc {
  _id?: ObjectId
  user_id: string
  user_email: string
  user_name: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string | null
    size?: string | null
  }>
  subtotal: number
  item_count: number
  recovery_token: string
  recovery_email_sent_at: Date | null
  recovery_email_count: number
  last_reminder_at: Date | null
  recovered_at: Date | null
  recovered_order_id: string | null
  offered_coupon_code: string | null
  created_at: Date
  updated_at: Date
}

/**
 * Ensure indexes (idempotent, safe to call on every cold start).
 */
let indexesEnsured = false
export async function ensureCartIndexes() {
  if (indexesEnsured) return
  try {
    const db = await getDb()
    const coll = db.collection(COLLECTIONS.CART_SNAPSHOTS)
    await coll.createIndex({ user_id: 1 }, { unique: true })
    await coll.createIndex({ recovery_token: 1 }, { unique: true })
    await coll.createIndex({ updated_at: -1 })
    await coll.createIndex(
      { recovered_at: 1, last_reminder_at: 1 },
      { sparse: true }
    )
    indexesEnsured = true
  } catch (err) {
    console.error('[ensureCartIndexes] failed:', err)
  }
}

/**
 * Upsert cart snapshot for a user.
 */
export async function saveCartSnapshot(input: {
  userId: string
  userEmail: string
  userName: string
  items: CartSnapshotDoc['items']
  subtotal: number
  itemCount: number
}): Promise<void> {
  const db = await getDb()
  const coll = db.collection<CartSnapshotDoc>(COLLECTIONS.CART_SNAPSHOTS)
  const now = new Date()

  // If items empty → delete snapshot (they checked out or cleared)
  if (input.itemCount === 0 || input.items.length === 0) {
    await coll.deleteOne({ user_id: input.userId })
    return
  }

  await coll.updateOne(
    { user_id: input.userId },
    {
      $set: {
        user_email: input.userEmail,
        user_name: input.userName,
        items: input.items,
        subtotal: input.subtotal,
        item_count: input.itemCount,
        updated_at: now,
      },
      $setOnInsert: {
        user_id: input.userId,
        recovery_token: crypto.randomUUID(),
        recovery_email_sent_at: null,
        recovery_email_count: 0,
        last_reminder_at: null,
        recovered_at: null,
        recovered_order_id: null,
        offered_coupon_code: null,
        created_at: now,
      },
    },
    { upsert: true }
  )
}

/**
 * Mark cart as recovered (called after successful order).
 */
export async function markCartRecovered(
  userId: string,
  orderId: string
): Promise<void> {
  try {
    const db = await getDb()
    await db.collection(COLLECTIONS.CART_SNAPSHOTS).updateOne(
      { user_id: userId },
      {
        $set: {
          recovered_at: new Date(),
          recovered_order_id: orderId,
          items: [],
          item_count: 0,
          updated_at: new Date(),
        },
      }
    )
  } catch (err) {
    console.error('[markCartRecovered] failed:', err)
  }
}

/**
 * Find carts eligible for reminder email.
 *
 * Criteria:
 *   • has items (item_count > 0)
 *   • not recovered
 *   • last updated > 2 hours ago
 *   • last reminder > 7 days ago OR never reminded
 *   • max 3 reminders total
 */
export async function findAbandonedCarts(
  minAgeHours = 2,
  maxReminders = 3,
  limit = 100
): Promise<CartSnapshotDoc[]> {
  const db = await getDb()
  const coll = db.collection<CartSnapshotDoc>(COLLECTIONS.CART_SNAPSHOTS)

  const minAge = new Date(Date.now() - minAgeHours * 3600 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400 * 1000)

  return coll
    .find({
      item_count: { $gt: 0 },
      recovered_at: null,
      updated_at: { $lte: minAge },
      recovery_email_count: { $lt: maxReminders },
      $or: [
        { last_reminder_at: null },
        { last_reminder_at: { $lte: sevenDaysAgo } },
      ],
    })
    .sort({ updated_at: 1 })
    .limit(limit)
    .toArray()
}

/**
 * Record that a reminder email was sent.
 */
export async function markReminderSent(
  cartId: ObjectId,
  offeredCouponCode: string | null
): Promise<void> {
  const db = await getDb()
  await db.collection(COLLECTIONS.CART_SNAPSHOTS).updateOne(
    { _id: cartId },
    {
      $set: {
        last_reminder_at: new Date(),
        recovery_email_sent_at: new Date(),
        offered_coupon_code: offeredCouponCode,
        updated_at: new Date(),
      },
      $inc: { recovery_email_count: 1 },
    }
  )
}

/**
 * Find by recovery token (for the recovery link).
 */
export async function findCartByToken(
  token: string
): Promise<CartSnapshotDoc | null> {
  const db = await getDb()
  return db
    .collection<CartSnapshotDoc>(COLLECTIONS.CART_SNAPSHOTS)
    .findOne({ recovery_token: token })
}

/**
 * Admin stats
 */
export interface CartStats {
  totalAbandoned: number
  recovered: number
  recoveryRate: number
  totalValue: number
  recoveredValue: number
  emailsSent: number
}

export async function getCartStats(): Promise<CartStats> {
  const db = await getDb()
  const coll = db.collection<CartSnapshotDoc>(COLLECTIONS.CART_SNAPSHOTS)

  const [
    totalAbandoned,
    recovered,
    totalValueAgg,
    recoveredValueAgg,
    emailsSentAgg,
  ] = await Promise.all([
    coll.countDocuments({ item_count: { $gt: 0 }, recovered_at: null }),
    coll.countDocuments({ recovered_at: { $ne: null } }),
    coll
      .aggregate<{ _id: null; total: number }>([
        { $match: { item_count: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$subtotal' } } },
      ])
      .toArray(),
    coll
      .aggregate<{ _id: null; total: number }>([
        { $match: { recovered_at: { $ne: null } } },
        { $group: { _id: null, total: { $sum: '$subtotal' } } },
      ])
      .toArray(),
    coll
      .aggregate<{ _id: null; total: number }>([
        { $group: { _id: null, total: { $sum: '$recovery_email_count' } } },
      ])
      .toArray(),
  ])

  const totalValue = totalValueAgg[0]?.total ?? 0
  const recoveredValue = recoveredValueAgg[0]?.total ?? 0
  const recoveryRate =
    totalAbandoned + recovered > 0
      ? (recovered / (totalAbandoned + recovered)) * 100
      : 0

  return {
    totalAbandoned,
    recovered,
    recoveryRate,
    totalValue,
    recoveredValue,
    emailsSent: emailsSentAgg[0]?.total ?? 0,
  }
}

/**
 * Admin list
 */
export async function listAbandonedCarts(options: {
  onlyPending?: boolean
  limit?: number
  skip?: number
} = {}) {
  const db = await getDb()
  const coll = db.collection<CartSnapshotDoc>(COLLECTIONS.CART_SNAPSHOTS)
  const filter = options.onlyPending
    ? { item_count: { $gt: 0 }, recovered_at: null }
    : {}

  const [items, total] = await Promise.all([
    coll
      .find(filter)
      .sort({ updated_at: -1 })
      .limit(options.limit ?? 20)
      .skip(options.skip ?? 0)
      .toArray(),
    coll.countDocuments(filter),
  ])

  return { items, total }
}