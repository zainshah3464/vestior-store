import { notFound } from 'next/navigation'
import { getInvoiceData } from '@/lib/invoice/generate'
import InvoiceView from '@/components/invoice/InvoiceView'

export const dynamic = 'force-dynamic'

export default async function AdminInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceData(id)
  if (!invoice) notFound()

  return <InvoiceView invoice={invoice} mode="admin" />
}