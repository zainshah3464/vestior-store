'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

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
}

export async function placeOrder(
  items: CartItemInput[],
  address: AddressInput
): Promise<PlaceOrderResult> {
  // ────────────────────────────────────────────
  // 1. Validate input shape
  // ────────────────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty')
  }
  if (items.length > MAX_DISTINCT_ITEMS * 3) {
    // Allow some slack before merge, but cap raw abuse
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
  // 2. Merge duplicate product_id entries
  //    (same product added twice = one line)
  // ────────────────────────────────────────────
  const mergedMap = new Map<string, number>()
  for (const item of items) {
    const prev = mergedMap.get(item.product_id) ?? 0
    mergedMap.set(item.product_id, prev + item.quantity)
  }

  if (mergedMap.size > MAX_DISTINCT_ITEMS) {
    throw new Error('Too many distinct items in cart')
  }

  // Re-check quantity cap AFTER merging
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
  // 3. Authenticate caller
  // ────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to place an order')
  }

  // ────────────────────────────────────────────
  // 4. Call the atomic Postgres RPC
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
    // Supabase returns the RAISE EXCEPTION message as-is in `error.message`.
    // Do NOT regex-strip — messages may contain their own colons.
    const raw = (error.message || '').trim()
    // Some Supabase errors prepend "PostgresError: " or a code — strip only that known prefix.
    const cleaned = raw
      .replace(/^PostgresError:\s*/i, '')
      .replace(/^P\d{4}:\s*/, '')
      .trim()
    throw new Error(cleaned || 'Failed to place order')
  }

  // ────────────────────────────────────────────
  // 5. Revalidate cached routes
  // ────────────────────────────────────────────
  revalidatePath('/orders')
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  revalidatePath('/products')
  revalidatePath('/')

  // ────────────────────────────────────────────
  // 6. Return result
  // ────────────────────────────────────────────
  const result = data as {
    order_id: string
    subtotal: number
    shipping: number
    total: number
  }

  return {
    success: true,
    orderId: result.order_id,
    subtotal: result.subtotal,
    shipping: result.shipping,
    total: result.total,
  }
}