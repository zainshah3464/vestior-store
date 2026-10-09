/**
 * Admin-only endpoint that returns payment details from MongoDB.
 *
 * Auth: verifies the caller is an authenticated admin.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchPaymentDetail } from '@/lib/payments/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Verify admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Extract order ID
  const orderId = req.nextUrl.searchParams.get('orderId')
  if (!orderId) {
    return NextResponse.json(
      { error: 'Missing orderId' },
      { status: 400 }
    )
  }

  // 3. Fetch and return
  const detail = await fetchPaymentDetail(orderId)
  return NextResponse.json(detail)
}