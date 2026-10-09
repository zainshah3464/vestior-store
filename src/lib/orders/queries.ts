import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getDb, COLLECTIONS } from '@/lib/mongodb'

// ─────────────────────────────────────────────────────────────
// Full order detail with items, customer, payment, timeline
// ─────────────────────────────────────────────────────────────
export interface OrderDetail {
  order: {
    id: string
    userId: string
    userEmail: string
    items: unknown
    address: Record<string, unknown>
    subtotal: number
    shipping: number
    total: number
    status: string
    paymentStatus: string
    paymentMethod: string
    paymentProvider: string | null
    paymentIntentId: string | null
    paidAt: string | null
    createdAt: string
  }
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
      slug?: string
    } | null
  }>
  customer: {
    id: string
    fullName: string | null
    email: string | null
    phone: string | null
  } | null
  payment: {
    provider: string
    providerTxnId: string
    amount: number
    currency: string
    status: string
    method?: string
    webhookEvents: Array<{ event: string; at: string; raw: unknown }>
    createdAt: string
  } | null
  auditLogs: Array<{
    id: string
    actorEmail: string
    action: string
    timestamp: string
    metadata: Record<string, unknown>
  }>
}

export async function fetchOrderDetail(orderId: string): Promise<OrderDetail | null> {
  // 1. Order
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) return null

  // 2. Items + product info
  const { data: rawItems } = await supabaseAdmin
    .from('order_items')
    .select('id, product_id, product_name, quantity, price, products(id, name, images)')
    .eq('order_id', orderId)

  // 3. Customer
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, phone')
    .eq('id', order.user_id)
    .single()

  // 4. Payment (MongoDB)
  let payment: OrderDetail['payment'] = null
  let auditLogs: OrderDetail['auditLogs'] = []

  try {
    const db = await getDb()

    const txn = await db
      .collection(COLLECTIONS.PAYMENT_TRANSACTIONS)
      .findOne({ order_id: orderId })

    if (txn) {
      payment = {
        provider: txn.provider,
        providerTxnId: txn.provider_txn_id,
        amount: txn.amount,
        currency: txn.currency,
        status: txn.status,
        method: txn.method,
        webhookEvents: (txn.webhook_events ?? []).map((e: { event: string; at: Date | string; raw: unknown }) => ({
          event: e.event,
          at: e.at instanceof Date ? e.at.toISOString() : String(e.at),
          raw: e.raw,
        })),
        createdAt:
          txn.created_at instanceof Date
            ? txn.created_at.toISOString()
            : String(txn.created_at),
      }
    }

    const auditDocs = await db
      .collection(COLLECTIONS.AUDIT_LOGS)
      .find({ target_id: orderId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    auditLogs = auditDocs.map((d) => ({
      id: String(d._id),
      actorEmail: d.actor_email,
      action: d.action,
      timestamp:
        d.timestamp instanceof Date
          ? d.timestamp.toISOString()
          : String(d.timestamp),
      metadata: d.metadata ?? {},
    }))
  } catch (err) {
    console.error('[fetchOrderDetail] mongo lookup failed:', err)
  }

  // 5. Parse images
  const parsedItems = (rawItems ?? []).map((item) => {
    const rawProduct = item.products as unknown as
  | { id: string; name: string; images: unknown }
  | null
    let images: string[] = []
    if (rawProduct?.images) {
      if (Array.isArray(rawProduct.images)) {
        images = rawProduct.images as string[]
      } else if (typeof rawProduct.images === 'string') {
        try {
          const parsed = JSON.parse(rawProduct.images)
          images = Array.isArray(parsed) ? parsed : []
        } catch {
          images = []
        }
      }
    }

    return {
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: item.price,
      product: rawProduct
        ? {
            id: rawProduct.id,
            name: rawProduct.name,
            images,
          }
        : null,
    }
  })

  return {
    order: {
      id: order.id,
      userId: order.user_id,
      userEmail: order.user_email,
      items: order.items,
      address: order.address as Record<string, unknown>,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      paymentProvider: order.payment_provider ?? null,
      paymentIntentId: order.payment_intent_id ?? null,
      paidAt: order.paid_at ?? null,
      createdAt: order.created_at,
    },
    items: parsedItems,
    customer: profile
      ? {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        }
      : null,
    payment,
    auditLogs,
  }
}