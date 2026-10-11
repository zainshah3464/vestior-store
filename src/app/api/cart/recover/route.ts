import { NextRequest, NextResponse } from 'next/server'
import { findCartByToken } from '@/lib/carts/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  try {
    const cart = await findCartByToken(token)
    if (!cart || cart.recovered_at) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    return NextResponse.json({
      items: cart.items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        images: i.image ? [i.image] : [],
        stock: 999, // will be refreshed on cart page
        size: i.size,
      })),
    })
  } catch (err) {
    console.error('[cart/recover] failed:', err)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}