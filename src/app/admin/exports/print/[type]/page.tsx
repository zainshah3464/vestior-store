import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  getOrdersForExport,
  getPaymentsForExport,
  getEmailsForExport,
  getUsersForExport,
  getAuditForExport,
  type ExportFilters,
} from '@/lib/exports/queries'
import ExportPrintView, {
  type PrintColumn,
} from '@/components/admin/ExportPrintView'

export const dynamic = 'force-dynamic'

const VALID_TYPES = ['orders', 'payments', 'emails', 'users', 'audit'] as const
type ExportType = (typeof VALID_TYPES)[number]

export default async function ExportPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { type } = await params
  const sp = await searchParams

  if (!VALID_TYPES.includes(type as ExportType)) notFound()

  // Auth + admin check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const filters: ExportFilters = {
    fromDate: typeof sp.fromDate === 'string' ? sp.fromDate : undefined,
    toDate: typeof sp.toDate === 'string' ? sp.toDate : undefined,
    status: typeof sp.status === 'string' ? sp.status : undefined,
    provider: typeof sp.provider === 'string' ? sp.provider : undefined,
  }

  const t = type as ExportType
  let rows: Record<string, unknown>[] = []
  let columns: PrintColumn[] = []
  let title = ''

  switch (t) {
    case 'orders': {
      const data = await getOrdersForExport(filters)
      rows = data as unknown as Record<string, unknown>[]
      title = 'Orders Export'
      columns = [
        { key: 'order_id', label: 'Order ID' },
        { key: 'created_at', label: 'Date', format: 'date' },
        { key: 'customer_email', label: 'Customer' },
        { key: 'status', label: 'Status' },
        { key: 'payment_status', label: 'Payment' },
        { key: 'payment_provider', label: 'Provider' },
        { key: 'subtotal', label: 'Subtotal', format: 'currency' },
        { key: 'shipping', label: 'Shipping', format: 'currency' },
        { key: 'total', label: 'Total', format: 'currency' },
        { key: 'items_count', label: 'Items' },
        { key: 'shipping_city', label: 'City' },
      ]
      break
    }

    case 'payments': {
      const data = await getPaymentsForExport(filters)
      rows = data as unknown as Record<string, unknown>[]
      title = 'Payments Export'
      columns = [
        { key: 'order_id', label: 'Order ID' },
        { key: 'created_at', label: 'Date', format: 'date' },
        { key: 'provider', label: 'Provider' },
        { key: 'provider_txn_id', label: 'Transaction ID' },
        { key: 'amount', label: 'Amount', format: 'currency' },
        { key: 'currency', label: 'Currency' },
        { key: 'status', label: 'Status' },
        { key: 'method', label: 'Method' },
      ]
      break
    }

    case 'emails': {
      const data = await getEmailsForExport(filters)
      rows = data as unknown as Record<string, unknown>[]
      title = 'Emails Export'
      columns = [
        { key: 'sent_at', label: 'Sent At', format: 'date' },
        { key: 'template', label: 'Template' },
        { key: 'recipient', label: 'Recipient' },
        { key: 'status', label: 'Status' },
        { key: 'message_id', label: 'Message ID' },
        { key: 'error', label: 'Error' },
      ]
      break
    }

    case 'users': {
      const data = await getUsersForExport()
      rows = data as unknown as Record<string, unknown>[]
      title = 'Users Export'
      columns = [
        { key: 'user_id', label: 'User ID' },
        { key: 'full_name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'role', label: 'Role' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'created_at', label: 'Joined', format: 'date' },
      ]
      break
    }

    case 'audit': {
      const data = await getAuditForExport(filters)
      rows = data as unknown as Record<string, unknown>[]
      title = 'Audit Logs Export'
      columns = [
        { key: 'timestamp', label: 'Timestamp', format: 'date' },
        { key: 'actor_email', label: 'Actor' },
        { key: 'action', label: 'Action' },
        { key: 'target_type', label: 'Target Type' },
        { key: 'target_id', label: 'Target ID' },
        { key: 'ip_hash', label: 'IP Hash' },
      ]
      break
    }
  }

  // Convert typed filters to plain object for the print view
  const plainFilters: Record<string, string | undefined> = {
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    status: filters.status,
    provider: filters.provider,
  }

  return (
    <ExportPrintView
      type={t}
      title={title}
      columns={columns}
      rows={rows}
      filters={plainFilters}
    />
  )
}