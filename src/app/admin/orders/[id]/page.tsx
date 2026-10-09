import { notFound } from 'next/navigation'
import { fetchOrderDetail } from '@/lib/orders/queries'
import OrderDetailAdmin from './OrderDetailAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await fetchOrderDetail(id)

  if (!detail) notFound()

  return <OrderDetailAdmin detail={detail} />
}