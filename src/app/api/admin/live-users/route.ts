/**
 * GET /api/admin/live-users
 *
 * Returns sessions active in the last 5 minutes.
 * Admin-only.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLiveSessions } from '@/lib/tracking/session-queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Auth check
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

  try {
    const sessions = await getLiveSessions(5)
    return NextResponse.json({ sessions })
  } catch (err) {
    console.error('[live-users] failed:', err)
    return NextResponse.json({ sessions: [] })
  }
}