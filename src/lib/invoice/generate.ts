import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { parseProductImages } from '@/lib/utils'

export interface InvoiceData {
  invoiceNumber: string
  orderId: string
  issuedAt: string
  paidAt: string | null
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentProvider: string | null
  paymentIntentId: string | null
  customer: {
    name: string
    email: string
    phone: string
    addressLines: string[]
  }
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    lineTotal: number
    image: string | null
  }>
  subtotal: number
  shipping: number
  discount: number
  couponCode: string | null
  total: number
}

export async function getInvoiceData(
  orderId: string
): Promise<InvoiceData | null> {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) return null

  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('product_name, quantity, price, products(images)')
    .eq('order_id', orderId)

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email, phone')
    .eq('id', order.user_id)
    .single()

  const address = (order.address ?? {}) as Record<string, string>
  const addressLines: string[] = []
  if (address.line1) addressLines.push(address.line1)
  if (address.line2) addressLines.push(address.line2)
  if (address.city || address.state || address.pincode) {
    addressLines.push(
      [address.city, address.state, address.pincode].filter(Boolean).join(', ')
    )
  }

  const invoiceItems = (items ?? []).map((item) => {
    const rawProduct = item.products as
      | { images: unknown }
      | { images: unknown }[]
      | null

    let images: string[] = []
    if (rawProduct) {
      const imgSource = Array.isArray(rawProduct)
        ? rawProduct[0]?.images
        : rawProduct.images
      images = parseProductImages(imgSource)
    }

    return {
      name: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.price),
      lineTotal: Number(item.price) * item.quantity,
      image: images[0] ?? null,
    }
  })

  const invoiceNumber = `INV-${orderId.slice(0, 8).toUpperCase()}`

  return {
    invoiceNumber,
    orderId: order.id,
    issuedAt: order.created_at,
    paidAt: order.paid_at ?? null,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    paymentProvider: order.payment_provider ?? null,
    paymentIntentId: order.payment_intent_id ?? null,
    customer: {
      name: profile?.full_name ?? address.full_name ?? 'Customer',
      email: order.user_email,
      phone: address.phone ?? profile?.phone ?? '',
      addressLines,
    },
    items: invoiceItems,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount_amount ?? 0),
    couponCode: order.coupon_code ?? null,
    total: Number(order.total),
  }
}