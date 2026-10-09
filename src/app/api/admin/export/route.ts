/**
 * CSV export endpoint. Admin-only.
 *
 * GET /api/admin/export?type=orders&fromDate=...&toDate=...&status=...&provider=...
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getOrdersForExport,
  getPaymentsForExport,
  getEmailsForExport,
  getUsersForExport,
  getAuditForExport,
  type ExportFilters,
} from '@/lib/exports/queries'
import { toCSV, withBOM, csvFilename } from '@/lib/exports/csv'
import type { ExportType } from '@/lib/exports/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Auth + admin check
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

  // 2. Parse filters
  const sp = req.nextUrl.searchParams
  const type = sp.get('type') as ExportType | null

  if (!type || !['orders', 'payments', 'emails', 'users', 'audit'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type. Use: orders|payments|emails|users|audit' },
      { status: 400 }
    )
  }

  const filters: ExportFilters = {
    fromDate: sp.get('fromDate') || undefined,
    toDate: sp.get('toDate') || undefined,
    status: sp.get('status') || undefined,
    provider: sp.get('provider') || undefined,
  }

  // 3. Fetch + convert to CSV
  try {
    let csv = ''
    let filename = ''

    switch (type) {
      case 'orders': {
        const rows = await getOrdersForExport(filters)
        csv = toCSV(rows)
        filename = csvFilename('orders')
        break
      }
      case 'payments': {
        const rows = await getPaymentsForExport(filters)
        csv = toCSV(rows)
        filename = csvFilename('payments')
        break
      }
      case 'emails': {
        const rows = await getEmailsForExport(filters)
        csv = toCSV(rows)
        filename = csvFilename('emails')
        break
      }
      case 'users': {
        const rows = await getUsersForExport()
        csv = toCSV(rows)
        filename = csvFilename('users')
        break
      }
      case 'audit': {
        const rows = await getAuditForExport(filters)
        csv = toCSV(rows)
        filename = csvFilename('audit-logs')
        break
      }
    }

    // 4. Return as download
    return new NextResponse(withBOM(csv), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[export] failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export failed' },
      { status: 500 }
    )
  }
}