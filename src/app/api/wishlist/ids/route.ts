import { NextResponse } from 'next/server'
import { getWishlistProductIds } from '@/lib/wishlist/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const ids = await getWishlistProductIds()
    return NextResponse.json({ ids })
  } catch {
    return NextResponse.json({ ids: [] })
  }
}