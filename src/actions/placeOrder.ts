'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { getPaymentProvider, isPaymentProviderId } from '@/lib/payments'
import type { PaymentProviderId } from '@/lib/payments'

const MAX_QUANTITY_PER_ITEM = 50
const MAX_DISTINCT_ITEMS = 30

interface CartItemInput {
  product_id: string
  quantity: number
}

interface AddressInput {
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

interface PlaceOrderResult {
  success: true
  orderId: string
  subtotal: number
  shipping: number
  total: number
  /** Present only when payment_method is not 'cod' */
  clientSecret?: string
  paymentIntentId?: string
  paymentProvider: PaymentProviderId
}

export async function placeOrder(
  items: CartItemInput[],
  address: AddressInput,
  paymentMethod: PaymentProviderId = 'cod'
): Promise<PlaceOrderResult> {
  // ────────────────────────────────────────────
  // 0. Validate payment method
  // ────────────────────────────────────────────
  if (!isPaymentProviderId(paymentMethod)) {
    throw new Error(`Invalid payment method: ${paymentMethod}`)
  }

  // ────────────────────────────────────────────
  // 1. Validate input shape (unchanged)
  // ────────────────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty')
  }
  if (items.length > MAX_DISTINCT_ITEMS * 3) {
    throw new Error('Cart contains too many items')
  }

  for (const item of items) {
    if (!item?.product_id || typeof item.product_id !== 'string') {
      throw new Error('Invalid product ID in cart')
    }
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY_PER_ITEM
    ) {
      throw new Error(
        `Invalid quantity (must be 1–${MAX_QUANTITY_PER_ITEM})`
      )
    }
  }

  const requiredAddressFields: (keyof AddressInput)[] = [
    'full_name',
    'phone',
    'line1',
    'city',
    'state',
    'pincode',
  ]
  for (const field of requiredAddressFields) {
    const value = address?.[field]
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Address field "${field}" is required`)
    }
  }

  // ────────────────────────────────────────────
  // 2. Merge duplicates (unchanged)
  // ────────────────────────────────────────────
  const mergedMap = new Map<string, number>()
  for (const item of items) {
    const prev = mergedMap.get(item.product_id) ?? 0
    mergedMap.set(item.product_id, prev + item.quantity)
  }

  if (mergedMap.size > MAX_DISTINCT_ITEMS) {
    throw new Error('Too many distinct items in cart')
  }

  const normalizedItems: CartItemInput[] = []
  for (const [product_id, quantity] of mergedMap.entries()) {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(
        `Total quantity for one product cannot exceed ${MAX_QUANTITY_PER_ITEM}`
      )
    }
    normalizedItems.push({ product_id, quantity })
  }

  // ────────────────────────────────────────────
  // 3. Authenticate (unchanged)
  // ────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to place an order')
  }

  // ────────────────────────────────────────────
  // 4. Atomic order creation (unchanged RPC)
  //    Order is created with payment_status='pending'
  // ────────────────────────────────────────────
  const { data, error } = await supabaseAdmin.rpc('place_order_atomic', {
    p_user_id: user.id,
    p_user_email: user.email!,
    p_items: normalizedItems,
    p_address: {
      full_name: address.full_name.trim(),
      phone: address.phone.trim(),
      line1: address.line1.trim(),
      line2: address.line2?.trim() || '',
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    },
  })

  if (error) {
    const raw = (error.message || '').trim()
    const cleaned = raw
      .replace(/^PostgresError:\s*/i, '')
      .replace(/^P\d{4}:\s*/, '')
      .trim()
    throw new Error(cleaned || 'Failed to place order')
  }

  const result = data as {
    order_id: string
    subtotal: number
    shipping: number
    total: number
  }

  // ────────────────────────────────────────────
  // 5. Tag order with payment provider
  // ────────────────────────────────────────────
  await supabaseAdmin
    .from('orders')
    .update({ payment_provider: paymentMethod })
    .eq('id', result.order_id)

  // ────────────────────────────────────────────
  // 6. For non-COD: create PaymentIntent
  // ────────────────────────────────────────────
  let clientSecret: string | undefined
  let paymentIntentId: string | undefined

  if (paymentMethod !== 'cod') {
    const provider = getPaymentProvider(paymentMethod)

    const intent = await provider.createPaymentIntent({
      orderId: result.order_id,
      amount: Math.round(result.total * 100), // PKR in paise
      currency: 'pkr',
      customerEmail: user.email!,
      metadata: {
        userId: user.id,
      },
    })

    clientSecret = intent.clientSecret
    paymentIntentId = intent.id

    // Persist intent ID on the order
    await supabaseAdmin
      .from('orders')
      .update({
        payment_intent_id: intent.id,
        payment_metadata: intent.raw as object,
      })
      .eq('id', result.order_id)
  }

  // ────────────────────────────────────────────
  // 7. Track order_placed (fire-and-forget, non-blocking)
  //    Uses dynamic imports so MongoDB/env code
  //    never enters the client bundle.
  // ────────────────────────────────────────────
  try {
    const { getDb, COLLECTIONS } = await import('@/lib/mongodb')

    const db = await getDb()
    await db.collection(COLLECTIONS.EVENTS).insertOne({
      user_id: user.id,
      session_id: 'server', // server-side has no session
      event_type: 'order_placed',
      properties: {
        orderId: result.order_id,
        total: result.total,
        itemCount: normalizedItems.length,
        paymentMethod,
      },
      ip_hash: 'server',
      country: null,
      city: null,
      device: { type: 'server', os: 'server', browser: 'server' },
      referrer: null,
      path: '/checkout',
      timestamp: new Date(),
    })
  } catch (err) {
    console.error('[placeOrder] track failed:', err)
  }

  // ────────────────────────────────────────────
  // 7.5. Queue "order-placed" email (non-blocking)
  //      Email failure must NOT break order placement.
  // ────────────────────────────────────────────
  try {
    const { queueEmail } = await import('@/lib/email/queue')

    // Get items for the email (product names + quantity + price)
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_name, quantity, price')
      .eq('order_id', result.order_id)

    await queueEmail({
      template: 'order-placed',
      to: user.email!,
      userId: user.id,
      data: {
        orderId: result.order_id,
        items: orderItems ?? [],
        subtotal: result.subtotal,
        shipping: result.shipping,
        total: result.total,
        paymentMethod,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      },
    })
  } catch (err) {
    // Email failure must not break order placement
    console.error('[placeOrder] email queue failed:', err)
  }

  // ────────────────────────────────────────────
  // 8. Revalidate (unchanged)
  // ────────────────────────────────────────────
  revalidatePath('/orders')
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  revalidatePath('/products')
  revalidatePath('/')

  return {
    success: true,
    orderId: result.order_id,
    subtotal: result.subtotal,
    shipping: result.shipping,
    total: result.total,
    clientSecret,
    paymentIntentId,
    paymentProvider: paymentMethod,
  }
}