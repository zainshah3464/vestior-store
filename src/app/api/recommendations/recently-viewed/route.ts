import { NextRequest, NextResponse } from 'next/server'
import { getProductsByIds } from '@/lib/recommendations/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get('ids') ?? ''
  const ids = idsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 12)

  if (ids.length === 0) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await getProductsByIds(ids)
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}