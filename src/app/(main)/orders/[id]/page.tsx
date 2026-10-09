import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { fetchOrderDetail } from '@/lib/orders/queries'
import CustomerOrderDetail from './CustomerOrderDetail'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Authenticate
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Load order detail
  const detail = await fetchOrderDetail(id)
  if (!detail) notFound()

  // Ownership check
  if (detail.order.userId !== user.id) {
    redirect('/orders')
  }

  return <CustomerOrderDetail detail={detail} />
}