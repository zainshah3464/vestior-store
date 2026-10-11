import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getInvoiceData } from '@/lib/invoice/generate'
import InvoiceView from '@/components/invoice/InvoiceView'

export const dynamic = 'force-dynamic'

export default async function CustomerInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const invoice = await getInvoiceData(id)
  if (!invoice) notFound()

  // Verify ownership
  const { data: order } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!order || order.user_id !== user.id) {
    redirect('/orders')
  }

  return <InvoiceView invoice={invoice} mode="customer" />
}